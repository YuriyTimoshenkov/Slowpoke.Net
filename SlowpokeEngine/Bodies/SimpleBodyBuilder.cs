using SlowpokeEngine.Engines;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
    public class SimpleBodyBuilder : IBodyBuilder
    {
        public ActiveBody BuildNPC(IMechanicEngine mechanicEngine)
        {
            //TODO: load config from DB, get some data from depended services and as a result - build NPC
            return new NPC(mechanicEngine);
        }

        public PlayerBody LoadPlayerBody(IMechanicEngine mechanicEngine)
        {
            //TODO: load config from DB, get some data from depended services and as a result - load player object

            return new PlayerBody(
                new Point(0, 0),
                new Vector(1, 3),
                mechanicEngine);
        }
    }
}