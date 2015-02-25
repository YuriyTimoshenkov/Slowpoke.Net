using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public class MechanicEngine : IActiveBodiesContainer
	{
		private readonly ConcurrentDictionary<Guid, ActiveBody> _bodies = new ConcurrentDictionary<Guid, ActiveBody>();

		public ConcurrentQueue<Tuple<Action, ActiveBody>> ActionQueue = new ConcurrentQueue<Tuple<Action, ActiveBody>>();

		private CancellationTokenSource _cancelationTokenSource;
		private readonly PhysicalEngine _physicalEngine;

		public MechanicEngine(PhysicalEngine physicalEngine)
		{
			_physicalEngine = physicalEngine;
		}

		public ConcurrentDictionary<Guid, ActiveBody> Bodies
		{
			get { return _bodies; }
		}

		public void ProcessAction(Action action, ActiveBody body)
		{
			ActionQueue.Enqueue(new Tuple<Action, ActiveBody>(action, body));
		}

		public void EventLoop()
		{
			//спорный момент 
			//я бы взял  EventWaitHandle WaitHandle;
			// public bool IsRunning
			//{
			//	get { return !WaitHandle.WaitOne(0); }
			//}
			// while(IsRunning)

			while (!_cancelationTokenSource.Token.IsCancellationRequested)
			{
				Tuple<Action, ActiveBody> nextAction;

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
	}
}