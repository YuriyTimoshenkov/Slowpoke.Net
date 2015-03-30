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
        protected List<WeaponBase> _weapons { get; private set; }

        private int _currentWeaponIndex = 0;
        public WeaponBase CurrentWeapon
        {
            get 
            {
                if (_weapons.Count > _currentWeaponIndex)
                {
                    return _weapons[_currentWeaponIndex];
                }
                else
                    return null;
            }
        }
        public int WeaponsCount { get { return _weapons.Count;  } }
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
            _weapons = new List<WeaponBase>();
            _sessionRepository = sessionRepository;
        }

		private void ProcessAction (GameCommand bodyAction)
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

            if (_weapons.Count <= _currentWeaponIndex)
            {
                _currentWeaponIndex = 0;
            }
        }

        public void AddWeapon(WeaponBase weapon)
        {
            _weapons.Add(weapon);
        }

        public void ThrowAwayCurrentWeapon()
        {
            _weapons.RemoveAt(_currentWeaponIndex);
            
            if(_currentWeaponIndex <= _weapons.Count)
                _currentWeaponIndex--;
        }
    }
}

