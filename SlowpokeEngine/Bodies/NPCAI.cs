using System;
using System.Threading;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using System.Linq;

namespace SlowpokeEngine.Bodies
{
	public class NPCAI : ActiveBody
	{
        private DateTime _startMove = DateTime.MinValue;

        public NPCAI(Shape shape, IMechanicEngine mechanicEngine, int life, int lifeMax, int viewZone, int speed)
            : base(
			shape,
			new Vector(1,1),
			mechanicEngine,
            life, lifeMax,
            viewZone,
            speed)
		{
			
		}

        public override void UpdateState()
        {
            var frame = _mechanicEngine.ViewPort.GetFrame(this.Id, null);

            ActiveBody enemy = null;
            double minDistance = -1;

            var newDirection = new Vector();

            //Find enemy
            foreach (var body in frame.Bodies.Where(v => v is ActiveBody))
            {
                // Only PlayerBodies can be enemies
                if (isEnemy(body as ActiveBody))
                {
                    var _newDirection = Vector.Subtract(body.Shape.Position, this.Shape.Position);
                    double distance = calculateDistance(_newDirection);
                    if (distance < minDistance || minDistance == -1)
                    {
                        enemy = body as ActiveBody;
                        minDistance = distance;
                        newDirection = _newDirection;
                    }
                }
            }

            if (enemy != null)
            {
                if (Direction != newDirection)
                {
                    _mechanicEngine.ProcessGameCommand(
                        new GameCommandChangeDirection(
                            1,
                            newDirection,
                            _mechanicEngine, this
                            ));
                }

                Shoot();

                //Run to enemy
                if (_startMove == DateTime.MinValue)
                {
                    _startMove = DateTime.Now;
                }
                else
                {
                    var duration = DateTime.Now - _startMove;

                    if (duration.TotalMilliseconds > 10)
                    {
                        _mechanicEngine.AddCommand(new GameCommandMove(0, newDirection, _mechanicEngine, this, duration));

                        _startMove = DateTime.Now;
                    }
                }
            }
            else
                _startMove = DateTime.MinValue;
        }

        private bool isEnemy(ActiveBody body)
        {
            if (body is PlayerBody)
            {
                return true;
            }

            return false;
        }

        private double calculateDistance(Vector newVector)
        {
            return Math.Sqrt(Math.Pow(newVector.X, 2) + Math.Pow(newVector.Y, 2));
        }        
	}
}

