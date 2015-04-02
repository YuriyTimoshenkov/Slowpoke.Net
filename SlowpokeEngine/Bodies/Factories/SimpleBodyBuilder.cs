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
			return new NPC (new ShapeCircle(10, new Point(0,0)), mechanicEngine, 100,100);
		}

        public ActiveBody BuildNPCAI(IMechanicEngine mechanicEngine)
        {
            //TODO: load config from DB, get some data from depended services and as a result - build NPC
            return new NPCAI(new ShapeCircle(10, new Point(0, 0)), mechanicEngine, 100, 100);
        }

		public PlayerBody LoadPlayerBody (Guid characterId, IMechanicEngine mechanicEngine)
		{
			//TODO: load config from DB, get some data from depended services and as a result - load player object

            var player = new PlayerBody(
                new ShapeCircle(5, new Point(0, 0)),
                new Vector(1, 3),
                mechanicEngine,
                null,
                100, 100, "Bob");


            player.AddWeapon(new WeaponSimpleBullet(10, 2, 100, 10, new TimeSpan(0,0,1), mechanicEngine));
            player.AddWeapon(new WeaponSimpleBullet(10, 2, 200, 30, new TimeSpan(0, 0, 5), mechanicEngine));

            return player;
		}
	}
}

