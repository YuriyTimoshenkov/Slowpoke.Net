using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Weapons
{
    class WeaponDynamite : WeaponSimpleBullet
    {
        protected TimeSpan _dynamiteDetonationTick;
        protected double _bangRadius;

        public WeaponDynamite(
            int dynamiteDetonationMilliSeconds,
            int bangRadius,
            int damage,
            int bulletSize,
            int shootingDistance,
            int bulletSpeed,
            TimeSpan shootFrequency,
            IMechanicEngine mechanicEngine,
            string name
            ):base(damage, bulletSize, shootingDistance, bulletSpeed, shootFrequency,mechanicEngine, name) 
        {
            _dynamiteDetonationTick = new TimeSpan(0, 0, 0, 0, dynamiteDetonationMilliSeconds);
            _bangRadius = bangRadius;
        }

        public override void Shoot(Entities.Point startPosition, Entities.Vector direction)
        {
            var bullets = CreateBullet(startPosition, direction);

            foreach (var dynamite in bullets)
            {
                _mechanicEngine.AddBody(dynamite);
                

            }
        }

        protected override List<Bullet> CreateBullet(Entities.Point startPosition, Entities.Vector direction)
        {
            return new List<Bullet>
            {
                new BulletDynamite(_bangRadius,_shootingDistance, _bulletSpeed, _damage, new Entities.ShapeCircle(_bulletSize, startPosition), direction, _mechanicEngine)
            };
        }
    }
}
