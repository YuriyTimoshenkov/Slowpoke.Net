using Newtonsoft.Json;
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
    public class MapTile : IMapTile
    {
        public Guid Id { get; private set; }
        public string Color
        {
            get;
            private set;
        }
        public TileSolidityType Solid { get; private set; }

        [JsonIgnore]
        public ConcurrentDictionary<Guid, Body> Bodies { get; private set; }
        public Point Position { get; private set; }
        public Shape Shape { get; private set; }
        public string TileTypeName { get; private set; }

        public MapTile(string color, TileSolidityType solid, Point position, Shape shape, string tileTypeName)
        {
            Id = Guid.NewGuid();
            Color = color;
            Bodies = new ConcurrentDictionary<Guid, Body>();
            Solid = solid;
            Position = position;
            Shape = shape;
            TileTypeName = tileTypeName;
        }
    }
}
