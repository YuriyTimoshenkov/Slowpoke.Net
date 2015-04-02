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

namespace SlowpokeEngine.Engines
{
	public class MechanicEngine : IMechanicEngine
	{
		public ConcurrentQueue<GameCommand> ActionQueue = new ConcurrentQueue<GameCommand>();

		private CancellationTokenSource _cancelationTokenSource;
		private readonly IPhysicalEngine _physicalEngine;
		private readonly IMapEngine _mapEngine;
		private readonly IBodyBuilder _bodyBuilder;

        
        private readonly ActionHandlersManager<Func<GameCommand, PhysicsProcessingResult,bool>, Action<GameCommand, PhysicsProcessingResult>> _actionHandlers
            = new ActionHandlersManager<Func<GameCommand, PhysicsProcessingResult, bool>, Action<GameCommand, PhysicsProcessingResult>>();

		public IViewPort ViewPort { get; private set; }

		public MechanicEngine(
			IPhysicalEngine physicalEngine, 
			IMapEngine mapEngine, 
			IBodyBuilder bodyBuilder,
			IViewPort viewPort
		)
		{
			_physicalEngine = physicalEngine;
			_mapEngine = mapEngine;
			_bodyBuilder = bodyBuilder;

			ViewPort = viewPort;

            BuildPhysicsResultHandlers();
		}

		public void ProcessAction(GameCommand command)
		{
            ActionQueue.Enqueue(command);
		}


	    private Task _eventLoopTask;
		private void EventLoop()
		{
			while (!_cancelationTokenSource.Token.IsCancellationRequested)
			{
				GameCommand nextCommand;

                if (ActionQueue.TryDequeue(out nextCommand))
				{
                    //Execute command
                    nextCommand.Execute();

                    //Update all bodies
                    UpdateBodies();
				}
				else
				{
					Thread.Sleep(100);
				}
			}
		}

		public void StartEngine()
		{
            BuildWorld();

			_cancelationTokenSource = new CancellationTokenSource();
			_eventLoopTask = new Task(EventLoop, _cancelationTokenSource.Token, TaskCreationOptions.LongRunning);
		    _eventLoopTask.Start();
		}


		public void StopEngine()
		{
			_cancelationTokenSource.Cancel();
		}

		public void AddActiveBody(ActiveBody body)
		{
            _mapEngine.AddActiveBody(body);
            body.Run();
		}

		public IPlayerBodyFacade LoadPlayerBody(Guid characterId)
		{
            var player = _bodyBuilder.LoadPlayerBody(characterId, this);

            AddActiveBody(player);

			return player;
		}

		public void ReleaseActiveBody(Guid bodyId)
		{
			ActiveBody body;

            if (_mapEngine.Bodies.TryRemove(bodyId, out body))
            {
                body.ReleaseGame();
			}
		}

		public IPlayerBodyFacade GetPlayerBody(Guid playerId)
		{
			ActiveBody playerBody;

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
            _actionHandlers.AddHandler((gameCommand, result) =>
                    {
                        return result is PhysicsProcessingResultCollision
                            && gameCommand.ActiveBody is Bullet; 
                    },
                    (gameCommand, result) =>
                    {
                        var resultCollision = (PhysicsProcessingResultCollision)result;
                        var bullet = (Bullet)gameCommand.ActiveBody;
                        ReleaseActiveBody(gameCommand.ActiveBody.Id);

                        foreach(var body in resultCollision.Bodies)
                        {
                            if(body is ActiveBody)
                            {
                                var activeBody = ((ActiveBody)body);
                                activeBody.Harm(bullet.Damage);

                                if (activeBody.Life <= 0)
                                    ReleaseActiveBody(activeBody.Id);
                            }
                        }
                    });
        }

        private void BuildWorld()
        {
            AddActiveBody(_bodyBuilder.BuildNPC(this));
            AddActiveBody(_bodyBuilder.BuildNPCAI(this));
        }

        private void UpdateBodies()
        {
            foreach(var body in _mapEngine.Bodies.Values)
            {
                body.UpdateState();
            }
        }
    }
}
