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
			var mechanicEngine = new MechanicEngine (new PhysicalEngine ());
			var mapEngine = new MapEngine (mechanicEngine);

			return new SlowpokeGame (mechanicEngine, mapEngine);
		}
	}
}

