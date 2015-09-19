using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public class SimpleEntityGenerationServiceConfiguration : IEntityGenerationServiceConfiguration
    {
        public int EntitiesCount { get; set; }
    }
}
