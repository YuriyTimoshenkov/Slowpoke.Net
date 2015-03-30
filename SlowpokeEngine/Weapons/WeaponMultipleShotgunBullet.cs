using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SlowpokeEngine.Weapons
{
    class WeaponMultipleShotgunBullet : WeaponSimpleBullet
    {
        double[] _bulletDeviationRadians = { 0.01, 0.025, 0.045, 
                                     0, 
                                     -0.01, -0.025, -0.045 };
        public WeaponMultipleShotgunBullet(
            int damage,
            int bulletSize,
            int shootingDistance,
            int bulletSpeed,
            TimeSpan shootFrequency,
            IMechanicEngine mechanicEngine
            ):base(damage, bulletSize, shootingDistance, bulletSpeed, shootFrequency,mechanicEngine) {}

        protected override List<Bullet> CreateBullet(Point startPosition, Vector direction)
        {
            return Enumerable.Range(0, 7).Select(i =>
                {
                    var dirX = direction.X * Math.Cos(_bulletDeviationRadians[i]) - direction.Y * Math.Sin(_bulletDeviationRadians[i]);
                    var dirY = direction.X * Math.Sin(_bulletDeviationRadians[i]) + direction.Y * Math.Cos(_bulletDeviationRadians[i]);

                    var newDirection = new Vector(dirX, dirY);

                    return new Bullet(_shootingDistance, _bulletSpeed, _damage, new ShapeCircle(_bulletSize, startPosition), newDirection, _mechanicEngine);
                }).ToList();
        }
    }
}
