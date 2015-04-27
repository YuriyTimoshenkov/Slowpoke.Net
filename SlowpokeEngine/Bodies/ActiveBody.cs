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

		public Vector Direction { get; set; }

        public int Life { get; private set; }
        
        public int LifeMax { get; private set; }

        public BodyState State { get; private set; }

        private int _score;
        public int Score
        {
            get
            {
                return _score;
            }
        }

        public int ViewZone { get; private set; }

        protected IList<WeaponBase> _weapons { get; private set; }
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

        private IUsableBody _usableBodyInScope;
        private Point _lastUsableBodyActivePosition;
        public IUsableBody UsableBodyInScope
        {
            get { return _usableBodyInScope; }
            set
            {
                _usableBodyInScope = value;
                _lastUsableBodyActivePosition = new Point(this.Shape.Position.X, this.Shape.Position.Y);
            }
        }

        public IList<string> SocialGroups { get; set; }


		public ActiveBody(
			Shape shape, 
			Vector direction,
			IMechanicEngine mechanicEngine,
            int life, int lifeMax,
            int viewZone)
            : base(Guid.NewGuid(), shape)
		{
			_mechanicEngine = mechanicEngine;
			Shape = shape;
			Direction = direction;
            Life = life;
            LifeMax = lifeMax;
            _weapons = new List<WeaponBase>();
            SocialGroups = new List<string>();
            State = BodyState.Alive;
            ViewZone = viewZone;
            _score = 0;
		}

        public virtual void Run() { }
        public virtual void UpdateState() 
        {
            //Free usable body if it is no longer available
            if (UsableBodyInScope != null && _lastUsableBodyActivePosition != this.Shape.Position)
            {
                _usableBodyInScope = null;
            }
        }
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

                CurrentWeapon.Shoot(startPosition, Direction, this.Id);
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
        public void Use()
        {
            if (UsableBodyInScope != null)
            {
                UsableBodyInScope.Use(this);
                _mechanicEngine.ReleaseBody(UsableBodyInScope.Id);
            }
        }
        public void UpdateScore(int value)
        {
            _score += value;
        }
	}
}
