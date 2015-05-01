using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
namespace SlowpokeEngine.Actions
{
	public class GameCommandMove : GameCommand
	{
        public Vector Direction { get; private set; }
        public TimeSpan Duration { get; private set; }

        public GameCommandMove(Vector direction, IMechanicEngine mechanicEngine, ActiveBody activeBody, TimeSpan duration) :
            base(mechanicEngine, activeBody) 
        {
            Direction = direction;
            Duration = duration;
        }
	}
}

