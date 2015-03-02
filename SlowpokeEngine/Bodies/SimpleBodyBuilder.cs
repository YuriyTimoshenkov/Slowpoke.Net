using System;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine
{
	public class SimpleBodyBuilder : IBodyBuilder
	{
		public ActiveBody BuildNPC(IMechanicEngine mechanicEngine)
		{
			//TODO: load config from DB, get some data from depended services and as a result - build NPC
			return new NPC (mechanicEngine);
		}
	}
}

