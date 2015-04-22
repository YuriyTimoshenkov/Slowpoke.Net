using System;
using System.Collections.Concurrent;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SlowpokeEngine.Engines.Map
{
	public interface IMapEngine
	{
        IMap Map { get; }
        IEnumerable<Body> GetBodiesForCollision(ActiveBody body);
        ConcurrentDictionary<Guid, Body> Bodies { get; }
        void AddBody(Body body);
        void UpdateActiveBody(ActiveBody body);
        void LoadMap(IGameLevel gameLevel);
        bool RemoveBody(Guid bodyId);
        IMapTile GetBodyTile(Guid bodyId);
        IList<IMapTile> GetSurroundTiles(IMapTile tile, int deviation);
        ActiveBody FindBody(Guid bodyId);
	}
}

