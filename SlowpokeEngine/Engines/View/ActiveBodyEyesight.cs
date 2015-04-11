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
        public IViewFrame GetFrame(Guid playerId, IMapTile previousTile)
		{
            var frame = new ViewFrame() {  Bodies = new List<ActiveBody>(_mapEngine.Bodies.Values) };
            var currentTile = _mapEngine.GetBodyTile(playerId);

            if(previousTile == null  || currentTile.Position != previousTile.Position)
            {
                var player = _mapEngine.Bodies[playerId];
                frame.Map = _mapEngine.GetSurroundTiles(currentTile, player.ViewZone);

                return frame;
            }

            return frame;
		}
		#endregion

        public IMap Map
        {
            get { return _mapEngine.Map; }
        }

        public IMapTile GetPlayerCurrentTile(Guid playerId)
        {
            return _mapEngine.GetBodyTile(playerId);
        }
    }
}

