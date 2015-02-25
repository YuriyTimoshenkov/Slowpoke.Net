using System;
using System.Threading;
using SlowpokeEngine.Actions;

namespace SlowpokeEngine.Bodies
{
	public class NPC : ActiveBody
	{
		private volatile Timer timer; //!!!Опасно комилятор в релизе вычленит timer из теля метода и перенесет в конструктор так как используется он только там 
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

