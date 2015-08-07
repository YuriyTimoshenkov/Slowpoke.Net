using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Weapons
{
    class BulletDynamite : Bullet
    {
        public double BangRadius { get; private set; }

        public BulletDynamite(double bangRadius, int shootingDistance,
            int speed,
            int damage,
            Shape shape,
            Vector direction,
            Guid ownerId,
            IMechanicEngine mechanicEngine,
            long commandId)
            : base(shootingDistance, speed, damage, shape, direction, ownerId, mechanicEngine, commandId, "Dynamite")
        {
            BangRadius = bangRadius;
        }


    }
}
