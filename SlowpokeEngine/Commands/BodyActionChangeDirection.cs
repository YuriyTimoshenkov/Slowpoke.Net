using SlowpokeEngine.Bodies;
using System;

namespace SlowpokeEngine.Actions
{
	public class GameCommandChangeDirection : GameCommand
	{
		public int Dx { get; private set;}
		public int Dy { get; private set;}

		public GameCommandChangeDirection (int dX, int dY, IMechanicEngine mechanicEngine, ActiveBody activeBody):
            base(mechanicEngine, activeBody)
		{
			Dx = dX;
			Dy = dY;
		}
	}
}

