using SlowpokeEngine.Entities;
using SlowpokeEngine.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines
{
    public class ShapeCollisionManager : IShapeCollisionManager
    {
        ActionHandlersManager<Func<Shape, Shape, bool>, Func<Shape, Shape, bool>> _collisionHandlers =
            new ActionHandlersManager<Func<Shape, Shape, bool>, Func<Shape, Shape, bool>>();

        public ShapeCollisionManager()
        {
            _collisionHandlers.AddHandler(
                (shape1, shape2) => 
                {
                    return shape1 is ShapeCircle && shape2 is ShapeCircle;
                },
                (shape1, shape2) =>
                {
                    return CircleCollision(shape1 as ShapeCircle, shape2 as ShapeCircle);
                }
                );

            _collisionHandlers.AddHandler(
                (shape1, shape2) =>
                {
                    return shape1 is ShapeCircle && shape2 is ShapeRectangle;
                },
                (shape1, shape2) =>
                {
                    return CircleRectangleCollision(shape1 as ShapeCircle, shape2 as ShapeRectangle);
                }
                );
        }

        private bool CircleCollision(ShapeCircle shape1, ShapeCircle shape2)
        {
            var positionDistance = Math.Pow(shape1.Position.X - shape2.Position.X, 2)
                + Math.Pow(shape1.Position.Y - shape2.Position.Y, 2);

            var radiusDistance = Math.Pow(shape1.Radius, 2) + Math.Pow(shape2.Radius, 2);


            return radiusDistance >= positionDistance;
        }

        private bool CircleRectangleCollision(ShapeCircle circle, ShapeRectangle rectangle)
        {
            var circleDistanceX = Math.Abs(circle.Position.X - rectangle.Position.X);
            var circleDistanceY = Math.Abs(circle.Position.Y - rectangle.Position.Y);

            if (circleDistanceX > (rectangle.Width / 2 + circle.Radius)) { return false; }
            if (circleDistanceY > (rectangle.Height / 2 + circle.Radius)) { return false; }

            if (circleDistanceX <= (rectangle.Width / 2)) { return true; }
            if (circleDistanceY <= (rectangle.Height / 2)) { return true; }

            var cornerDistanceSQ = Math.Pow((circleDistanceX - rectangle.Width / 2), 2) +
                         Math.Pow((circleDistanceY - rectangle.Height / 2), 2);
            
            return (cornerDistanceSQ <= Math.Pow(circle.Radius, 2));
        }

        public bool CheckCollision(Shape shape1, Shape shape2)
        {
            foreach (var handler in _collisionHandlers)
            {
                if (handler.Item1(shape1, shape2))
                    return handler.Item2(shape1, shape2);
            }

            throw new Exception("Collision calculation is not implemented for this shape types");
        }
    }
}
