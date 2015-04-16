using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Services
{
    public class NPCGenerationService : IMechanicService
    {
        private int _npcCount;
        private IMechanicEngine _mechanicEngine;
        private IBodyBuilder _bodyBuilder;
        private Random _randomizer =  new Random();

        public NPCGenerationService(
            IMechanicEngine mechanicEngine, 
            IBodyBuilder bodyBuilder,
            int npcCount)
        {
            _mechanicEngine = mechanicEngine;
            _bodyBuilder = bodyBuilder;
            _npcCount = npcCount;
        }

        public void Update()
        {
            var currentNPCCount = _mechanicEngine.ActiveBodies.Count();

            var newNPCCount = _npcCount - currentNPCCount;
            //Add new NPC if needed
            if (newNPCCount > 0)
            {
                foreach(var i in Enumerable.Range(0, newNPCCount))
                {
                    var notSolidTiles = _mechanicEngine.Map.Tiles.SelectMany(v => v).Where(v => v.Solid == Map.TileSolidityType.NotSolid);
                    var tilesCount = notSolidTiles.Count();
                    
                    if (tilesCount > 0)
                    {
                        var tileNumber =_randomizer.Next(tilesCount - 1);
                        var tile = notSolidTiles.ElementAt(tileNumber);

                        var newNPC = _bodyBuilder.BuildNPCAI(_mechanicEngine);

                        newNPC.Shape = new ShapeCircle(20, new Point(
                            tile.Shape.Position.X,
                            tile.Shape.Position.Y));

                        _mechanicEngine.AddActiveBody(newNPC);
                    } 
                }
            }
        }
    }
}
