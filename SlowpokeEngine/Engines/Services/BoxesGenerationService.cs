using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Services
{
    public class BoxesGenerationService : BaseGenerationService
    {
        private int _containersCount;
        private Random _randomizer =  new Random();

        public BoxesGenerationService(
            IMechanicEngine mechanicEngine, 
            IBodyBuilder bodyBuilder,
            int containersCount):base(mechanicEngine, bodyBuilder)
        {
            _containersCount = containersCount;
        }
        protected override void Generate()
        {
            var currentBoxesCount = _mechanicEngine.Bodies.Where(v => v is BoxBody).Count();

            var newBoxesCount = _containersCount - currentBoxesCount;

            //Add new boxes if needed
            if (newBoxesCount > 0)
            {
                foreach (var i in Enumerable.Range(0, newBoxesCount))
                {
                    var suitableTiles = _mechanicEngine.Map.Tiles.SelectMany(v => v)
                        .Where(v => v.Solid == Map.TileSolidityType.NotSolid && v.Bodies.Count() == 0);
                    var suitableTilesCount = suitableTiles.Count();

                    if (suitableTilesCount > 0)
                    {
                        var tileNumber = _randomizer.Next(suitableTilesCount - 1);
                        var tile = suitableTiles.ElementAt(tileNumber);

                        var newBox = _bodyBuilder.BuildBox(_mechanicEngine, new Point(
                            tile.Shape.Position.X,
                            tile.Shape.Position.Y));

                        _mechanicEngine.AddBody(newBox);
                    }
                }
            }
        }
    }
}
