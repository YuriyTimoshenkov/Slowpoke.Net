using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Actions;

namespace SlowpokeEngine
{
	public interface IMechanicEngine
	{
		IActiveBodyEyesight ViewPort { get; }

        void StartEngine(Action<IPlayerBodyFacade> playerStateHandler);
		void StopEngine();
		IPlayerBodyFacade LoadPlayerBody(Guid characterId);
		void ReleaseActiveBody(Guid playerId);
		IPlayerBodyFacade GetPlayerBody(Guid playerId);
        void ProcessGameCommand(GameCommand command);
        void AddActiveBody(ActiveBody body);
        void AddCommand(GameCommand command);
        void StartGame(IPlayerBodyFacade player);
	}
}

