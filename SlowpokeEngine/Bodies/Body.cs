using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Bodies
{
    public abstract class Body
    {
        public Guid Id { get; set; }
        public Shape Shape { get; set; }
        public string BodyType { get { return this.GetType().Name; } }

        public Body(Guid id, Shape shape)
        {
            Id = id;
            Shape = shape;
        }
    }
}
