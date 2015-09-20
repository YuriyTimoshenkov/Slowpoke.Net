using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public interface IWeaponSimpleBulletConfiguration
    {
        Shape Shape { get; set; }
        int ShootingFrequency { get; set; }
        int BulletSize { get; set; }
        int BulletSpeed { get; set; }
        int ShootingDistance { get; set; }
        int Damage { get; set; }
        string Name { get; set; }
    }
}
