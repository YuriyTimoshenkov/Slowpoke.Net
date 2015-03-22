﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Entities
{
    public abstract class Shape
    {
        public Point Position { get; set; }

        public Shape(Point position)
        {
            Position = position;
        }
    }
}
