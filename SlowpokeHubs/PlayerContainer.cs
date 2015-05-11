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
    public class PlayerContainer : IPlayerContainer
    {
        public PlayerBody Player { get; set; }

        public IMapTile PreviousTile { get; set; }


        public PlayerContainer(PlayerBody player, IMapTile previousTile)
        {
            Player = player;
            PreviousTile = previousTile;
        }
    }
}
