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
        public NPCAI(Shape shape, IMechanicEngine mechanicEngine, int life, int lifeMax)
            : base(
			shape,
			new Vector(1,1),
			mechanicEngine,
            life, lifeMax)
		{
			
		}

        public override void UpdateState()
        {
            var playerBody = _mechanicEngine.ViewPort.GetActiveBodies(this.Id).FirstOrDefault(v => v is PlayerBody);

            if (playerBody != null)
            {
                Shoot();
            }
            //_mechanicEngine.ProcessGameCommand(
            //    new GameCommandMove(new Vector(1,1), _mechanicEngine,
            //        new Bullet(10,10,10,new ShapeCircle(2, this.Shape.Position),new Vector(1,1), _mechanicEngine))
            //    );
        }
	}
}

