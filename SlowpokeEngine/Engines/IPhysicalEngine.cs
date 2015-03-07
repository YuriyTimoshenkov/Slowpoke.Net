using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public interface IPhysicalEngine
	{
		PhysicsProcessingResult ProcessBodyAction (BodyAction action);
	}
}

