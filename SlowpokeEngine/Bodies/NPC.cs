using System;
using System.Threading;
using SlowpokeEngine.Actions;

namespace SlowpokeEngine.Bodies
{
	public class NPC : ActiveBody
	{
		private volatile Timer timer;
		public NPC ():base(new Tuple<int,int>(0,0),new Tuple<int,int>(1,1))
		{
			timer = new Timer (Move, null, 0, 1000);
		}

		private void Move(object state)
		{
			OnNewAction(new NewActionEventArgs (new ActionMove ()
				{
					Dx = 1,
					Dy = 1
				}
			));
		}
	}
}

