using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Engines.View;
using SlowpokeHubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NPCClient
{
    public class ActiveBodyEyesightFacade : IActiveBodyEyesightFacade
    {
        public ConcurrentDictionary<Guid, IViewFrame> PlayersFrames = new ConcurrentDictionary<Guid, IViewFrame>();
        public IViewFrame GetFrame(Guid playerId, SlowpokeEngine.Engines.Map.IMapTile previousTile)
        {   
            if (!PlayersFrames.ContainsKey(playerId))
            {
                return new ViewFrame()
                {
                     Bodies = new List<Body>(),
                     Map = (IList<IMapTile>)new List<MapTile>()
                };
            }
            else
            {
                return PlayersFrames[playerId];
            }
        }

        public SlowpokeEngine.Engines.Map.IMap Map
        {
            get { throw new NotImplementedException(); }
        }

        public SlowpokeEngine.Engines.Map.IMapTile GetPlayerCurrentTile(Guid playerId)
        {
            throw new NotImplementedException();
        }
    }
}
