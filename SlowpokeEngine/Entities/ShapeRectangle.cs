using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Entities
{
    public class ShapeRectangle : Shape
    {
        public double Width { get; set; }
        public double Height { get; set; }

        public override double MaxDimension
        {
            get
            {
                return Width > Height ? Width : Height;                    
            }
        }

        public ShapeRectangle(double width, double height, Point position)
            : base(position)
        {
            Width = width;
            Height = height;
        }
    }
}
