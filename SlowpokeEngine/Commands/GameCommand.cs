using SlowpokeEngine.Bodies;
using System;
using System.Collections.Generic;

namespace SlowpokeEngine.Actions
{
	public abstract class GameCommand
	{
		public Dictionary<string, object> Parameters { get; set; }
        private IMechanicEngine _mechanigEngine;
        public ActiveBody ActiveBody {get; private set;}

        public GameCommand(IMechanicEngine mechanicEngine, ActiveBody activeBody)
        {
            _mechanigEngine = mechanicEngine;
            ActiveBody = activeBody;
        }

        public virtual void Execute()
        {
            _mechanigEngine.ProcessGameCommand(this);
        }
	}
}

