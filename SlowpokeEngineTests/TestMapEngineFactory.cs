using NSubstitute;
using SlowpokeEngine.Engines.Levels;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngineTests
{
    public class TestMapEngineFactory
    {
        private readonly static int _mapCellSize = 50;
        public static IMapEngine InitMapEngine()
        {
            string testTileTypeName = "TileType1";

            var gameLevel = Substitute.For<IGameLevel>();
            gameLevel.Tiles.Returns(v =>
            {
                return new List<List<ILevelTile>>(){
                    new List<ILevelTile>(){
                        new SimpleLevelTile(testTileTypeName, new List<string>(), new Point(0,0)),
                    new SimpleLevelTile(testTileTypeName, new List<string>(), new Point(0,1))}
                };
            });

            gameLevel.TileTypes.Returns(v =>
            {
                return new Dictionary<string, ILevelTileType>() {
                    {testTileTypeName, new SimpleLevelTileType(
                        testTileTypeName,
                        "#000000",
                        TileSolidityType.NotSolid)}
                };
            });


            IMap map = new Map(_mapCellSize);
            IMapEngine mapEngine = new MapEngine(map);
            mapEngine.LoadMap(gameLevel);

            return mapEngine;
        }
    }
}
