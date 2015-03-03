using System;

namespace SlowpokeEngine.Actions
{
	public class BodyActionChangeDirection : BodyAction
	{
		public int Dx { get; private set;}
		public int Dy { get; private set;}

		public BodyActionChangeDirection (int dX, int dY)
		{
			Dx = dX;
			Dy = dY;
		}
	}
}

