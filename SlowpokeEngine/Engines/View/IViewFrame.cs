using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.View
{
    public interface IViewFrame
    {
        IList<ActiveBody> Bodies { get; }
        IList<MapTile> Map { get; }
    }
}
