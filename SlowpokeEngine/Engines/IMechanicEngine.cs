using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Actions;
using System.Collections.Generic;
using SlowpokeEngine.Engines.Services;
using SlowpokeEngine.Engines.Map;

namespace SlowpokeEngine
{
	public interface IMechanicEngine
	{
		IActiveBodyEyesight ViewPort { get; }
        IList<IMechanicService> Services { get; }
        ICollection<ActiveBody> ActiveBodies { get; }
        IMap Map { get; }
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

