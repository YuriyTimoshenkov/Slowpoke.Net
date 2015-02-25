using System;

namespace SlowpokeEngine.Actions
{
	public class NewActionEventArgs : EventArgs
	{
		public Action Action { get; set; }


		public NewActionEventArgs (Action action)
		{
			Action = action;
		}
	}
}

