using System;
using System.Collections;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.Map;

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
		public IEnumerable<ActiveBody> GetActiveBodies (Guid playerId)
		{
			return _mapEngine.Bodies.Values;
		}
		#endregion

        public IMap Map
        {
            get { return _mapEngine.Map; }
        }
    }
}

