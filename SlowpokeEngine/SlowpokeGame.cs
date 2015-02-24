using System;

namespace SlowpokeEngine
{
	public class SlowpokeGame
	{
		private MechanicEngine mechanicEngine;

		public SlowpokeGame(MechanicEngine mechanicEngine)
		{
			this.mechanicEngine = mechanicEngine;

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

