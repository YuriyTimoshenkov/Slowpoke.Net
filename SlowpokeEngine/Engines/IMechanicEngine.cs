using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Actions;

namespace SlowpokeEngine
{
	public interface IMechanicEngine
	{
		IViewPort ViewPort { get; }

		void ProcessAction (BodyAction action, ActiveBody body);
		void StartEngine();
		void StopEngine();
		void AddNPCBody();
		IPlayerBodyFacade LoadPlayerBody();
		void ReleasePlayerBody(Guid playerId);
		IPlayerBodyFacade GetPlayerBody(Guid playerId);
	}
}

