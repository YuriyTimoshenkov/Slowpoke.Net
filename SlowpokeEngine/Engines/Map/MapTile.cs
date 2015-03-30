using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Map
{
    public class MapTile : IMapTile
    {
        public MapTile(string terrainType)
        {
            TerrainType = terrainType;
        }
        public string TerrainType
        {
            get;
            private set;
        }
    }
}
