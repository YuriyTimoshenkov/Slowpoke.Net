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

namespace SlowpokeHubs
{
    //[Authorize]
	public class SlowpokeHub : Hub
	{
        private static ConcurrentDictionary<string, IPlayerContainer> _connectionsPlayerMapping =
            new ConcurrentDictionary<string, IPlayerContainer>();
        public static readonly string TokenCookieName = "SlowpokeToken";
        public static readonly TimeSpan TokentDuration = new TimeSpan(1,0,0);

        public static IMechanicEngine MechanicEngine;

        public SlowpokeHub()
        {

        }

        public static void Run()
        {
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
            var playerContainer = _connectionsPlayerMapping[Context.ConnectionId];
            MechanicEngine.StartGame(playerContainer.Player);

            return BodyFacade.FromBody(playerContainer.Player);
		}

		public void MoveBody(long commandId, double x, double y, int duration)
		{
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            System.Diagnostics.Debug.WriteLine(string.Format(">>>> duration facade {0}", duration.ToString()));

            if (player != null)
                player.Move(commandId, new Vector(x,y), new TimeSpan(0,0,0,0,duration));
		}

        public void ChangeBodyDirection(double x, double y)
		{
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if(player != null)
                player.ChangeDirection(new Vector(x, y));
		}

        public void Shoot()
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if (player != null)
                player.Shoot();
        }

        public void Use()
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if (player != null)
                player.Use();
        }

        public void ChangeWeapon()
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

            if (player != null)
                player.ChangeWeapon();
        }

        public IMap GetMap()
        {
            return MechanicEngine.ViewPort.Map;
        }

        public ViewFrameFacade SyncState(InputEvent inputEvent)
        {
            var playerContainer = _connectionsPlayerMapping[Context.ConnectionId];

            //TODO: migrate all command to this pattern
            //Process move
            if(inputEvent.commands != null)
            {
                if (inputEvent.commands.Count() > 1)
                {
                    Console.WriteLine(">> count {0}", inputEvent.commands.Count());
                }
                foreach(InputCommand command in inputEvent.commands)
                {
                    switch(command.Name)
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

            //Process change direction
            if(inputEvent.changeDirection != null)
            {
                ChangeBodyDirection(inputEvent.changeDirection.X, inputEvent.changeDirection.Y);
            }

            if (inputEvent.use) { Use(); }

            if (inputEvent.shoot) { Shoot(); }

            if (inputEvent.weaponSwitch) { ChangeWeapon(); }

            return GetFrame(playerContainer);
        }

		public override Task OnDisconnected (bool stopCalled)
		{
			IPlayerContainer  playerContainer;

            if (_connectionsPlayerMapping.TryRemove(Context.ConnectionId, out playerContainer))
            {
                MechanicEngine.ReleaseBody(playerContainer.Player.Id);
			}

			return base.OnDisconnected(stopCalled);
		}

		public override Task OnConnected ()
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

			return base.OnConnected ();
		}

        private ViewFrameFacade GetFrame(IPlayerContainer playerContainer)
        {
            //Get new frame
            var newframe = MechanicEngine.ViewPort.GetFrame(playerContainer.Player.Id, playerContainer.PreviousTile);

            //Update currrent tile
            var currentTile = MechanicEngine.ViewPort.GetPlayerCurrentTile(playerContainer.Player.Id);

            if (playerContainer.PreviousTile == null || (currentTile != null && playerContainer.PreviousTile.Position != currentTile.Position))
            {
                playerContainer.PreviousTile = currentTile;
            }

            return ViewFrameFacade.FromViewFrame(newframe);
        }
	}
}