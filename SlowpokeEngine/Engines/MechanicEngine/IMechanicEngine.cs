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
        void StartEngine();
		void StopEngine();
		PlayerBody LoadPlayerBody(Guid characterId);
        void ReleaseBody(Guid bodyId);
		IPlayerBodyFacade GetPlayerBody(Guid playerId);
        void AddBody(Body body);
        void AddCommand(GameCommand command);
        void StartGame(IPlayerBodyFacade player);
        ActiveBody FindBody(Guid bodyId);
        void ProcessGameCommand(GameCommand command);
	}
}

