using System;
using System.Collections;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;
using SlowpokeEngine.Engines.Map;

namespace SlowpokeEngine.Engines
{
	public interface IViewPort
	{
		IEnumerable<ActiveBody> GetActiveBodies (Guid playerId);
        IMap Map { get; }
	}
}

