using System;
using System.Threading;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
	public class NPC : ActiveBody
	{
		private volatile Timer timer;
		public NPC (Shape shape, IMechanicEngine mechanicEngine):base(
			shape,
			new Vector(1,1),
			mechanicEngine)
		{
			
		}

        public override void Run()
        {
            timer = new Timer(Move, null, 0, 1000);
        }
		private void Move(object state)
		{
			_mechanicEngine.ProcessGameCommand (new GameCommandMove (this.Direction, _mechanicEngine, this));

			var newDirection = new Vector (
				GetNewDirection (Direction.X, Shape.Position.X),
                GetNewDirection(Direction.Y, Shape.Position.Y));

			if (Direction != newDirection)
                _mechanicEngine.ProcessGameCommand(
                    new GameCommandChangeDirection (
                        new Vector(newDirection.X - Direction.X, newDirection.Y - Direction.Y),
                        _mechanicEngine, this
                        ));
		}

		private int GetNewDirection(int current, int postition)
		{
			if ((postition > 10 && current > 0) || (postition < 0 && current < 0))
				return current *= -1;
			else
				return current;
		}
	}
}

