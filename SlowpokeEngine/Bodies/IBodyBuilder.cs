using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
	public interface IBodyBuilder
	{
        ActiveBody BuildNPCAI(IMechanicEngine mechanicEngine);
        LifeContainer BuildLifeContainer(IMechanicEngine mechanicEngine);
        PlayerBody LoadPlayerBody(Guid characterId, IMechanicEngine mechanicEngine);
        BoxBody BuildBox(IMechanicEngine mechanicEngine, Point point);
	}
}

