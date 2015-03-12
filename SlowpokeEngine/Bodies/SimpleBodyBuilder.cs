using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;

namespace SlowpokeEngine.Bodies
{
	public class SimpleBodyBuilder : IBodyBuilder
	{
		public ActiveBody BuildNPC(IMechanicEngine mechanicEngine)
		{
			//TODO: load config from DB, get some data from depended services and as a result - build NPC
			return new NPC (mechanicEngine);
		}

		public PlayerBody LoadPlayerBody (IMechanicEngine mechanicEngine)
		{
			//TODO: load config from DB, get some data from depended services and as a result - load player object

			var player = new PlayerBody (
				new Point (0, 0),
				new Vector (1, 3),
				mechanicEngine);

            player.Weapons.Add(new WeaponGun(10,10,500, mechanicEngine));

            return player;
		}
	}
}

