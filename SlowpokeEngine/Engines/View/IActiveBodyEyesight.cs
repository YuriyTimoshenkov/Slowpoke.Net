using System;
using System.Collections;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Engines.View;

namespace SlowpokeEngine.Engines
{
	public interface IActiveBodyEyesight
	{
        IViewFrame GetFrame(Guid playerId, IMapTile previousTile);
        IMap Map { get; }
        IMapTile GetPlayerCurrentTile(Guid playerId);
	}
}

