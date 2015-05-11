using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Actions;
using System.Collections.Generic;
using SlowpokeEngine.Engines.Services;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Entities;
using SlowpokeHubs;
using System.Collections.Concurrent;

namespace NPCClient
{
	public interface IClientMechanicEngine
	{
		IActiveBodyEyesightFacade ViewPort { get; }
        ConcurrentDictionary<Guid, NPCAI> Players { get; }
        ConcurrentDictionary<Guid, InputEvent> PlayerEvents { get; }
        void AddPlayer(NPCAI player);
        void Move(Vector direction, Guid bodyId, TimeSpan duration);
        void ChangeDirection(Vector direction, Guid bodyId);
        void Shoot(Guid bodyId);
	}
}

