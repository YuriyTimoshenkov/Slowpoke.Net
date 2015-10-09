using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Bodies
{
    public class CharacterBody : ActiveBody
    {
        private int _score;
        public int Score
        {
            get
            {
                return _score;
            }
        }
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

        public int ViewZone { get; private set; }

        public IList<string> SocialGroups { get; set; }

        public CharacterBody(
            Shape shape, 
			Vector direction,
			IMechanicEngine mechanicEngine,
            int life, int lifeMax,
            int viewZone,
            int speed)
            :base(shape, direction, mechanicEngine, life, lifeMax, speed)
        {
            ViewZone = viewZone;
            _score = 0;
            _weapons = new List<WeaponBase>();
            SocialGroups = new List<string>();
        }

        public void ChangeWeapon()
        {
            _currentWeaponIndex++;

            if (_weapons.Count <= _currentWeaponIndex)
            {
                _currentWeaponIndex = 0;
            }
        }

        public bool AddWeapon(WeaponBase weapon)
        {
            //Check if already exists the same weapon in the hands
            var sameWeapon = _weapons.FirstOrDefault(v => v.Name == weapon.Name);

            if(sameWeapon == null)
            {
                _weapons.Add(weapon);

                return true;
            }

            return false;
        }

        public void Shoot(long commandId = 0)
        {
            if (CurrentWeapon != null)
            {
                //calculate start point
                // Plus 1.5 step as Weapon gunpoint
                var startPosition = Direction.MovePoint(
                    Shape.Position, Shape.MaxDimension * 1.5);

                CurrentWeapon.Shoot(startPosition, Direction, this.Id, commandId);
            }
        }

        public void UpdateScore(int value)
        {
            _score += value;
        }

        public void ThrowCurrentWeapon()
        {
            if (CurrentWeapon == null)
            {
                return;
            }

            var currentWeapon = CurrentWeapon;

            //Remove weapon from list and get next one
            _weapons.RemoveAt(_currentWeaponIndex);

            if (_weapons.Count <= _currentWeaponIndex)
            {
                if (_weapons.Count != 0)
                {
                    _currentWeaponIndex = 0;
                }
                else
                {
                    _currentWeaponIndex = int.MaxValue;
                }
            }

            currentWeapon.Shape.Position = new Point(this.Shape.Position.X, this.Shape.Position.Y);
            //put weapon on the ground
            _mechanicEngine.AddBody(currentWeapon);
        }
    }
}
