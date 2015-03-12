using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Actions;

namespace SlowpokeEngine
{
	public interface IMechanicEngine
	{
		IViewPort ViewPort { get; }

		void StartEngine();
		void StopEngine();
		IPlayerBodyFacade LoadPlayerBody();
		void ReleaseActiveBody(Guid playerId);
		IPlayerBodyFacade GetPlayerBody(Guid playerId);
        void ProcessGameCommand(GameCommand command);
        void AddActiveBody(ActiveBody body);
	}
}

