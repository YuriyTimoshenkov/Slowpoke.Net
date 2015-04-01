using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Entities
{
    public class ShapeCircle : Shape 
    {
        public double Radius { get; set; }

        public override double MaxDimension
        {
            get
            {
                return Radius;
            }
        }

        public ShapeCircle(double radius, Point point)
            : base(point)
        {
            Radius = radius;
        }
    }
}
