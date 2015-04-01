using System.Collections;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;
using System.Collections.Concurrent;
using System;
using SlowpokeEngine.Engines.Map;
using System.Linq;

namespace SlowpokeEngine.Engines.Map
{
    public class MapEngine : IMapEngine
    {
        public IMap Map { get; private set; }

        public ConcurrentDictionary<Guid, ActiveBody> Bodies { get; private set; }

        private ConcurrentDictionary<Guid, IMapTile> _bodiesToTilesCollection =
            new ConcurrentDictionary<Guid, IMapTile>();

        public MapEngine(IMap map)
        {
            Map = map;
            Bodies = new ConcurrentDictionary<Guid, ActiveBody>();
        }

        public IEnumerable<Body> GetBodiesForCollision(ActiveBody body)
        {
            List<Body> result = new List<Body>();

            IMapTile mapTile;

            if (_bodiesToTilesCollection.TryGetValue(body.Id, out mapTile))
            {
                var tileX = (int)mapTile.Position.X;
                var tileY = (int)mapTile.Position.Y;

                //get all surround tiles
                foreach (var x in Enumerable.Range(
                    tileX > 0 ? tileX - 1 : 0,
                    1 + (tileX < Map.Width ? 1 : 0) + (tileX > 0 ? 1 : 0)))
                {
                    foreach (var y in Enumerable.Range(
                        tileY > 0 ? tileY - 1 : 0,
                        1 + (tileY < Map.Height ? 1 : 0) + (tileY > 0 ? 1 : 0)))
                    {
                        IMapTile tile = Map.Tiles[y][x];
                        //Add active bodies
                        foreach (var tileBody in tile.Bodies.Where(v => v != body))
                        {
                            result.Add(tileBody);
                        }

                        //add tile if solid
                        if (tile.Solid)
                        {
                            result.Add(new PassiveBody(tile.Shape));
                        }
                    }
                }
            }

            return result;
        }
        public void AddActiveBody(ActiveBody body)
        {
            var bodyTile = GetBodyTile(body);

            Bodies.TryAdd(body.Id, body);
            bodyTile.Bodies.Add(body);
            _bodiesToTilesCollection.TryAdd(body.Id, bodyTile);
        }
        public void UpdateActiveBody(ActiveBody body)
        {
            IMapTile mapTile;

            if(_bodiesToTilesCollection.TryGetValue(body.Id, out mapTile))
            {
                mapTile.Bodies.Remove(body);

                var bodyTile = GetBodyTile(body);

                bodyTile.Bodies.Add(body);
                
                _bodiesToTilesCollection.AddOrUpdate(body.Id, bodyTile, (k, v) =>
                {
                    return bodyTile;
                });
            }
        }
        private IMapTile GetBodyTile(ActiveBody body)
        {
            var x = (int)body.Shape.Position.X / Map.CellSize;
            var y = (int)body.Shape.Position.Y / Map.CellSize;

            return Map.Tiles[y][x];
        }
    }
}