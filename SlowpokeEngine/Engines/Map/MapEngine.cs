﻿using System.Collections;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;
using System.Collections.Concurrent;
using System;
using SlowpokeEngine.Engines.Map;
using System.Linq;
using SlowpokeEngine.Engines.Levels;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Engines.Map
{
    public class MapEngine : IMapEngine
    {
        public IMap Map { get; private set; }

        public ConcurrentDictionary<Guid, Body> Bodies { get; private set; }

        private ConcurrentDictionary<Guid, IMapTile> _bodiesToTilesCollection =
            new ConcurrentDictionary<Guid, IMapTile>();

        public MapEngine(IMap map)
        {
            Map = map;
            Bodies = new ConcurrentDictionary<Guid, Body>();
        }

        public IEnumerable<Body> GetBodiesForCollision(ActiveBody body)
        {
            return GetSurrounBodies(body, 1, (tile) =>
                {
                    List<Body> resultBodies = new List<Body>();
                    //Add active bodies
                    foreach (var tileBody in tile.Bodies.Where(v => v.Value != body).Select(v => v).ToList())
                    {
                        resultBodies.Add(tileBody.Value);
                    }

                    //add tile if solid
                    if (tile.Solid != TileSolidityType.NotSolid)
                    {
                        resultBodies.Add(new PassiveBody(tile.Shape));
                    }

                    return resultBodies;
                });

        }

        public void AddBody(Body body)
        {
            var bodyTile = CalculateBodyTile(body);

            Bodies.TryAdd(body.Id, body);
            bodyTile.Bodies.TryAdd(body.Id, body);
            _bodiesToTilesCollection.TryAdd(body.Id, bodyTile);
        }
        public void UpdateActiveBody(ActiveBody body)
        {
            IMapTile mapTile;
            var bodyToRemove = body as Body;

            if(_bodiesToTilesCollection.TryGetValue(body.Id, out mapTile))
            {

                if (mapTile.Bodies.TryRemove(body.Id, out bodyToRemove))
                {
                    var bodyTile = CalculateBodyTile(body);

                    if (bodyTile.Bodies.TryAdd(body.Id, body))
                    {
                        _bodiesToTilesCollection.AddOrUpdate(body.Id, bodyTile, (k, v) =>
                        {
                            return bodyTile;
                        });
                    }
                }
            }
        }
        private IMapTile CalculateBodyTile(Body body)
        {
            var x = (int)body.Shape.Position.X / Map.CellSize;
            var y = (int)body.Shape.Position.Y / Map.CellSize;

            return Map.Tiles[y][x];
        }
        public void LoadMap(IGameLevel gameLevel)
        {
            Map.Tiles.Clear();

            

            foreach (var levelTilesRow in gameLevel.Tiles)
            {
                var mapTileRow = new List<IMapTile>();

                foreach (var levelTile in levelTilesRow)
                {
                    int positionX = (int)levelTile.Position.X;
                    int positionY = (int)levelTile.Position.Y;
                    var levelTileType = gameLevel.TileTypes[levelTile.TileTypeName];

                    mapTileRow.Add(new MapTile(
                        levelTileType.Color,
                        levelTileType.Solidity,
                        new Point(positionX, positionY),
                        new ShapeRectangle(
                            Map.CellSize, Map.CellSize,
                            new Point(positionX * Map.CellSize + Map.CellSize / 2, positionY * Map.CellSize + Map.CellSize / 2)
                            ),
                        levelTile.TileTypeName));
                }

                Map.Tiles.Add(mapTileRow);
            }
        }
        public bool RemoveBody(Guid bodyId)
        {
            Body body;

            if (Bodies.TryRemove(bodyId, out body))
            { 
                IMapTile mapTile;
               
                if(_bodiesToTilesCollection.TryRemove(bodyId, out mapTile))
                {
                    return mapTile.Bodies.TryRemove(body.Id, out body);
                }
            }

            return false;
        }
        public IList<IMapTile> GetSurroundTiles(IMapTile tile, int deviation)
        {
            var tileX = (int)tile.Position.X;
            var tileY = (int)tile.Position.Y;

            int leftX = tileX - deviation;
            leftX = leftX >= 0 ? leftX : 0;

            int rightX = tileX + deviation;
            rightX = rightX >= Map.Width ? Map.Width : rightX + 1;

            int bottomY = tileY - deviation;
            bottomY = bottomY >= 0 ? bottomY : 0;

            int topY = tileY + deviation;
            topY = topY >= Map.Height ? Map.Height : topY + 1;

            List<IMapTile> result = new List<IMapTile>();

            //get all surround tiles
            foreach (var x in Enumerable.Range(leftX, rightX-leftX))
            {
                foreach (var y in Enumerable.Range(bottomY, topY - bottomY))
                {
                    result.Add(Map.Tiles[y][x]);
                }
            }

            return result;
        }

        public IEnumerable<Body> GetSurrounBodies(ActiveBody body, int deviation, Func<IMapTile, IList<Body>> bodySelector)
        {
            List<Body> result = new List<Body>();

            IMapTile mapTile;

            if (_bodiesToTilesCollection.TryGetValue(body.Id, out mapTile))
            {
                var surroundTiles = GetSurroundTiles(mapTile, 1);

                foreach (var tile in surroundTiles)
                {
                    result.AddRange(bodySelector(tile));
                }
            }

            return result;
        }

        IMapTile IMapEngine.GetBodyTile(Guid bodyId)
        {
            IMapTile tile = null;

            _bodiesToTilesCollection.TryGetValue(bodyId, out tile);

            return tile;
        }

        public ActiveBody FindBody(Guid bodyId)
        {
            Body body;
            
            if (Bodies.TryGetValue(bodyId, out body) && body is ActiveBody)
            {
                return body as ActiveBody;
            }

            return null;
        }
    }
}