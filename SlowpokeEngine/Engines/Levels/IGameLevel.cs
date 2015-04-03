using SlowpokeEngine.Engines.Levels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Map
{
    public interface IGameLevel
    {
        Dictionary<string, ILevelTileType> TileTypes { get; }
        List<List<ILevelTile>> Tiles { get; }
    }
}
