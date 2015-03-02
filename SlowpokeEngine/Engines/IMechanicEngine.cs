using System;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine
{
	public interface IMechanicEngine
	{
		void ProcessAction (BodyAction action, ActiveBody body);
		void StartEngine();
		void StopEngine();
		void AddNPCBody();
	}
}

