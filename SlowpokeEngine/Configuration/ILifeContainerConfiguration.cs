using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public interface ILifeContainerConfiguration
    {
        Shape Shape { get; set; }
        int LifeContent { get; set; }
    }
}
