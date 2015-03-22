using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Entities
{
    public class ShapeCircle : Shape 
    {
        public int Radius { get; set; }

        public override int MaxDimension
        {
            get
            {
                return Radius;
            }
        }

        public ShapeCircle(int radius, Point point)
            : base(point)
        {
            Radius = radius;
        }
    }
}
