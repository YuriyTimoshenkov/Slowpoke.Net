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
        public ConcurrentDictionary<Guid, ViewFrameFacade> PlayersFrames = new ConcurrentDictionary<Guid, ViewFrameFacade>();
        public ViewFrameFacade GetFrame(Guid playerId, SlowpokeEngine.Engines.Map.IMapTile previousTile)
        {   
            if (!PlayersFrames.ContainsKey(playerId))
            {
                return new ViewFrameFacade()
                {
                     Bodies = new List<BodyFacade>(),
                     Map = new List<MapTileFacade>()
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
