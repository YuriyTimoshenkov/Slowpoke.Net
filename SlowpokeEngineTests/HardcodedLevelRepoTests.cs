using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SlowpokeEngine.Engines.Map;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System.Linq;
using SlowpokeEngine.Engines.Levels;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class HardcodedLevelRepoTests
    {
        [TestMethod]
        public void Parse_Tiles_Successful()
        {
            var levelRepo = new HardcodedLevelRepo();

            string[,] rawMap = new string[2, 2] {
                {"[water]", "[water]"},
                {"[water]", "[meadow][NPC1]"}
                };

            var tiles = levelRepo.BuildLevelTiles(rawMap);

            Assert.IsTrue(tiles[1][1].NPCTypes[0] == "NPC1");
        }
    }
}
