using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Levels
{
    public class HardcodedLevelRepo : IGameLevelRepository
    {
        private readonly string TypeGroupName = "TypeName";
        private readonly string NPCListGroupName = "NPCList";

        public IGameLevel LoadLevel()
        {
            return new SimpleGameLevel(BuildLevelTypes(), BuildLevelTiles(_rawMap));
        }

        private Dictionary<string, ILevelTileType> BuildLevelTypes()
        {
            return new Dictionary<string, ILevelTileType> { 
            {"meadow", new SimpleLevelTileType("meadow", "#C0F598", TileSolidityType.NotSolid)},
            {"water", new SimpleLevelTileType("water", "#89EBF0", TileSolidityType.Partly)},
            {"rock", new SimpleLevelTileType("rock", "#6E6E6E", TileSolidityType.Full)},
            {"road", new SimpleLevelTileType("road", "#EDC791", TileSolidityType.NotSolid)}
            };
        }

        public  List<List<ILevelTile>> BuildLevelTiles(string[,] rawMap)
        {
            var levelTiles = new List<List<ILevelTile>>();

            foreach (var row in Enumerable.Range(0, rawMap.GetLength(0)))
            {
                var newLayer = new List<ILevelTile>();

                foreach (var column in Enumerable.Range(0, rawMap.GetLength(1)))
                {
                    var matchResult = Regex.Match(
                        rawMap[row, column], 
                        string.Format(@"\[(?<{0}>[A-Za-z0-9]+)\](\[(?<{1}>[A-Za-z0-9,]*)\])?", TypeGroupName, NPCListGroupName));

                    string tileTypeName = matchResult.Groups[TypeGroupName].Value;
                    string NPCTypeName = matchResult.Groups[NPCListGroupName].Value;
                    var NPCList = new List<string>();

                    if(NPCTypeName != string.Empty)
                    {
                        NPCList.Add(NPCTypeName);
                    }

                    newLayer.Add(new SimpleLevelTile(tileTypeName, NPCList, new Point(column,row)));
                }

                levelTiles.Add(newLayer);
            }

            return levelTiles;
        }

        private string[,] _rawMap = new string[16, 10] {
        {"[water]", "[water]", "[water]", "[water]", "[water]", "[water]", "[water]", "[water]", "[water]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[meadow]", "[meadow]", "[road]", "[meadow]", "[meadow]", "[meadow]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[meadow]", "[meadow]", "[road]", "[meadow][NPCAI]", "[meadow]", "[meadow]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[meadow]", "[meadow]", "[road]", "[meadow]", "[meadow]", "[meadow]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[meadow]", "[meadow]", "[road]", "[meadow]", "[meadow]", "[meadow]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[meadow]", "[meadow]", "[road]", "[meadow]", "[meadow]", "[meadow]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[meadow]", "[meadow]", "[road]", "[road]", "[road]", "[road]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[meadow]", "[meadow][NPCAI]", "[road]", "[meadow]", "[meadow]", "[meadow]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[meadow]", "[meadow]", "[road]", "[meadow]", "[meadow]", "[meadow]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[rock]", "[rock]", "[road]", "[rock]", "[rock]", "[rock]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[rock]", "[rock]", "[road]", "[rock]", "[rock]", "[rock]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[rock]", "[rock]", "[road]", "[rock]", "[rock]", "[rock]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[rock]", "[rock]", "[road]", "[rock]", "[rock]", "[rock]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[rock]", "[rock]", "[road]", "[rock]", "[rock]", "[rock]", "[water]"},
        {"[water]", "[meadow]", "[water]", "[rock]", "[rock]", "[road]", "[rock]", "[rock]", "[rock]", "[water]"},
        {"[water]", "[water]", "[water]", "[water]", "[water]", "[water]", "[water]", "[water]", "[water]", "[water]"}
        };
    }
}
