using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Actions;

namespace SlowpokeEngine.Engines
{
	public class MechanicEngine : IMechanicEngine
	{
		public ConcurrentQueue<Tuple<BodyAction, ActiveBody>> ActionQueue = new ConcurrentQueue<Tuple<BodyAction, ActiveBody>>();

		private CancellationTokenSource _cancelationTokenSource;
		private readonly IPhysicalEngine _physicalEngine;
		private readonly IMapEngine _mapEngine;
		private readonly IBodyBuilder _bodyBuilder;

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
		}

		public void ProcessAction(BodyAction action, ActiveBody body)
		{
			ActionQueue.Enqueue(new Tuple<BodyAction, ActiveBody>(action, body));
		}

		private void EventLoop()
		{
			while (!_cancelationTokenSource.Token.IsCancellationRequested)
			{
				Tuple<BodyAction, ActiveBody> nextAction;

				if (ActionQueue.TryDequeue(out nextAction))
				{
					var result = _physicalEngine.ProcessBodyAction(nextAction.Item1, nextAction.Item2);
				}
				else
				{
					Thread.Sleep(100);
				}
			}
		}

		public void StartEngine()
		{
			_cancelationTokenSource = new CancellationTokenSource();
			new Task(EventLoop, _cancelationTokenSource.Token, TaskCreationOptions.LongRunning).Start();
		}

		public void StopEngine()
		{
			_cancelationTokenSource.Cancel();
		}

		public void AddNPCBody()
		{
			var newNpcBody = _bodyBuilder.BuildNPC (this);

			_mapEngine.Bodies.TryAdd (newNpcBody.Id, newNpcBody);
		}

		public IPlayerBodyFacade LoadPlayerBody()
		{
			var player = _bodyBuilder.LoadPlayerBody(this);

			_mapEngine.Bodies.TryAdd (player.Id, player);

			return player;
		}

		public void ReleasePlayerBody(Guid playerId)
		{
			ActiveBody player;

			if (_mapEngine.Bodies.TryRemove (playerId, out player)) {
				player.ReleaseGame ();
			}
		}

		public IPlayerBodyFacade GetPlayerBody(Guid playerId)
		{
			ActiveBody playerBody;

			_mapEngine.Bodies.TryGetValue (playerId, out playerBody);

			return (IPlayerBodyFacade)playerBody;
		}
	}
}
