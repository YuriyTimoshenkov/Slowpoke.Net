using System;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
    public interface IViewPort
    {
        IEnumerable<ActiveBody> GetActiveBodies(Guid playerId);
    }
}