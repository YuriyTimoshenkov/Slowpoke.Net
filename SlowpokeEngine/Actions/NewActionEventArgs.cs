using System;

namespace SlowpokeEngine
{
	public class NewActionEventArgs : EventArgs
	{
		public Action Action { get; set; }


		public NewActionEventArgs (Action action)
		{
			this.Action = action;
		}
	}
}

