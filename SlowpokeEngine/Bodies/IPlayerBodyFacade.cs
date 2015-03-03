using System;
using SlowpokeEngine.Actions;

namespace SlowpokeEngine.Bodies
{
	public interface IPlayerBodyFacade
	{
		Guid Id { get;}

		void ProcessAction (BodyAction bodyAction);
	}
}

