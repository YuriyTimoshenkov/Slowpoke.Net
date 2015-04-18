using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using SlowpokeEngine;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Engines.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class NPCGenerationServiceTests
    {
        [TestMethod]
        public void New_NPC_Should_Be_Added()
        {
            //Arrange
            IMapEngine mapEngine = TestMapEngineFactory.InitMapEngine();
            var mechanigEngine = Substitute.For<IMechanicEngine>();
            mechanigEngine.Bodies.Count.Returns(v => 0);
            mechanigEngine.Map.Tiles.Returns(v => mapEngine.Map.Tiles);

            var bodyBuilder = Substitute.For<IBodyBuilder>();
            bodyBuilder.BuildNPCAI(Arg.Any<IMechanicEngine>()).Returns(v => new NPCAI(null, null, 1, 1, 1));

            var npcGenerator = new NPCGenerationService(mechanigEngine, bodyBuilder, 1);

            //Act
            npcGenerator.Update();

            //Assert
            mechanigEngine.Received().AddBody(Arg.Any<ActiveBody>());
        }
    }
}
