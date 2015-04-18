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
        public IList<Body> Bodies { get;  set; }

        public IList<IMapTile> Map { get; set; }
    }
}
