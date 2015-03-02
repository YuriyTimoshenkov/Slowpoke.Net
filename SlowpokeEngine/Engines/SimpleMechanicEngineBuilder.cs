using SlowpokeEngine.Engines;

namespace SlowpokeEngine
{
	public class MechanicEngineBuilder : IMechanicEngineBuilder
	{
		public IMechanicEngine Build()
		{
			var mapEngine = new MapEngine ();
			var physicalEngine = new PhysicalEngine ();
			var simpleBodyBuilder = new SimpleBodyBuilder ();

			var mechanicEngine = new MechanicEngine (physicalEngine, mapEngine, simpleBodyBuilder);

			return mechanicEngine;
		}
	}
}