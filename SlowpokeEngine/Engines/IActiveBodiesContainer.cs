using System;
using System.Collections.Concurrent;

namespace SlowpokeEngine
{
	public interface IActiveBodiesContainer
	{
		ConcurrentDictionary<Guid, ActiveBody>  Bodies {get;}
	}
}

