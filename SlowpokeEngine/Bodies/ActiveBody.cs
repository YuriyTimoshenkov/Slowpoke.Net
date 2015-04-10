using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Extensions;
using SlowpokeEngine.Entities;
using System.Collections.Generic;
using SlowpokeEngine.Weapons;

namespace SlowpokeEngine.Bodies
{
	public abstract class ActiveBody : Body
	{
		protected readonly IMechanicEngine _mechanicEngine;

		public Guid Id { get; set; }

		public Vector Direction { get; set; }

        public string ActiveBodyType { get { return this.GetType().Name; } }

        public int Life { get; private set; }
        
        public int LifeMax { get; private set; }

        public BodyState State { get; private set; }

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
        public int WeaponsCount { get { return _weapons.Count; } }


		public ActiveBody(
			Shape shape, 
			Vector direction,
			IMechanicEngine mechanicEngine,
            int life, int lifeMax)
		{
			Id = Guid.NewGuid();
			_mechanicEngine = mechanicEngine;
			Shape = shape;
			Direction = direction;
            Life = life;
            LifeMax = lifeMax;
            _weapons = new List<WeaponBase>();
            State = BodyState.Alive;
		}

        public virtual void Run() { }

        public virtual void UpdateState() { }
        public virtual void ReleaseGame() 
        {
            State = BodyState.Dead;
        }
        public virtual void Harm(int damage)
        {
            Life -= damage;
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

            if (_currentWeaponIndex <= _weapons.Count)
                _currentWeaponIndex--;
        }

        public void Shoot()
        {
            if (CurrentWeapon != null)
            {
                //calculate start point
                // Plus 1.5 step as Weapon gunpoint
                var startPosition = Direction.MovePoint(
                    Shape.Position, Shape.MaxDimension * 1.5);

                CurrentWeapon.Shoot(startPosition, Direction);
            }
        }

        public void Heal(int healingPoints)
        {
            Life = Life + healingPoints <= LifeMax ? Life + healingPoints : LifeMax;

            if(Life > 0)
            {
                State = BodyState.Alive;
            }
        }
	}
}
