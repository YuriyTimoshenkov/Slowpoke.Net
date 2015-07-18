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
using System.Globalization;

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

        private void ChangeBodyDirection(long commandId, double x, double y)
        {
            System.Diagnostics.Debug.WriteLine(string.Format("Change direction: {0}, dX {1}, dy {2}", commandId.ToString(), x.ToString(), y.ToString()
                ));

            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if(player != null)
                player.ChangeDirection(commandId, new Vector(x, y));
		}

        private void Shoot(long commandId)
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if (player != null)
                player.Shoot(commandId);
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

                _logger.Info(string.Format("Current player tile  X: {0}, Y: {1}", currentTile.Position.X, currentTile.Position.Y));

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
                foreach (InputCommand command in commands.OrderBy(v => v.Id))
                {
                    switch (command.Name)
                    {
                        case "Move":
                            {
                                System.Diagnostics.Debug.WriteLine(string.Format("1st id:{3},  duration: {2}, dX {0}, dy {1}", command.Data[0][1].ToString(), command.Data[1][1].ToString(), command.Data[2][1].ToString(), command.Id.ToString()));

                                MoveBody(
                                    command.Id,
                                    double.Parse(command.Data.FirstOrDefault(v => v[0] == "X")[1]),
                                    double.Parse(command.Data.FirstOrDefault(v => v[0] == "Y")[1]),
                                    int.Parse(command.Data.FirstOrDefault(v => v[0] == "Duration")[1]));
                                break;
                            }
                        case "ChangeDirection":
                            {
                                ChangeBodyDirection(
                                    command.Id,
                                    double.Parse(command.Data.FirstOrDefault(v => v[0] == "X")[1]),
                                    double.Parse(command.Data.FirstOrDefault(v => v[0] == "Y")[1]));
                                break;
                            }
                        case "Shoot":
                            {
                                Shoot(command.Id);
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

                if (inputEvent.use) { Use(); }

                if (inputEvent.shoot) { Shoot(0); }

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