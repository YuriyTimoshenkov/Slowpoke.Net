using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public class SimpleLifeContainerConfiguration : ILifeContainerConfiguration
    {
        public Shape Shape { get; set; }
        public int LifeContent { get; set; }
    }
}
