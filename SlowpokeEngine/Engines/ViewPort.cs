using System;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
    public class ViewPort : IViewPort
    {
        private readonly IMapEngine _mapEngine;

        public ViewPort(IMapEngine mapEngine)
        {
            _mapEngine = mapEngine;
        }

        #region IViewPort implementation

        public IEnumerable<ActiveBody> GetActiveBodies(Guid playerId)
        {
            return _mapEngine.Bodies;
        }

        #endregion
    }
}