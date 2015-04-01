using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Map
{
    public interface IMapTile
    {
        string TerrainType { get; }
        IList<ActiveBody> Bodies { get; }
        bool Solid { get; }
        Point Position { get; }
        Shape Shape { get; }
    }
}
