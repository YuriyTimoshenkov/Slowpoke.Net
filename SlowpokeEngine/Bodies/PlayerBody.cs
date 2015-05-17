using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Actions;
using System.Collections.Generic;
using SlowpokeEngine.Weapons;
using SlowpokeEngine.DAL;

namespace SlowpokeEngine.Bodies
{
	public class PlayerBody : ActiveBody, IPlayerBodyFacade
	{
        public Guid SessionId { get; set; }

        public string Name { get; private set; }

        private IGameSessionRepository _sessionRepository;

        public PlayerBody(
            Shape shape,
			Vector direction,
			IMechanicEngine mechanicEngine,
            IGameSessionRepository sessionRepository,
            int life, int lifeMax,
            string name,
            int viewZone,
            int speed
            )
            : base(shape, direction, mechanicEngine, life, lifeMax, viewZone, speed)
        {
            _sessionRepository = sessionRepository;
            Name = name;
        }

		private void ProcessAction (GameCommand bodyAction)
		{
            _mechanicEngine.AddCommand(bodyAction);
		}

        public void Move(long commandId, Vector direction, TimeSpan duration)
        {
            ProcessAction(new GameCommandMove(commandId, direction, _mechanicEngine, this, duration));
        }

        public void ChangeDirection(Vector direction)
        {
            ProcessAction(new GameCommandChangeDirection(direction, _mechanicEngine, this));
        }

        public override void ReleaseGame()
        {
            _sessionRepository.CloseSession(SessionId);

            base.ReleaseGame();
        }
    }
}

