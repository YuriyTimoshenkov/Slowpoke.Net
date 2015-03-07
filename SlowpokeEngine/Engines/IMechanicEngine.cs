using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public interface IMechanicEngine
	{
		IViewPort ViewPort { get; }

		void ProcessAction (BodyAction action);
		void StartEngine();
		void StopEngine();
		void AddNPCBody();
		IPlayerBodyFacade LoadPlayerBody();
		void ReleasePlayerBody(Guid playerId);
		IPlayerBodyFacade GetPlayerBody(Guid playerId);
	}
}

