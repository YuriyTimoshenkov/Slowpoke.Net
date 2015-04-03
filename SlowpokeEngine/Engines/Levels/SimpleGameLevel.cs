using SlowpokeEngine.Engines.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Levels
{
    public class SimpleGameLevel : IGameLevel
    {
        public Dictionary<string, ILevelTileType> TileTypes { get; private set; }

        public List<List<ILevelTile>> Tiles { get; private set; }

        public SimpleGameLevel(Dictionary<string, ILevelTileType> tileTypes, List<List<ILevelTile>> tiles)
        {
            Tiles = tiles;
            TileTypes = tileTypes;
        }
    }
}
