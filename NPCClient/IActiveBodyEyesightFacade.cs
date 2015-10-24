using System;
using System.Collections;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Engines.View;
using SlowpokeHubs;

namespace NPCClient
{
	public interface IActiveBodyEyesightFacade
	{
        IViewFrame GetFrame(Guid playerId, IMapTile previousTile);
        IMap Map { get; }
        IMapTile GetPlayerCurrentTile(Guid playerId);
	}
}

