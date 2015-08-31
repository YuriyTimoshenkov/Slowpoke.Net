using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Bodies
{
    public class BoxBody : ActiveBody
    {
        IEnumerable<Body> _childBodies;

        public BoxBody(
            Shape shape,
            IEnumerable<Body> childBodies,
            IMechanicEngine mechanicEngine,
            int life,
            int lifeMax)
            : base(shape, new Vector(1,1), mechanicEngine, life, lifeMax, 0)
        {
            _childBodies = childBodies;
        }

        public override void Harm(int damage)
        {
            base.Harm(damage);
        }

        public override void ReleaseGame()
        {
            base.ReleaseGame();

            foreach (var body in _childBodies)
            {
                body.Shape.Position = new Point(this.Shape.Position.X, this.Shape.Position.Y);

                _mechanicEngine.AddBody(body);
            }
        }
    }
}
