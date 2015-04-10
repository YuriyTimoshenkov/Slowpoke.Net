using System;
using System.Collections;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Engines.View;

namespace SlowpokeEngine.Engines
{
	public class ActiveBodyEyesight : IActiveBodyEyesight
	{
		private readonly IMapEngine _mapEngine;

        public ActiveBodyEyesight(IMapEngine mapEngine)
		{
			_mapEngine = mapEngine;
		}

		#region IViewPort implementation
		public IViewFrame GetFrame (Guid playerId)
		{
            return new ViewFrame() {  Bodies = new List<ActiveBody>(_mapEngine.Bodies.Values) };
		}
		#endregion

        public IMap Map
        {
            get { return _mapEngine.Map; }
        }
    }
}

