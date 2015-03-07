using SlowpokeEngine.Engines;

namespace SlowpokeEngine.Bodies
{
    public interface IBodyBuilder
    {
        ActiveBody BuildNPC(IMechanicEngine mechanicEngine);
        PlayerBody LoadPlayerBody(IMechanicEngine mechanicEngine);
    }
}