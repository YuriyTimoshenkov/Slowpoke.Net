using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public class SimpleWeaponSimpleBulletConfiguration : IWeaponSimpleBulletConfiguration
    {
        public Shape Shape { get; set; }
        public int ShootingFrequency { get; set; }
        public int BulletSize { get; set; }
        public int ShootingDistance { get; set; }
        public int Damage { get; set; }
        public string Name { get; set; }
        public int BulletSpeed { get; set; }
    }
}
