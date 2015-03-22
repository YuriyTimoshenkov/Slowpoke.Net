using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Entities
{
    public class ShapeRectangle : Shape
    {
        public int Width { get; set; }
        public int Height { get; set; }

        public override int MaxDimension
        {
            get
            {
                return Width > Height ? Width : Height;                    
            }
        }

        public ShapeRectangle(int width, int height, Point position):base(position)
        {
            Width = width;
            Height = height;
        }
    }
}
