using System;
using System.Threading;

namespace SlowpokeEngine
{
	public abstract class ActiveBody
	{
		private Guid id = Guid.NewGuid();
		public Guid Id { get { return id; }}

		public Tuple<int,int> Direction { get; set; }

		public Tuple<int,int> Position { get; set; }

		public event EventHandler<NewActionEventArgs> NewAction;

		public ActiveBody ()
		{
		}

		protected void OnNewAction(NewActionEventArgs e)
		{
			e.Raise(this, ref NewAction);
		}
	}
}

