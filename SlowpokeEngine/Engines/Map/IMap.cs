using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Map
{
    public interface IMap
    {
        int Height { get; }
        int Width { get; }
        List<List<IMapTile>> Tiles { get; }
        int CellSize { get; }
    }
}
