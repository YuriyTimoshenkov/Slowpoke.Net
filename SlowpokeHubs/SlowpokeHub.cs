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
using SlowpokeEngine.Configuration;

namespace SlowpokeHubs
{
    //[Authorize]
	public class SlowpokeHub : Hub
	{
        private static ConcurrentDictionary<string, IPlayerContainer> _connectionsPlayerMapping =
            new ConcurrentDictionary<string, IPlayerContainer>();
        private static ILogger _logger;
        private static readonly IEngineConfiguration _engineConfiguration;

        public static readonly string TokenCookieName = "SlowpokeToken";
        public static readonly TimeSpan TokentDuration = new TimeSpan(1,0,0);


        public static IMechanicEngine MechanicEngine;

        static SlowpokeHub()
        {
            //Create engine configuration
            _engineConfiguration = new SimpleEngineConfiguration()
            {
                BoxesGenerationService = new SimpleEntityGenerationServiceConfiguration() { EntitiesCount = 50 },
                Dynamit = new SimpleDynamitConfiguration()
                {
                    BangRadius = 300,
                    DetonationTime = 1000,
                    Damage = 50,
                    BulletSize = 2,
                    ShootingDistance = 200,
                    BulletSpeed = 400,
                    ShootingFrequency = 1000,
                    Name = "Dynamit",
                    Shape = new ShapeCircle(10, new Point(0, 0))
                },
                Gun = new SimpleWeaponSimpleBulletConfiguration()
                {
                    Damage = 7,
                    BulletSize = 2,
                    ShootingDistance = 1000,
                    BulletSpeed = 1600,
                    ShootingFrequency = 1000,
                    Name = "Gun",
                    Shape = new ShapeRectangle(4, 12, new Point(0, 0))
                },
                Revolver = new SimpleWeaponSimpleBulletConfiguration()
                {
                    Damage = 5,
                    BulletSize = 2,
                    ShootingDistance = 400,
                    BulletSpeed = 1400,
                    ShootingFrequency = 300,
                    Name = "Revolver",
                    Shape = new ShapeRectangle(3, 7, new Point(0, 0))
                },
                ShortGun = new SimpleWeaponSimpleBulletConfiguration()
                {
                    Damage = 15,
                    BulletSize = 1,
                    ShootingDistance = 350,
                    BulletSpeed = 1200,
                    ShootingFrequency = 1000,
                    Name = "ShortGun",
                    Shape = new ShapeRectangle(5, 10, new Point(0, 0))
                },
                LifeContainer = new SimpleLifeContainerConfiguration()
                {
                    LifeContent = 50,
                    Shape = new ShapeCircle(30.0, new Point(200, 200))
                },
                NPC = new SimpleCharacterConfiguration()
                {
                    Shape = new ShapeCircle(40.0, new Point(200, 200)),
                    Life = 100,
                    LifeMax = 100,
                    ViewZone = 6,
                    Speed = 70
                },
                Player = new SimpleCharacterConfiguration()
                {
                    Shape = new ShapeCircle(40.0, new Point(200, 200)),
                    Life = 1000,
                    LifeMax = 1000,
                    ViewZone = 7,
                    Speed = 200
                },
                NPCGenerationService = new SimpleEntityGenerationServiceConfiguration() 
                {
                    EntitiesCount = 50 
                }
            };
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
                        case "ThrowCurrentWeapon":
                            {
                                var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

                                if (player != null)
                                    player.ThrowCurrentWeapon();

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
            SlowpokeHub.MechanicEngine = meb.Build(UpdatePlayerState, _engineConfiguration);

            SlowpokeHub.MechanicEngine.StartEngine();
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

                playerContainer.PreviousTile = null;

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

                if (inputEvent.throwWeapon) 
                {
                    var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Player.Id);

                    if (player != null)
                        player.ThrowCurrentWeapon();
                }

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