using System;
using Microsoft.AspNet.SignalR;
using SlowpokeEngine;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;
using System.Linq;
using SlowpokeEngine.Actions;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using SlowpokeEngine.Entities;
using System.Security.Claims;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Engines.View;
using Common;

namespace SlowpokeHubs
{
    //[Authorize]
	public class SlowpokeHub : Hub
	{
        private static ConcurrentDictionary<string, IPlayerContainer> _connectionsPlayerMapping =
            new ConcurrentDictionary<string, IPlayerContainer>();
        private static ILogger _logger;

        public static readonly string TokenCookieName = "SlowpokeToken";
        public static readonly TimeSpan TokentDuration = new TimeSpan(1,0,0);


        public static IMechanicEngine MechanicEngine;

        public SlowpokeHub()
        {

        }

        #region private
        private void MoveBody(long commandId, double x, double y, int duration)
		{
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if (player != null)
                player.Move(commandId, new Vector(x,y), new TimeSpan(0,0,0,0,duration));
		}

        private void ChangeBodyDirection(double x, double y)
		{
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if(player != null)
                player.ChangeDirection(new Vector(x, y));
		}

        private void Shoot()
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if (player != null)
                player.Shoot();
        }

        private void Use()
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if (player != null)
                player.Use();
        }

        private void ChangeWeapon()
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if (player != null)
                player.ChangeWeapon();
        }
        private ViewFrameFacade GetFrame(IPlayerContainer playerContainer)
        {
            //Get new frame
            var newframe = MechanicEngine.ViewPort.GetFrame(playerContainer.Player.Id, playerContainer.PreviousTile);

            if (newframe != null)
            {
                //Update currrent tile
                var currentTile = MechanicEngine.ViewPort.GetPlayerCurrentTile(playerContainer.Player.Id);

                if (playerContainer.PreviousTile == null || (currentTile != null && playerContainer.PreviousTile.Position != currentTile.Position))
                {
                    playerContainer.PreviousTile = currentTile;
                }

                return ViewFrameFacade.FromViewFrame(newframe);
            }

            return new ViewFrameFacade();
        }

        private void ProcessInputCommands(IEnumerable<InputCommand> commands)
        {
            if (commands != null)
            {
                foreach (InputCommand command in commands)
                {
                    switch (command.Name)
                    {
                        case "Move":
                            {
                                MoveBody(
                                    command.Id,
                                    double.Parse(command.Data.FirstOrDefault(v => v[0] == "X")[1]),
                                    double.Parse(command.Data.FirstOrDefault(v => v[0] == "Y")[1]),
                                    int.Parse(command.Data.FirstOrDefault(v => v[0] == "Duration")[1]));
                                break;
                            }
                        default: break;
                    }
                }
            }
        }
        #endregion

        public static void Run(ILogger logger)
        {

            _logger = logger;
            var meb = new UnityMechanicEngineBuilder();
            SlowpokeHub.MechanicEngine = meb.Build();

            SlowpokeHub.MechanicEngine.StartEngine(UpdatePlayerState);
        }

        public static void UpdatePlayerState(IPlayerBodyFacade playerBodyFacade)
        {
            var playerMapping = _connectionsPlayerMapping.FirstOrDefault(v => v.Value.Player.Id == playerBodyFacade.Id);

            //Find connectionId
            if (playerMapping.Value != null)
            {
                var clientConnection = GlobalHost.ConnectionManager.GetHubContext<SlowpokeHub>().Clients.Client(playerMapping.Key);
                clientConnection.playerStateChanged(playerBodyFacade.State);
            }
        }

        public BodyFacade LoadPlayer()
        {
            try
            {
                var playerContainer = _connectionsPlayerMapping[Context.ConnectionId];
                MechanicEngine.StartGame(playerContainer.Player);

                return BodyFacade.FromBody(playerContainer.Player);
            }
            catch (Exception exp)
            {
                _logger.Error(exp);
            }

            return null;
        }
        public IMap GetMap()
        {
            try
            {
                return MechanicEngine.ViewPort.Map;
            }
            catch (Exception exp)
            {
                _logger.Error(exp);
            }

            return null;
        }

        public ViewFrameFacade SyncState(InputEvent inputEvent)
        {
            try
            {
                var playerContainer = _connectionsPlayerMapping[Context.ConnectionId];

                ProcessInputCommands(inputEvent.commands);

                //Process change direction
                if (inputEvent.changeDirection != null)
                {
                   // _logger.Info(string.Format("Player {0}, new direction {1}", playerContainer.Player.Id, (inputEvent.changeDirection.X.ToString() + "/" + inputEvent.changeDirection.Y.ToString())));
                    ChangeBodyDirection(inputEvent.changeDirection.X, inputEvent.changeDirection.Y);
                }

                if (inputEvent.use) { Use(); }

                if (inputEvent.shoot) { Shoot(); }

                if (inputEvent.weaponSwitch) { ChangeWeapon(); }

                return GetFrame(playerContainer);
            }
            catch (Exception exp)
            {
                _logger.Error(exp);
            }

            return null;
        }

		public override Task OnDisconnected (bool stopCalled)
		{
            try
            {
                IPlayerContainer playerContainer;

                if (_connectionsPlayerMapping.TryRemove(Context.ConnectionId, out playerContainer))
                {
                    MechanicEngine.ReleaseBody(playerContainer.Player.Id);
                }
            }
            catch (Exception exp)
            {
                _logger.Error(exp);
            }

			return base.OnDisconnected(stopCalled);
		}

		public override Task OnConnected ()
		{
            try
            {
                string userIdStr = Context.Request.Headers["playerId"];
                Guid userId;

                if (userIdStr != null)
                {
                    userId = Guid.Parse(userIdStr);
                }
                else
                {
                    userId = Guid.Parse(((ClaimsIdentity)Context.User.Identity).FindFirst(v => v.Type == ClaimTypes.NameIdentifier).Value);
                }

                var player = MechanicEngine.LoadPlayerBody(userId);
                var playerContainer = new PlayerContainer(
                    player,
                    null);

                _connectionsPlayerMapping.TryAdd(Context.ConnectionId, playerContainer);
            }
            catch (Exception exp)
            {
                _logger.Error(exp);
            }

			return base.OnConnected ();
		}
	}
}