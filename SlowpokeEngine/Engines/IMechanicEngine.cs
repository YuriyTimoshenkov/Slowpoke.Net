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
        ICollection<Body> Bodies { get; }
        IMap Map { get; }
        void StartEngine(Action<IPlayerBodyFacade> playerStateHandler);
		void StopEngine();
		IPlayerBodyFacade LoadPlayerBody(Guid characterId);
		void ReleaseBody(Guid playerId);
		IPlayerBodyFacade GetPlayerBody(Guid playerId);
        void ProcessGameCommand(GameCommand command);
        void AddBody(Body body);
        void AddCommand(GameCommand command);
        void StartGame(IPlayerBodyFacade player);
	}
}

