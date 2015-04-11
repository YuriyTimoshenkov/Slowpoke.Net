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
        public NPCAI(Shape shape, IMechanicEngine mechanicEngine, int life, int lifeMax, int viewZone)
            : base(
			shape,
			new Vector(1,1),
			mechanicEngine,
            life, lifeMax,
            viewZone)
		{
			
		}

        public override void UpdateState()
        {
            var frame = _mechanicEngine.ViewPort.GetFrame(this.Id, null);

            ActiveBody enemy = null;
            double minDistance = -1;

            var newDirection = new Vector();

            foreach (var body in frame.Bodies)
            {
                // Only PlayerBodies can be enemies
                if (isEnemy(body))
                {
                    var _newDirection = Vector.Subtract(body.Shape.Position, this.Shape.Position);
                    double distance = calculateDistance(_newDirection);
                    if (distance < minDistance || minDistance == -1)
                    {
                        enemy = body;
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
                            newDirection,
                            _mechanicEngine, this
                            ));
                }
                    
                Shoot();
            }
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
            
            //_mechanicEngine.ProcessGameCommand(
            //    new GameCommandMove(new Vector(1,1), _mechanicEngine,
            //        new Bullet(10,10,10,new ShapeCircle(2, this.Shape.Position),new Vector(1,1), _mechanicEngine))
            //    );
        
	}
}

