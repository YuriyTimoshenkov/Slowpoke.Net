using System;
using System.Collections.Generic;

namespace SlowpokeEngine
{
	public abstract class Action
	{
		public Dictionary<string, object> Parameters { get; set; }

		public Action()
		{
		}
	}
}

