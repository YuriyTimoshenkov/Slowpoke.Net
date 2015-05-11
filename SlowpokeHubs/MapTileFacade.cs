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
        public string Color {get;set;}
        public TileSolidityType Solid {get;set;}
        public Point Position {get;set;}
        public ShapeFacade Shape {get;set;}

        public MapTileFacade(string color, TileSolidityType solid, Point position, ShapeFacade shape)
        {
            Color = color;
            Solid = solid;
            Position = position;
            Shape = shape;
        }

        public static MapTileFacade FromMapTile(IMapTile mapTile)
        {
            return new MapTileFacade(mapTile.Color, mapTile.Solid, mapTile.Position, ShapeFacade.FromShape(mapTile.Shape));
        }
    }
}
