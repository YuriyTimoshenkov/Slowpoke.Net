using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public class MechanicEngine : IMechanicEngine
	{
		public ConcurrentQueue<Tuple<BodyAction, ActiveBody>> ActionQueue = new ConcurrentQueue<Tuple<BodyAction, ActiveBody>>();

		private CancellationTokenSource _cancelationTokenSource;
		private readonly IPhysicalEngine _physicalEngine;
		private readonly IMapEngine _mapEngine;
		private readonly IBodyBuilder _bodyBuilder;

		public MechanicEngine(IPhysicalEngine physicalEngine, IMapEngine mapEngine, IBodyBuilder bodyBuilder)
		{
			_physicalEngine = physicalEngine;
			_mapEngine = mapEngine;
			_bodyBuilder = bodyBuilder;
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
					Console.WriteLine("Event has been processd for Body {0}, with result {1}, new position is x: {2}, y: {3}", nextAction.Item2.Id, result.ResultType, nextAction.Item2.Position.Item1, nextAction.Item2.Position.Item2);
				}
				else
				{
					Console.WriteLine("No actions were processed.");
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
	}
}
