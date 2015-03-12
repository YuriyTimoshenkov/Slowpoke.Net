using SlowpokeEngine.Bodies;
namespace SlowpokeEngine.Actions
{
	public class GameCommandMove : GameCommand
	{
        public GameCommandMove(IMechanicEngine mechanicEngine, ActiveBody activeBody) :
            base(mechanicEngine, activeBody) { }
	}
}

