using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Bodies
{
    public class PassiveBody : Body
    {
        public PassiveBody(Shape shape)
        {
            Shape = shape;
        }
    }
}
