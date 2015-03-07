using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
    public class MechanicEngineBuilder : IMechanicEngineBuilder
    {
        public IMechanicEngine Build()
        {
            var mapEngine = new MapEngine();
            return new MechanicEngine(new PhysicalEngine(),
                                      mapEngine,
                                      new SimpleBodyBuilder(),
                                      new ViewPort(mapEngine));
        }
    }
}