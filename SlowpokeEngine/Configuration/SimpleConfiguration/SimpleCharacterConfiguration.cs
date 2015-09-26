using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public class SimpleCharacterConfiguration : ICharacterConfiguration
    {
        public Shape Shape { get; set; }
        public int Life { get; set; }
        public int LifeMax { get; set; }
        public int ViewZone { get; set; }
        public int Speed { get; set; }
    }
}
