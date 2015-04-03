using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Levels
{
    public class SimpleLevelTile : ILevelTile
    {
        public string TileTypeName { get; private set; }

        public List<string> NPCTypes { get; private set; }

        public Point Position { get; private set; }

        public SimpleLevelTile(string tileTypeName, List<string> nPCTypes, Point position)
        {
            TileTypeName = tileTypeName;
            NPCTypes = nPCTypes;
            Position = position;
        }
    }
}
