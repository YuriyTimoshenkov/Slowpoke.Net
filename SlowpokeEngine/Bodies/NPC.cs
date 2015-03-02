using System;
using System.Threading;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Engines;

namespace SlowpokeEngine.Bodies
{
	public class NPC : ActiveBody
	{
		private volatile Timer timer;
		public NPC (IMechanicEngine mechanicEngine):base(
			new Tuple<int,int>(0,0),
			new Tuple<int,int>(1,1),
			mechanicEngine)
		{
			timer = new Timer (Move, null, 0, 1000);
		}

		private void Move(object state)
		{
			_mechanicEngine.ProcessAction (
				new BodyActionMove () { Dx = 1, Dy = 1 },
				this
			);
		}
	}
}

