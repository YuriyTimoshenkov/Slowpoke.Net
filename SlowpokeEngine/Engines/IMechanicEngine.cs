using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public interface IMechanicEngine
	{
		void ProcessAction (BodyAction action, ActiveBody body);
		void StartEngine();
		void StopEngine();
		void AddNPCBody();
	}
}

