using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Services
{
    public class LifeContainersGenerationService : BaseGenerationService
    {
        private int _containersCount;
        private Random _randomizer =  new Random();

        public LifeContainersGenerationService(
            IMechanicEngine mechanicEngine, 
            IBodyBuilder bodyBuilder,
            int containersCount):base(mechanicEngine, bodyBuilder)
        {
            _containersCount = containersCount;
        }
        protected override void Generate()
        {
            var currentContainersCount = _mechanicEngine.Bodies.Where(v => v is LifeContainer).Count();

            var newContainersCount = _containersCount - currentContainersCount;
            //Add new NPC if needed
            if (newContainersCount > 0)
            {
                foreach (var i in Enumerable.Range(0, newContainersCount))
                {
                    var suitableTiles = _mechanicEngine.Map.Tiles.SelectMany(v => v)
                        .Where(v => v.Solid == Map.TileSolidityType.NotSolid && v.Bodies.Count() == 0);
                    var suitableTilesCount = suitableTiles.Count();

                    if (suitableTilesCount > 0)
                    {
                        var tileNumber = _randomizer.Next(suitableTilesCount - 1);
                        var tile = suitableTiles.ElementAt(tileNumber);

                        var newContainer = _bodyBuilder.BuildLifeContainer(_mechanicEngine);

                        newContainer.Shape.Position = new Point(
                            tile.Shape.Position.X,
                            tile.Shape.Position.Y);

                        _mechanicEngine.AddBody(newContainer);
                    }
                }
            }
        }
    }
}
