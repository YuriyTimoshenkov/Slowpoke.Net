using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public interface IDynamitConfiguration : IWeaponSimpleBulletConfiguration
    {
        int DetonationTime { get; set; }
        int BangRadius { get; set; }
    }
}
