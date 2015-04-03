using SlowpokeEngine.Engines.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Levels
{
    public class SimpleLevelTileType : ILevelTileType
    {
        public string Name { get; private set; }

        public string Color { get; private set; }

        public TileSolidityType Solidity { get; private set; }


        public SimpleLevelTileType(string name, string color, TileSolidityType solidity)
        {
            Name = name;
            Color = color;
            Solidity = solidity;
        }
    }
}
