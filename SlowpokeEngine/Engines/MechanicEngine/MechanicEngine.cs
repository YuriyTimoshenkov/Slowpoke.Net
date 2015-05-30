using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Actions;
using System.Collections.Generic;
using System.Linq;
using SlowpokeEngine.Extensions;
using SlowpokeEngine.Weapons;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Engines.Levels;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Engines.Services;
using Common;

namespace SlowpokeEngine.Engines
{
	public class MechanicEngine : IMechanicEngine
	{
		private ConcurrentQueue<GameCommand> ActionQueue = new ConcurrentQueue<GameCommand>();

		private CancellationTokenSource _cancelationTokenSource;
		private readonly IPhysicsEngine _physicalEngine;
		private readonly IMapEngine _mapEngine;
		private readonly IBodyBuilder _bodyBuilder;
        private IGameLevelRepository _gameLevelRepository;
        private Action<IPlayerBodyFacade> _playerStateHandler;
        private Random _randomizer = new Random();
        private ILogger _logger;

        
        private readonly ActionHandlersManager<Func<GameCommand, PhysicsProcessingResult,bool>, Action<GameCommand, PhysicsProcessingResult>> _actionHandlers
            = new ActionHandlersManager<Func<GameCommand, PhysicsProcessingResult, bool>, Action<GameCommand, PhysicsProcessingResult>>();

		public IActiveBodyEyesight ViewPort { get; private set; }
        public IList<IMechanicService> Services { get; private set; }
        public ICollection<Body> Bodies { get { return _mapEngine.Bodies.Values;  } }
        public IMap Map { get { return _mapEngine.Map; } }

		public MechanicEngine(
			IPhysicsEngine physicalEngine, 
			IMapEngine mapEngine, 
			IBodyBuilder bodyBuilder,
            IActiveBodyEyesight viewPort,
            IGameLevelRepository gameLevelRepository,
            ILogger logger
		)
		{
            _logger = logger;
			_physicalEngine = physicalEngine;
			_mapEngine = mapEngine;
			_bodyBuilder = bodyBuilder;
            _gameLevelRepository = gameLevelRepository;
			ViewPort = viewPort;
            Services = new List<IMechanicService>();

            BuildPhysicsResultHandlers();
		}

        public void AddCommand(GameCommand command)
		{
            ActionQueue.Enqueue(command);
		}

		private void EventLoop()
		{
            int oldQueueSize = 0;
            int processingVelocity = 1;

            while (!_cancelationTokenSource.Token.IsCancellationRequested)
            {
                try
                {
                    GameCommand nextCommand;

                    //Adjust queue processing velocity
                    int queueSize = ActionQueue.Count();
                    if (queueSize == 0)
                    {
                        processingVelocity = 0;
                    }
                    else
                    {
                        double queueRelativeGrowth = oldQueueSize == 0 ? queueSize : (double)queueSize / oldQueueSize;
                        processingVelocity = (int)Math.Ceiling((processingVelocity == 0 ? 1 : processingVelocity) * queueRelativeGrowth);
                    }

                    oldQueueSize = queueSize;

                    //Process batch of command
                    for (int i = 0; i < processingVelocity; i++)
                    {
                        if (ActionQueue.TryDequeue(out nextCommand))
                        {
                            //TODO: when all command would be implemented on client side, remove this shit
                            if (nextCommand.Id != 0)
                                nextCommand.ActiveBody.LastProcessedCommandId = nextCommand.Id;

                            //Execute command
                            nextCommand.Execute();
                        }
                        else
                        {
                            break;
                        }
                    }


                    if (queueSize == 0)
                    {
                        Thread.Sleep(10);
                    }

                    UpdateBodies();

                    UpdateServices();
                }
                catch (Exception exp)
                {
                    _logger.Error("Loop error", exp);
                }
            }
		}

        public void StartEngine(Action<IPlayerBodyFacade> playerStateHandler)
		{
            BuildWorld();

            _playerStateHandler = playerStateHandler;
			_cancelationTokenSource = new CancellationTokenSource();
            Task.Factory.StartNew(EventLoop, _cancelationTokenSource.Token);
		}

		public void StopEngine()
		{
			_cancelationTokenSource.Cancel();
		}

		public void AddBody(Body body)
		{
            _mapEngine.AddBody(body);

            if (body is ActiveBody)
            {
                ((ActiveBody)body).Run();
            }
		}

		public PlayerBody LoadPlayerBody(Guid characterId)
		{
            var player = _bodyBuilder.LoadPlayerBody(characterId, this);

			return player;
		}

		public void ReleaseBody(Guid bodyId)
		{
			Body body;

            if (_mapEngine.Bodies.TryGetValue(bodyId, out body))
            {
                if (_mapEngine.RemoveBody(bodyId))
                {
                    if (body is ActiveBody)
                    {
                        ((ActiveBody)body).ReleaseGame();
                    }

                    if (body is PlayerBody)
                    {
                        _playerStateHandler(body as IPlayerBodyFacade);
                    }
                }
            }
		}

        public void StartGame(IPlayerBodyFacade player)
        {
            var playerBody = player as PlayerBody;

            //Calculate start position
            var notSolidTiles = Map.Tiles.SelectMany(v => v).Where(v => 
                v.Solid == TileSolidityType.NotSolid && v.Bodies.Count == 0);
            var tilesCount = notSolidTiles.Count();

            if (tilesCount > 0)
            {
                var tileNumber = _randomizer.Next(tilesCount - 1);
                var tile = notSolidTiles.ElementAt(tileNumber);

                playerBody.Shape = new ShapeCircle(20, new Point(
                    tile.Shape.Position.X,
                    tile.Shape.Position.Y));
            }

            playerBody.Heal(playerBody.LifeMax);

            AddBody(playerBody);
        }

		public IPlayerBodyFacade GetPlayerBody(Guid playerId)
		{
			Body playerBody;

			_mapEngine.Bodies.TryGetValue (playerId, out playerBody);

			return (IPlayerBodyFacade)playerBody;
		}

        public void ProcessGameCommand(GameCommand command)
        {
            var result = _physicalEngine.ProcessBodyAction(command);

            foreach (var handler in _actionHandlers)
            {
                if (handler.Item1(command, result))
                    handler.Item2(command, result);
            }
        }

        protected virtual void BuildPhysicsResultHandlers()
        {
            var handlersBuilder = new MechanicEngineHandlersBuilder();
            //Bullets collision
            _actionHandlers.AddHandler(handlersBuilder.BuildBulletCollisionHandler(this));

            //Usable containers collision
            _actionHandlers.AddHandler(handlersBuilder.BuildUsableContainerCollisionHandler(this));
        }

        private void BuildWorld()
        {
            var gameLevel = _gameLevelRepository.LoadLevel();

            _mapEngine.LoadMap(gameLevel);

            //Fill bodies from level repo data
            foreach(var tilesLevel in gameLevel.Tiles)
                foreach(var levelTile in tilesLevel)
                {
                    //TODO: implement dynamic instantiaton
                    if(levelTile.NPCTypes.Count > 0)
                    {
                        int positionX = (int)levelTile.Position.X;
                        int positionY = (int)levelTile.Position.Y;

                        var NPCBody = _bodyBuilder.BuildNPCAI(this);

                        //TODO fix injection parameters in Unity mapping config
                        NPCBody.Shape = new ShapeCircle(20, new Point(
                            _mapEngine.Map.Tiles[positionY][positionX].Shape.Position.X,
                            _mapEngine.Map.Tiles[positionY][positionX].Shape.Position.Y));

                        AddBody(NPCBody);
                    }
                }
        }

        private void UpdateBodies()
        {
            foreach(var body in _mapEngine.Bodies.Where(v => v.Value is ActiveBody))
            {
                ((ActiveBody)body.Value).UpdateState();
            }
        }

        private void UpdateServices()
        {
            foreach(var service in Services)
            {
                service.Update();
            }
        }

        public ActiveBody FindBody(Guid bodyId)
        {
            return _mapEngine.FindBody(bodyId);
        }
    }
}
