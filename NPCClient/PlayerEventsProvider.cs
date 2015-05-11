using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace NPCClient
{
    public class PlayerEventsProvider : IPlayerEventsProvider
    {
        private IClientMechanicEngine _mechanicEngine;
        private int _pingPerSecond;
        private Dictionary<Guid, ServerProxy> _playersProxies = new Dictionary<Guid, ServerProxy>();
        private CancellationTokenSource _cancelationTokenSource;
        private string _serverUrl;

        public PlayerEventsProvider(
            IClientMechanicEngine mechanicEngine,
            int pingPerSecond,
            string serverUrl)
        {
            _mechanicEngine = mechanicEngine;
            _pingPerSecond = pingPerSecond;
            _serverUrl = serverUrl;
        }

        public void Run()
        {
            _cancelationTokenSource = new CancellationTokenSource();
            Task.Factory.StartNew(Loop, _cancelationTokenSource.Token);
        }

        public void Stop()
        {
            _cancelationTokenSource.Cancel();
        }

        public void AddPlayer(NPCAI player)
        {
            _playersProxies.Add(player.PlayerId, new ServerProxy(player.PlayerId, _serverUrl));
        }

        private void Loop()
        {
            int syncCycleDuration = 1000 / _pingPerSecond;

            try
            {
                StartGame();

                while (!_cancelationTokenSource.Token.IsCancellationRequested)
                {
                    var sycleStart = DateTime.Now;

                    SyncPlayerEvents();

                    //Wait for sync cycle duration if needed
                    var spentTime = DateTime.Now - sycleStart;
                    var timeRemained = syncCycleDuration - spentTime.TotalMilliseconds;

                    if (timeRemained > 0)
                        Thread.Sleep((int)timeRemained);
                }
            }
            catch (Exception exp)
            {
                Console.WriteLine(exp.Message);

                Loop();
            }
        }

        private void SyncPlayerEvents()
        {
            var tasks = new Task[_mechanicEngine.Players.Count];
            int i = 0;

            foreach (var player in _mechanicEngine.Players.Values)
            {
                _mechanicEngine.PlayerEvents[player.PlayerId] = new SlowpokeHubs.InputEvent();

                player.UpdateState();

                //Sync with server
                var playerProxy = _playersProxies[player.PlayerId];

                if (_mechanicEngine.PlayerEvents.ContainsKey(player.PlayerId))
                {
                    playerProxy.ProcessInputEvents(_mechanicEngine.PlayerEvents[player.PlayerId]);
                }
                tasks[i] = playerProxy.GetFrames(v =>
                {
                    if (v != null)
                        (_mechanicEngine.ViewPort as ActiveBodyEyesightFacade).PlayersFrames[player.CharacterId] = v;

                    Console.WriteLine(string.Format("NPC {0}, sync iteration finished.", player.CharacterId));
                });

                i++;
            }

            Task.WaitAll(tasks);
        }

        private void StartGame()
        {
            var tasks = new Task[_mechanicEngine.Players.Count];
            int i = 0;

            foreach (var player in _mechanicEngine.Players.Values)
            {
                var playerProxy = _playersProxies[player.PlayerId];
                tasks[i] = playerProxy.StartGame(v => player.CharacterId = v.Id);

                i++;
            }

            Task.WaitAll(tasks);
        }
    }
}
