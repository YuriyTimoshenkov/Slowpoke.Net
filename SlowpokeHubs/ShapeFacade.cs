using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Entities
{
    public class ShapeFacade
    {
        public Point Position { get; set; }

        public double MaxDimension { get; set; }
        public double Radius { get; set; }

        public ShapeFacade(Point position)
        {
            Position = position;
        }

        public static ShapeFacade FromShape(Shape shape)
        {
            var result = new ShapeFacade(shape.Position)
            {
                  MaxDimension = shape.MaxDimension                  
            };

            if(shape is ShapeCircle)
            {
                result.Radius = ((ShapeCircle)shape).Radius;
            }

            return result;
        }
    }
}
