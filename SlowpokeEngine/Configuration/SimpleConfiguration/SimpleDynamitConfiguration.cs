using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public class SimpleDynamitConfiguration : SimpleWeaponSimpleBulletConfiguration, IDynamitConfiguration
    {
        public int DetonationTime { get; set; }
        public int BangRadius { get; set; }
    }
}
