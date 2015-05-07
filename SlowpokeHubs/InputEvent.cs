using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeHubs
{
    public class InputEvent
    {
        public bool use { get; set; }
        public bool weaponSwitch { get; set; }
        public bool shoot { get; set; }
        public InputEventPoint changeDirection { get; set; }
        public InputEventMove move { get; set; }
    }

    public class InputEventMove
    {
        public InputEventPoint Direction { get; set; }
        public int Duration { get; set; }
    }

    public class InputEventPoint
    {
        public float X { get; set; }
        public float Y { get; set; }
    }
}
