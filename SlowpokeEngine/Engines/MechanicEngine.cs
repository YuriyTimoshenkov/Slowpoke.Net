using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

namespace SlowpokeEngine
{
	public class MechanicEngine
	{
		public ConcurrentDictionary<Guid, ActiveBody>  Bodies = new ConcurrentDictionary<Guid, ActiveBody>();
		public ConcurrentQueue<Tuple<Action,ActiveBody>> ActionQueue  = new ConcurrentQueue<Tuple<Action, ActiveBody>>();

		private PhysicalEngine physicalEngine;
		private CancellationTokenSource cancelationTokenSource;

		public MechanicEngine(PhysicalEngine physicalEngine)
		{
			this.physicalEngine = physicalEngine;
		}

		public void ProcessAction(Action action, ActiveBody body)
		{
			ActionQueue.Enqueue(new Tuple<Action, ActiveBody>(action, body));
		}

		public void EventLoop()
		{
			while (!cancelationTokenSource.Token.IsCancellationRequested) {

				Tuple<Action,ActiveBody> nextAction;

				if (ActionQueue.TryDequeue (out nextAction)) {
					var result = physicalEngine.ProcessBodyAction (nextAction.Item1, nextAction.Item2);
					Console.WriteLine (string.Format("Event has been processd for Body {0}, with result {1}",
						nextAction.Item2.Id.ToString(), result.ResultType.ToString()));
				} else {
					Console.WriteLine ("No actions were processed.");
					Thread.Sleep (100);
				}

			}
		}

		public void StartEngine()
		{
			cancelationTokenSource = new CancellationTokenSource();
			new Task (EventLoop, cancelationTokenSource.Token, TaskCreationOptions.LongRunning).Start ();
		}

		public void StopEngine()
		{
			cancelationTokenSource.Cancel ();
		}
	}
}

