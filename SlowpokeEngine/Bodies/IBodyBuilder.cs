using System;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine
{
	public interface IBodyBuilder
	{
		ActiveBody BuildNPC(IMechanicEngine mechanicEngine);
	}
}

