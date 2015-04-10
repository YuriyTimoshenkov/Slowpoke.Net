using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.View
{
    public class ViewFrame : IViewFrame
    {
        public IList<ActiveBody> Bodies { get;  set; }

        public IList<MapTile> Map { get; set; }
    }
}
