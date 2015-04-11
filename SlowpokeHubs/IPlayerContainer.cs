using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeHubs
{
    public interface IPlayerContainer
    {
        IPlayerBodyFacade Player { get; set; }
        IMapTile PreviousTile { get; set; }
    }
}
