using System;
using System.Collections;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;

namespace SlowpokeEngine.Engines
{
	public interface IViewPort
	{
		IEnumerable<ActiveBody> GetActiveBodies (Guid playerId);
	}
}

