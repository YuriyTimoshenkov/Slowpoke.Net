using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
    public class MechanicEngine : IMechanicEngine
    {
        private readonly IBodyBuilder _bodyBuilder;
        private readonly IMapEngine _mapEngine;
        private readonly IPhysicalEngine _physicalEngine;
        private CancellationTokenSource _cancelationTokenSource;
        public ConcurrentQueue<BodyAction> ActionQueue = new ConcurrentQueue<BodyAction>();

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

        public IViewPort ViewPort { get; private set; }

        public void ProcessAction(BodyAction action)
        {
            ActionQueue.Enqueue(action);
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
            _mapEngine.Bodies.Add(_bodyBuilder.BuildNPC(this));
        }

        public IPlayerBodyFacade LoadPlayerBody()
        {
            var player = _bodyBuilder.LoadPlayerBody(this);

            _mapEngine.Bodies.Add(player);

            return player;
        }

        public void ReleasePlayerBody(Guid playerId)
        {
            _mapEngine.Bodies.Do(playerId, body => body.ReleaseGame());
            _mapEngine.Bodies.Remove(playerId);
        }

        public IPlayerBodyFacade GetPlayerBody(Guid playerId)
        {
            return (IPlayerBodyFacade) _mapEngine.Bodies[playerId];
        }

        private void EventLoop()
        {
            while (!_cancelationTokenSource.Token.IsCancellationRequested)
            {
                BodyAction nextAction;
                if (ActionQueue.TryDequeue(out nextAction))
                    _physicalEngine.ProcessBodyAction(nextAction);
                else
                    Thread.Sleep(100);
            }
        }
    }
}