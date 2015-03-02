using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine
{
	public interface IPhysicalEngine
	{
		PhysicsProcessingResult ProcessBodyAction (BodyAction action, ActiveBody body);
	}
}

