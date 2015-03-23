using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using Microsoft.Practices.Unity;

namespace SlowpokeEngine.Bodies
{
	public class UnityBodyBuilder : IBodyBuilder
	{
        private UnityContainer _unityContainer;

        public UnityBodyBuilder(UnityContainer unityContainer)
        {
            _unityContainer = unityContainer;
        }

		public ActiveBody BuildNPC(IMechanicEngine mechanicEngine)
		{
			//TODO: load config from DB, get some data from depended services and as a result - build NPC
            return _unityContainer.Resolve<NPC>();
		}

		public PlayerBody LoadPlayerBody (IMechanicEngine mechanicEngine)
		{
			//TODO: load config from DB, get some data from depended services and as a result - load player object

            var player = _unityContainer.Resolve<PlayerBody>();

            player.Weapons.Add(_unityContainer.Resolve<WeaponGun>());

            return player;
		}
	}
}

