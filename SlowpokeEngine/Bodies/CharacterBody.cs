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
    }
}
