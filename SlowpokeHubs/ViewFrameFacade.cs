using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Engines.View;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeHubs
{
    public class ViewFrameFacade
    {
        public IList<Body> Bodies { get; set; }
        public IList<MapTile> Map { get; set; }

        public ViewFrameFacade()
        {
            Bodies = new List<Body>();
        }

        public static ViewFrameFacade FromViewFrame(IViewFrame viewFrame)
        {
            var result = new ViewFrameFacade();

            result.Bodies = viewFrame.Bodies;//.Select(v => BodyFacade.FromBody(v)).ToList();

            if (viewFrame.Map != null)
            {
                result.Map = viewFrame.Map.Select(v => (MapTile)v).ToList();
            }

            return result;
        }
    }
}
