using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines
{
    public interface IShapeCollisionManager
    {
        bool CheckCollision(Shape shape1, Shape shape2);
    }
}
