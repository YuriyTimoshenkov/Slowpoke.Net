using System;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Bodies
{
	public interface IBodyBuilder
	{
        ActiveBody BuildNPCAI(IMechanicEngine mechanicEngine);
        LifeContainer BuildLifeContainer(IMechanicEngine mechanicEngine);
        PlayerBody LoadPlayerBody(Guid characterId, IMechanicEngine mechanicEngine);
	}
}

