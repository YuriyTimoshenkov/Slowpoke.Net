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
        public bool throwWeapon { get; set; }
        public InputEventPoint changeDirection { get; set; }
        public IList<InputCommand> commands { get; set; }

        public InputEvent()
        {
            commands = new List<InputCommand>();
        }
    }

    public class InputCommand
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public IList<IList<string>> Data { get; set; }
    }

    public class InputEventPoint
    {
        public double X { get; set; }
        public double Y { get; set; }
    }
}
