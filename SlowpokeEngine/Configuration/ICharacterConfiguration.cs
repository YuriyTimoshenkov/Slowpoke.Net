using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public interface ICharacterConfiguration
    {
        Shape Shape { get; set; }
        int Life { get; set; }
        int LifeMax { get; set; }
        int ViewZone { get; set; }
        int Speed { get; set; }
    }
}
