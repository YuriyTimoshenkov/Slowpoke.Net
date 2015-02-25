using System;

namespace SlowpokeEngine
{
	public class SlowpokeGame
	{
		private MechanicEngine mechanicEngine;
		private MapEngine MapEngine;

		public SlowpokeGame(MechanicEngine mechanicEngine, MapEngine mapEngine)
		{
			this.mechanicEngine = mechanicEngine;
			this.MapEngine = mapEngine;

			mechanicEngine.StartEngine ();
		}

		public void AddNPC(NPC npc)
		{
			mechanicEngine.Bodies.TryAdd(Guid.NewGuid (), npc);

			npc.NewAction += (object sender, NewActionEventArgs e) => 
				mechanicEngine.ActionQueue.Enqueue(new Tuple<Action, ActiveBody>(e.Action, npc));
		}

		public void StopGame()
		{
			mechanicEngine.StopEngine ();
		}
	}
}

