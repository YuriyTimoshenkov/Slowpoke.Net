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
            {"road", new SimpleLevelTileType("road", "#EDC791", TileSolidityType.NotSolid)},
            {"ford", new SimpleLevelTileType("ford", "#5FA3A7", TileSolidityType.NotSolid)}, // брод
            {"tree", new SimpleLevelTileType("tree", "#C0F598", TileSolidityType.Full)} 
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
                    var cell = rawMap[row, column];
                    string tileTypeName = string.Empty;
                    string NPCTypeName = string.Empty;
                    var NPCList = new List<string>();

                    if (cell != string.Empty)
                    {
                        var matchResult = Regex.Match(
                            cell,
                            string.Format(@"\[(?<{0}>[A-Za-z0-9]+)\](\[(?<{1}>[A-Za-z0-9,]*)\])?", TypeGroupName, NPCListGroupName));

                        tileTypeName = matchResult.Groups[TypeGroupName].Value;
                        NPCTypeName = matchResult.Groups[NPCListGroupName].Value;
                    }
                    else //Fill with default tile
                    {
                        tileTypeName = "meadow";
                    }

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


        private string[,] _rawMap = new string[97, 40] {
        {"[rock]","[water]","[water]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]"},
        {"[rock]","[road]","[road]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
    {"[rock]","[road]","[road]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
    {"[rock]","[road]","[road]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
    {"[rock]","[road]","[road]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
    {"[rock]","[road]","[road]","","","[tree]","[tree]","","","","","","","","","","","","","","","","[tree]","[tree]","","","","","","","","","","","","","","","","[rock]"},
    {"[rock]","[road]","[road]","","","[tree]","[tree]","","","","","","","[tree]","[tree]","","","","","","","","[tree]","[tree]","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","[tree]","[tree]","","","","","","","","","","","","[tree]","","","","","","","","","","","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","[tree]","","","","","","","","","","","","","[tree]","","","","","","[water]","[water]","","","","","","","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","","","","","","","","","","","","","","","","","[water]","[water]","","","","","","","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","","","","","","","","","","","","","","","","","[water]","[water]","","","","","","","[road]","[road]","[water]"},
{"[rock]","[road]","[road]","","","","","","","","","","","","","","","","","","","","","","","","","","[water]","[water]","[water]","","","","","","","[road]","[road]","[water]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","","","","","","","","","","","","","","","","","","","","","","[water]","[water]","[water]","","","","","","[road]","[road]","[road]","[water]"},
{"[rock]","[road]","[road]","","[rock]","[rock]","[rock]","","","","","","","","","","","","","","","","","","[tree]","","","","[water]","[water]","[water]","","","","","","[road]","[road]","[road]","[water]"},
{"[rock]","[road]","[road]","","[rock]","[rock]","[rock]","[rock]","","","","","","","","","","","","","","","","","","","","[water]","[water]","[water]","[water]","","","","","","[road]","[road]","[road]","[water]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","","","","","","","","","","","","","","","","","","","","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","[road]","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","","","","","","","","","","","","","","","","","","","","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","[road]","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","[rock]","","","","","","","","","","","","[rock]","[rock]","","","","","","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","[rock]","","","","","","","","","","","","[rock]","[rock]","","","","","","[water]","[water]","","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","","","","[rock]","[rock]","","","","","","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","","","[rock]","[rock]","","","","","","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","","","[rock]","[rock]","[rock]","","","","","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","","","","[rock]","[rock]","[rock]","","","","","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","[rock]","","","","","","","","","","","","","[rock]","[rock]","","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","[rock]","","","","","","","","","","","","","[rock]","[rock]","","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","","","","","","","","","","","","","","[rock]","[rock]","","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","","","","","","","","","","","","","","[rock]","[rock]","[rock]","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","","","","","","","","","","","[tree]","[tree]","","","[rock]","[rock]","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","[rock]","[rock]","[rock]","","","","","","","","","","","[tree]","[tree]","","","[rock]","[rock]","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","[rock]","","","","","","","","","","","","","","","","[rock]","[rock]","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","[rock]","","","","","","","","","","","","","","","","[rock]","[rock]","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","[rock]","","","[tree]","[tree]","","","[rock]","[rock]","","","","","","","","[rock]","[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","[rock]","","","[tree]","[tree]","","","[rock]","[rock]","","","","","","","","[rock]","[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","[rock]","[rock]","","","","","","","","[rock]","[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","[rock]","[rock]","[rock]","[rock]","","","","","","[rock]","[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","[rock]","[rock]","[rock]","[rock]","","","","[rock]","[rock]","[rock]","[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","[rock]","[rock]","[rock]","[rock]","","","","[rock]","[rock]","[rock]","[rock]","","","","[water]","[water]","[water]","[water]","[water]","","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","","","[rock]","[rock]","","","","[rock]","[rock]","[rock]","[rock]","","","","[water]","[water]","[water]","[water]","[water]","","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","","","[rock]","[rock]","[rock]","","","[rock]","[rock]","[rock]","","","","","[water]","[water]","[water]","[water]","[water]","","","","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","","","[rock]","[rock]","[rock]","","","[rock]","[rock]","[rock]","[rock]","","","","","","","","","","","[road]","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","","","","[rock]","[rock]","","","[rock]","[rock]","[rock]","[rock]","","","","","","","","","","","[road]","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","","","","","","","","","","","","","","[rock]","[rock]","","","","[rock]","[rock]","[rock]","[rock]","","","","","","","","","","[road]","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","[road]","","","","","","","","","","","","","[rock]","[rock]","","","","[rock]","[rock]","[rock]","[rock]","","","","","","","","","","[road]","[road]","[road]","","","[rock]"},
{"[rock]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","[rock]","[rock]","","","","[rock]","[rock]","[rock]","[rock]","","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","[rock]"},
{"[rock]","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","","","","","[rock]","[rock]","[rock]","","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","[rock]"},
{"[rock]","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","","","","","","[rock]","[rock]","","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","[rock]"},
{"[rock]","","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","","","","[rock]","[rock]","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","[rock]"},
{"[rock]","","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","","","","[rock]","[rock]","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","[road]","[road]","[road]","[road]","[road]","[road]","","","","","","[rock]","[rock]","[road]","[road]","[road]","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","[road]","[road]","[road]","[road]","","","","","","[rock]","[rock]","[road]","[road]","[road]","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","[road]","[road]","[road]","[road]","[road]","[road]","","","","[rock]","[rock]","[road]","[road]","[road]","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","","","[road]","[road]","[road]","[road]","","","","[rock]","[rock]","[road]","[road]","","","","","","","[tree]","[tree]","","","","","[rock]"},
{"[rock]","","","","","","","","[water]","[water]","","","","","","","[road]","[road]","[road]","[road]","","","[rock]","[rock]","[rock]","[road]","[road]","","","","","","","[tree]","[tree]","","","","","[rock]"},
{"[rock]","","","","","","","","[water]","[water]","","","","","","","","","[road]","[road]","","[rock]","[rock]","[rock]","[rock]","[road]","[road]","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","[water]","[water]","","","[water]","[water]","","","","","","","","","[road]","[road]","","[rock]","[rock]","[rock]","[rock]","[road]","[road]","","","","","","[tree]","[tree]","","","","","","[rock]"},
{"[rock]","","","","[water]","[water]","","[water]","[water]","[water]","","","","","","","","","[road]","[road]","","[rock]","[rock]","[rock]","","[road]","[road]","","","","","","[tree]","[tree]","","","","","","[rock]"},
{"[rock]","","","","[water]","[water]","","[water]","[water]","[water]","","","","","","","","","[road]","[road]","","[rock]","[rock]","[rock]","","[road]","[road]","","","","","[tree]","[tree]","","","","","","","[rock]"},
{"[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","","","","[water]","[water]","","[road]","[road]","","[rock]","[rock]","[rock]","","[road]","[road]","","","","","[tree]","[tree]","","","","","","","[rock]"},
{"[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","","","","[water]","[water]","","[road]","[road]","","[rock]","[rock]","[rock]","","[road]","[road]","","","","","","[tree]","[tree]","","","","","","[rock]"},
{"[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","[water]","[water]","[water]","","[road]","[road]","","[rock]","[rock]","[rock]","","[road]","[road]","","","","","","[tree]","[tree]","","","","","","[rock]"},
{"[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","[water]","[water]","[water]","","[road]","[road]","","[rock]","[rock]","[rock]","","[road]","[road]","","","","","","","","","","","","","[rock]"},
{"[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","","[road]","[road]","","[rock]","[rock]","[rock]","","[road]","[road]","","","","","","","","","","","","","[rock]"},
{"[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[ford]","[ford]","[water]","[water]","[rock]","","","[road]","[road]","","","","","","","","","","","","","[rock]"},
{"[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[ford]","[ford]","[water]","[water]","[rock]","","[road]","[road]","[road]","","","","","","","","[tree]","[tree]","","","","[rock]"},
{"[rock]","","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[ford]","[ford]","[water]","[water]","[water]","","[road]","[road]","","","","","","","","","[tree]","[tree]","","","","[rock]"},
{"[rock]","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[ford]","[ford]","[water]","[water]","","","[road]","[road]","","","","","","","","[tree]","[tree]","","","","","[rock]"},
{"[rock]","","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[water]","[ford]","[ford]","[water]","[water]","","","[road]","[road]","","","","","","","","[tree]","[tree]","","","","","[rock]"},
{"[rock]","","[water]","[water]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","","[water]","[water]","[water]","[water]","[water]","[water]","","[road]","[road]","","","","","[road]","[road]","","","","","","","[tree]","[tree]","","","","","","[rock]"},
{"[rock]","","[water]","[water]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","","[water]","[water]","[water]","[water]","[water]","[water]","","[road]","[road]","","","","","[road]","[road]","","","","","","","[tree]","[tree]","","","","","","[rock]"},
{"[rock]","","[water]","[water]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","","[water]","[water]","[water]","[water]","","[road]","[road]","","","","","[road]","[road]","","","","","","[tree]","[tree]","","","","","","","[rock]"},
{"[rock]","","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","","[water]","[water]","[water]","[water]","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","","[tree]","[tree]","","","","","","","[rock]"},
{"[rock]","","[rock]","[rock]","","","","","","","[rock]","[rock]","","[water]","[water]","[water]","[water]","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","","","","","","","","","","[rock]"},
{"[rock]","","[rock]","[rock]","","","","","","","[rock]","[rock]","[rock]","[rock]","[rock]","[water]","[water]","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","[tree]","[tree]","","","","","","","","[rock]"},
{"[rock]","","[rock]","[rock]","","","","","","","","","[rock]","[rock]","[rock]","[water]","[water]","","[road]","[road]","[road]","[road]","[road]","[road]","[road]","","","","","","[tree]","[tree]","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","[rock]","[rock]","[rock]","[water]","[water]","","","[road]","[road]","[road]","[road]","[road]","[road]","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","[rock]","[rock]","[rock]","[water]","[water]","[water]","[water]","","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","[water]","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","[water]","","","","","","","","","","","","","","","","","[tree]","","","[rock]"},
{"[rock]","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","[water]","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","[water]","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","[water]","[water]","","","","","","","","[tree]","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","[water]","[water]","","","[tree]","","","","","","","","","","","[tree]","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","[water]","[water]","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","[water]","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","[water]","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","[rock]","[rock]","[water]","[water]","[water]","[water]","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","[rock]","[rock]","","","","","","","","","","","[tree]","","","","","[tree]","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","","","","","","","","","","","[tree]","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","[rock]"},
{"[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]","[rock]"}
        };
    }
}
