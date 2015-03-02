using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{

    /// <summary>
    /// КРУТО, я бы добавил try/cathc log-> throw
    /// Builder понят правильно 
    /// </summary>
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