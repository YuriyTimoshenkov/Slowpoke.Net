using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
    /// <summary>
    /// Оставлю тут это тут но актуально для всего кода try/catch log -> throw
    /// Лучше писать по ходу разработки ибо потом может свалить сервер в самом не ожиданном месте 
    /// </summary>
	public class MechanicEngine : IMechanicEngine
	{
        /// <summary>
        /// Правда поле ? доступное для изменений и перетирания из вне? 
        /// </summary>
		public ConcurrentQueue<Tuple<BodyAction, ActiveBody>> ActionQueue = new ConcurrentQueue<Tuple<BodyAction, ActiveBody>>();

		private CancellationTokenSource _cancelationTokenSource;
		private readonly IPhysicalEngine _physicalEngine; //у переменной есть тип в котором явно есть слово Engine
        private readonly IMapEngine _mapEngine; //у переменной есть тип в котором явно есть слово Engine
        private readonly IBodyBuilder _bodyBuilder;//у переменной есть тип в котором явно есть слово builder

		public MechanicEngine(IPhysicalEngine physicalEngine, IMapEngine mapEngine, IBodyBuilder bodyBuilder)
		{
			_physicalEngine = physicalEngine;
			_mapEngine = mapEngine;
			_bodyBuilder = bodyBuilder;
		}

        //BodyAction <=> ActionBody я уже путаюсь 
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
