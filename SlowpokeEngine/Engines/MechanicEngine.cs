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

namespace SlowpokeEngine.Engines
{
	public class MechanicEngine : IMechanicEngine
	{
		private ConcurrentQueue<GameCommand> ActionQueue = new ConcurrentQueue<GameCommand>();

		private CancellationTokenSource _cancelationTokenSource;
		private readonly IPhysicalEngine _physicalEngine;
		private readonly IMapEngine _mapEngine;
		private readonly IBodyBuilder _bodyBuilder;
        private IGameLevelRepository _gameLevelRepository;
        private Action<IPlayerBodyFacade> _playerStateHandler;

        
        private readonly ActionHandlersManager<Func<GameCommand, PhysicsProcessingResult,bool>, Action<GameCommand, PhysicsProcessingResult>> _actionHandlers
            = new ActionHandlersManager<Func<GameCommand, PhysicsProcessingResult, bool>, Action<GameCommand, PhysicsProcessingResult>>();

		public IActiveBodyEyesight ViewPort { get; private set; }
        public IList<IMechanicService> Services { get; private set; }
        public ICollection<Body> Bodies { get { return _mapEngine.Bodies.Values;  } }
        public IMap Map { get { return _mapEngine.Map; } }

		public MechanicEngine(
			IPhysicalEngine physicalEngine, 
			IMapEngine mapEngine, 
			IBodyBuilder bodyBuilder,
            IActiveBodyEyesight viewPort,
            IGameLevelRepository gameLevelRepository
		)
		{
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
			while (!_cancelationTokenSource.Token.IsCancellationRequested)
			{
				GameCommand nextCommand;
                
                if (ActionQueue.TryDequeue(out nextCommand))
				{
                    //Execute command
                    nextCommand.Execute();
				}

                UpdateBodies();

                UpdateServices();
			}
		}

        public void StartEngine(Action<IPlayerBodyFacade> playerStateHandler)
		{
            BuildWorld();

            _playerStateHandler = playerStateHandler;
			_cancelationTokenSource = new CancellationTokenSource();
			new Task(EventLoop, _cancelationTokenSource.Token).Start();
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

		public IPlayerBodyFacade LoadPlayerBody(Guid characterId)
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
            playerBody.Shape = new ShapeCircle(20, new Point(275, 575));
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
            //Bullets collision
            _actionHandlers.AddHandler((gameCommand, result) =>
                    {
                        return result is PhysicsProcessingResultCollision
                            && gameCommand.ActiveBody is Bullet; 
                    },
                    (gameCommand, result) =>
                    {
                        var resultCollision = (PhysicsProcessingResultCollision)result;
                        var bullet = (Bullet)gameCommand.ActiveBody;
                        ReleaseBody(gameCommand.ActiveBody.Id);

                        foreach(var body in resultCollision.Bodies)
                        {
                            if(body is ActiveBody)
                            {
                                var activeBody = ((ActiveBody)body);
                                activeBody.Harm(bullet.Damage);

                                if (activeBody.Life <= 0)
                                    ReleaseBody(activeBody.Id);
                            }
                        }
                    });

            //Usable containers collision
            _actionHandlers.AddHandler((gameCommand, result) =>
            {
                return result is PhysicsProcessingResultCollision
                    && gameCommand.ActiveBody is PlayerBody 
                    && ((PhysicsProcessingResultCollision)result).Bodies[0] is IUsableBody;
            },
                    (gameCommand, result) =>
                    {
                        var resultCollision = (PhysicsProcessingResultCollision)result;
                        var player = (PlayerBody)gameCommand.ActiveBody;
                        
                        //Set usable container
                        player.UsableBodyInScope = (IUsableBody)resultCollision.Bodies[0];
                    });
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
    }
}
