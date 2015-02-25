using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Extensions;

namespace SlowpokeEngine.Bodies
{
	public abstract class ActiveBody
	{
		protected ActiveBody()
		{
			Id = Guid.NewGuid();
		}

		protected ActiveBody(Tuple<int, int> position, Tuple<int, int> direction)
		{
			Position = position;
			Direction = direction;
		}

		public Guid Id { get; private set; }

		public Tuple<int, int> Direction { get; set; }

		public Tuple<int, int> Position { get; set; }

		public event EventHandler<NewActionEventArgs> NewAction;

		protected void OnNewAction(NewActionEventArgs e)
		{
			//Вопрос? это сделано для меньше кода? 
			e.Raise(this, ref NewAction);
		}
	}
}