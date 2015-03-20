using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;

namespace SlowpokeEngine.Actions
{
	public class GameCommandChangeDirection : GameCommand
	{
		public Vector Direction { get; private set;}

        public GameCommandChangeDirection(Vector direction, IMechanicEngine mechanicEngine, ActiveBody activeBody) :
            base(mechanicEngine, activeBody)
		{
            Direction = direction;
		}
	}
}

