using SlowpokeEngine.Engines;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.Map;

namespace SlowpokeEngine
{
	public class SimpleMechanicEngineBuilder : IMechanicEngineBuilder
	{
		public IMechanicEngine Build()
		{
			var mapEngine = new MapEngine (new Map(50));
			var physicalEngine = new PhysicalEngine (new ShapeCollisionManager(), mapEngine);
			var simpleBodyBuilder = new SimpleBodyBuilder ();
			var viewPort = new ViewPort (mapEngine);

			var mechanicEngine = new MechanicEngine (physicalEngine, mapEngine, simpleBodyBuilder, viewPort, null);

			return mechanicEngine;
		}
	}
}