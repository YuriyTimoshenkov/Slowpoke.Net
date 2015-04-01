using System;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Bodies
{
	public interface IBodyBuilder
	{
		ActiveBody BuildNPC(IMechanicEngine mechanicEngine);
        ActiveBody BuildNPCAI(IMechanicEngine mechanicEngine);
        PlayerBody LoadPlayerBody(Guid characterId, IMechanicEngine mechanicEngine);
	}
}

