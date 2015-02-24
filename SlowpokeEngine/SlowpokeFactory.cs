using System;

namespace SlowpokeEngine
{
	public class SlowpokeFactory
	{
		public SlowpokeFactory ()
		{
		}

		public SlowpokeGame BuildGame()
		{
			return new SlowpokeGame (new MechanicEngine(new PhysicalEngine()));
		}
	}
}

