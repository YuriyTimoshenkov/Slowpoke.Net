using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Levels
{
    public interface ILevelTile
    {
        string TileTypeName { get; }
        List<string> NPCTypes { get; }
        Point Position { get; }
    }
}
