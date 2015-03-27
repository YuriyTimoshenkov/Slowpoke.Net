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
        public List<WeaponBase> Weapons { get; private set; }

        private int _currentWeaponIndex = 0;
        public WeaponBase CurrentWeapon
        {
            get 
            {
                if (Weapons.Count > _currentWeaponIndex)
                {
                    return Weapons[_currentWeaponIndex];
                }
                else
                    return null;
            }
        }
        public Guid SessionId { get; set; }

        private IGameSessionRepository _sessionRepository;

        public PlayerBody(
            Shape shape,
			Vector direction,
			IMechanicEngine mechanicEngine,
            IGameSessionRepository sessionRepository,
            int life, int lifeMax
            ):base(shape, direction,  mechanicEngine, life, lifeMax)
        {
            Weapons = new List<WeaponBase>();
            _sessionRepository = sessionRepository;
        }

		public void ProcessAction (GameCommand bodyAction)
		{
            _mechanicEngine.ProcessGameCommand(bodyAction);
		}

        public void Move(Vector direction)
        {
            ProcessAction(new GameCommandMove(direction, _mechanicEngine, this));
        }

        public void ChangeDirection(Vector direction)
        {
            ProcessAction(new GameCommandChangeDirection(direction, _mechanicEngine, this));
        }

        public void Shoot()
        {
            if(CurrentWeapon != null)
            {
                //calculate start point
                var startPosition = Direction.MovePoint(
                    Shape.Position, Shape.MaxDimension);

                CurrentWeapon.Shoot(startPosition, Direction);
            }
        }

        public override void ReleaseGame()
        {
            _sessionRepository.CloseSession(SessionId);

            base.ReleaseGame();
        }

        public void ChangeWeapon()
        {
            _currentWeaponIndex++;

            if (Weapons.Count <= _currentWeaponIndex)
            {
                _currentWeaponIndex = 0;
            }
        }
    }
}

