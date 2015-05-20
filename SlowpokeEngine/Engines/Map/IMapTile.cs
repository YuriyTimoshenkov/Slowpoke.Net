using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Map
{
    public interface IMapTile
    {
        string Color { get; }
        ConcurrentDictionary<Guid, Body> Bodies { get; }
        TileSolidityType Solid { get; }
        Point Position { get; }
        Shape Shape { get; }
        string TileTypeName { get; }
    }
}
