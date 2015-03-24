using System;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Bodies
{
	public interface IBodyBuilder
	{
		ActiveBody BuildNPC(IMechanicEngine mechanicEngine);
        PlayerBody LoadPlayerBody(Guid characterId, IMechanicEngine mechanicEngine);
	}
}

