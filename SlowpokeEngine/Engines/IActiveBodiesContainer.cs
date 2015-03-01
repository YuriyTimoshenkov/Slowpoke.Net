using System;
using System.Collections.Concurrent;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine
{
	public interface IActiveBodiesContainer
	{
		ConcurrentDictionary<Guid, ActiveBody>  Bodies {get;}
	}
}

