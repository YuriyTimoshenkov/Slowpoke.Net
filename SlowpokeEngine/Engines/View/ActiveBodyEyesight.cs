using System;
using System.Collections;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Engines.View;
using System.Linq;

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
            var frame = new ViewFrame();
            Body body;

            if (_mapEngine.Bodies.TryGetValue(playerId, out body))
            {
                var player = body as ActiveBody;
                var currentTile = _mapEngine.GetBodyTile(playerId);
                var map = _mapEngine.GetSurroundTiles(currentTile, player.ViewZone);

                //Get bodies
                frame.Bodies = map.SelectMany(tile => tile.Bodies).ToList();

                if (previousTile == null || (currentTile != null && currentTile.Position != previousTile.Position))
                {
                    frame.Map = map;
                }
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

