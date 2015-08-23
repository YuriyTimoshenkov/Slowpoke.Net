using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Weapons
{
    class WeaponDynamite : WeaponSimpleBullet
    {
        private int _bangRadius;
        private int _dynamiteDetonationTime;

        public WeaponDynamite(
            int dynamiteDetonationTime,
            int bangRadius,
            int damage,
            int bulletSize,
            int shootingDistance,
            int bulletSpeed,
            TimeSpan shootFrequency,
            IMechanicEngine mechanicEngine,
            string name,
            Shape shape
            )
            : base(damage, bulletSize, shootingDistance, bulletSpeed, shootFrequency, mechanicEngine, name, shape) 
        {
            _dynamiteDetonationTime = dynamiteDetonationTime;
            _bangRadius = bangRadius;
        }

        public override void Shoot(Entities.Point startPosition, Entities.Vector direction, Guid ownerId, long commandId = 0)
        {
            var dynamite = new DynamitBody(
                new ShapeCircle(_bulletSize, startPosition),
                direction,
                _mechanicEngine,
                _damage,
                _bulletSpeed,
                _dynamiteDetonationTime,
                _bangRadius,
                ownerId);

            _mechanicEngine.AddBody(dynamite);
        }
    }
}
