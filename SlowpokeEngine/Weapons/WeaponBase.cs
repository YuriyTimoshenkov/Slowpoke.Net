using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Weapons
{
    public abstract class WeaponBase
    {
        protected int _damage;
        protected int _shootingDistance;
        protected IMechanicEngine _mechanicEngine;

        public string Name { get; private set; }

        public WeaponBase(int damage, int shootingDistance, IMechanicEngine mechanicEngine, string name)
        {
            _damage = damage;
            _shootingDistance = shootingDistance;
            _mechanicEngine = mechanicEngine;
            Name = name;
        }

        public abstract void Shoot(Point startPosition, Vector direction, Guid ownerId);
    }
}
