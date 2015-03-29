using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SlowpokeEngine.Weapons
{
    class WeaponMultipleShotgunBullet : WeaponBase
    {
        private int _bulletSpeed;
        private int _bulletSize;
        private TimeSpan _shootFrequency;
        private DateTime _lastShoot = DateTime.Now;


        public WeaponMultipleShotgunBullet(
            int damage,
            int bulletSize,
            int shootingDistance,
            int bulletSpeed,
            TimeSpan shootFrequency,
            IMechanicEngine mechanicEngine
            ):base(damage, shootingDistance, mechanicEngine)
        {
            _bulletSpeed = bulletSpeed;
            _bulletSize = bulletSize;
            _shootFrequency = shootFrequency;
        }

        public override void Shoot(Point startPosition, Vector direction)
        {
            if (DateTime.Now - _lastShoot > _shootFrequency)
            {
                double[] radians = { 0.01, 0.025, 0.045, 
                                     0, 
                                     -0.01, -0.025, -0.045 };
               
                for (int i = 0; i < 7; i++)
                {
                    var dirX = direction.X * Math.Cos(radians[i]) - direction.Y * Math.Sin(radians[i]);
                    var dirY = direction.X * Math.Sin(radians[i]) + direction.Y * Math.Cos(radians[i]);

                    var newDirection = new Vector(dirX, dirY);
            
                    var bullet = new Bullet(_shootingDistance, _bulletSpeed, _damage, new ShapeCircle(_bulletSize, startPosition), newDirection, _mechanicEngine);
                    _mechanicEngine.AddActiveBody(bullet);
                }
                               
                _lastShoot = DateTime.Now;
            }
        }
    }
}
