using SlowpokeEngine;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Entities;
using SlowpokeHubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NPCClient
{
    public class ClientMechanicEngine : IClientMechanicEngine
    {
        public ActiveBodyEyesightFacade Eyesight = new ActiveBodyEyesightFacade();
        public ConcurrentDictionary<Guid, NPCAI> Players { get; private set; }
        public ConcurrentDictionary<Guid, InputEvent> PlayerEvents { get; private set; }
        public IActiveBodyEyesightFacade ViewPort
        {
            get { return Eyesight; }
        }

        public ClientMechanicEngine()
        {
            Players = new ConcurrentDictionary<Guid, NPCAI>();
            PlayerEvents = new ConcurrentDictionary<Guid, InputEvent>();
        }


        public void AddPlayer(NPCAI player)
        {
            PlayerEvents.TryAdd(player.CharacterId, new InputEvent());
            Players.TryAdd(player.PlayerId, player);
        }

        public void Move(Vector direction, Guid bodyId, TimeSpan duration)
        {
            var inputEvent = PlayerEvents[bodyId];

            inputEvent.move = new InputEventMove()
            {
                Direction = new InputEventPoint()
                {
                    X = direction.X,
                    Y = direction.Y,
                },
                Duration = (int)duration.TotalMilliseconds
            };
        }

        public void ChangeDirection(Vector direction, Guid bodyId)
        {
            var inputEvent = PlayerEvents[bodyId];

            inputEvent.changeDirection = new InputEventPoint()
            {
                X = direction.X,
                Y = direction.Y
            };
        }

        public void Shoot(Guid bodyId)
        {
            var inputEvent = PlayerEvents[bodyId];

            inputEvent.shoot = true;
        }
    }
}
