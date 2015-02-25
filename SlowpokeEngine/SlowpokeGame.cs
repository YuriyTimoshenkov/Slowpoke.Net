using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines;

namespace SlowpokeEngine
{
	public class SlowpokeGame
	{
		private readonly MechanicEngine _mechanicEngine;
		private MapEngine _mapEngine;

		public SlowpokeGame(MechanicEngine mechanicEngine, MapEngine mapEngine)
		{
			_mechanicEngine = mechanicEngine;
			_mapEngine = mapEngine;

			mechanicEngine.StartEngine ();
		}

		public void AddNPC(NPC npc)
		{
			_mechanicEngine.Bodies.TryAdd(Guid.NewGuid (), npc);
			
			//Очень стремно, нужна отписка от событий 
			npc.NewAction += (sender, e) => _mechanicEngine.ActionQueue.Enqueue(new Tuple<Action, ActiveBody>(e.Action, npc));
		}

		public void StopGame()
		{
			_mechanicEngine.StopEngine ();
		}
	}
}

