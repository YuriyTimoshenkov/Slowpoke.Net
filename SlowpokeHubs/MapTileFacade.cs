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
    public class MapTileFacade
    {
        public Guid Id { get; private set; }
        public string Color {get;set;}
        public TileSolidityType Solid {get;set;}
        public Point Position {get;set;}
        public ShapeFacade Shape {get;set;}
        public string TileTypeName { get; set; }

        public MapTileFacade(Guid id, string color, TileSolidityType solid, Point position, ShapeFacade shape, string tileTypeName)
        {
            Id = id;
            Color = color;
            Solid = solid;
            Position = position;
            Shape = shape;
            TileTypeName = tileTypeName;
        }

        public static MapTileFacade FromMapTile(IMapTile mapTile)
        {
            return new MapTileFacade(mapTile.Id, mapTile.Color, mapTile.Solid, mapTile.Position, ShapeFacade.FromShape(mapTile.Shape), mapTile.TileTypeName);
        }
    }
}
