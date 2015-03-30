using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SlowpokeEngine.Engines.Map;
using System.Collections.Generic;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class MapEngineTests
    {
        [TestMethod]
        public void Init_and_getproperties_success()
        {
            List<List<IMapTile>> tiles = new List<List<IMapTile>>{
            new List<IMapTile> {new MapTile("earth"),new MapTile("earth")},
            new List<IMapTile> {new MapTile("earth"),new MapTile("earth")},
            };

            IMap map = new Map(tiles, 50);
            IMapEngine mapEngine = new MapEngine(map);

            Assert.IsNotNull(mapEngine.Map.Tiles);
            Assert.IsTrue(mapEngine.Map.Width == 2 && mapEngine.Map.Height == 2);
        }
    }
}
