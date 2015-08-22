using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Services
{
    public class NPCGenerationService : BaseGenerationService
    {
        private int _npcCount;
        private Random _randomizer =  new Random();

        public NPCGenerationService(
            IMechanicEngine mechanicEngine, 
            IBodyBuilder bodyBuilder,
            int npcCount):base(mechanicEngine, bodyBuilder)
        {
            _npcCount = npcCount;
        }

        protected override void Generate()
        {
            var currentNPCCount = _mechanicEngine.Bodies.Where(v => v is NPCAI).Count();

            var newNPCCount = _npcCount - currentNPCCount;
            //Add new NPC if needed
            if (newNPCCount > 0)
            {
                foreach (var i in Enumerable.Range(0, newNPCCount))
                {
                    var notSolidTiles = _mechanicEngine.Map.Tiles.SelectMany(v => v).Where(v => 
                        v.Solid == Map.TileSolidityType.NotSolid && v.Bodies.Count == 0);
                    var tilesCount = notSolidTiles.Count();

                    if (tilesCount > 0)
                    {
                        var tileNumber = _randomizer.Next(tilesCount - 1);
                        var tile = notSolidTiles.ElementAt(tileNumber);

                        var newNPC = _bodyBuilder.BuildNPCAI(_mechanicEngine);

                        newNPC.Shape.Position = new Point(
                            tile.Shape.Position.X,
                            tile.Shape.Position.Y);

                        _mechanicEngine.AddBody(newNPC);
                    }
                }
            }
        }
    }
}
