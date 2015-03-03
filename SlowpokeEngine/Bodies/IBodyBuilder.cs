using System;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Bodies
{
	public interface IBodyBuilder
	{
		ActiveBody BuildNPC(IMechanicEngine mechanicEngine);
		PlayerBody LoadPlayerBody (IMechanicEngine mechanicEngine);
	}
}

