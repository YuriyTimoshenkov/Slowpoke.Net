using SlowpokeEngine.Engines;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine
{
	public class MechanicEngineBuilder : IMechanicEngineBuilder
	{
		public IMechanicEngine Build()
		{
			var mapEngine = new MapEngine ();
			var physicalEngine = new PhysicalEngine ();
			var simpleBodyBuilder = new SimpleBodyBuilder ();
			var viewPort = new ViewPort (mapEngine);

			var mechanicEngine = new MechanicEngine (physicalEngine, mapEngine, simpleBodyBuilder, viewPort);

			return mechanicEngine;
		}
	}
}