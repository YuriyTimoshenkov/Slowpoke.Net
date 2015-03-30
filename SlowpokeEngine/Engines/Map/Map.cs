using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Map
{
    public class Map : IMap
    {
        public int Height { get { return Tiles.Count; } }

        public int Width
        {
            get
            {
                return Tiles.Count > 0 ? Tiles[0].Count : 0;
            }
        }

        public List<List<IMapTile>> Tiles { get; private set; }

        public int CellSize { get; private set; }


        public Map(List<List<IMapTile>> tiles, int cellSize)
        {
            Tiles = tiles;
            CellSize = cellSize;
        }
    }
}
