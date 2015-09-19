using SlowpokeEngine.Bodies;
using SlowpokeEngine.Configuration;
using System;

namespace SlowpokeEngine
{
	public interface IMechanicEngineBuilder
	{
        IMechanicEngine Build(Action<IPlayerBodyFacade> playerStateHandler, IEngineConfiguration configuration);
	}
}

