using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
namespace SlowpokeEngine.Actions
{
	public class GameCommandMove : GameCommand
	{
        public Vector Direction { get; private set; }

        public GameCommandMove(Vector direction, IMechanicEngine mechanicEngine, ActiveBody activeBody) :
            base(mechanicEngine, activeBody) 
        {
            Direction = direction;
        }
	}
}

