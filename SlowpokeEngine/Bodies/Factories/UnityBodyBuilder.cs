using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using Microsoft.Practices.Unity;
using SlowpokeEngine.DAL;
using System.Linq;

namespace SlowpokeEngine.Bodies
{
	public class UnityBodyBuilder : IBodyBuilder
	{
        private UnityContainer _unityContainer;
        private IGameSessionRepository _sessionRepository;
        private ICharacterRepository _characterRepository;

        public UnityBodyBuilder(
            UnityContainer unityContainer,
            IGameSessionRepository sessionRepository,
            ICharacterRepository characterRepository)
        {
            _unityContainer = unityContainer;
            _sessionRepository = sessionRepository;
            _characterRepository = characterRepository;
        }

		public ActiveBody BuildNPC(IMechanicEngine mechanicEngine)
		{
			//TODO: load config from DB, get some data from depended services and as a result - build NPC
            return _unityContainer.Resolve<NPC>();
		}

        public ActiveBody BuildNPCAI(IMechanicEngine mechanicEngine)
        {
            var npcai = _unityContainer.Resolve<NPCAI>();
            npcai.AddWeapon(_unityContainer.Resolve<WeaponSimpleBullet>("Revolver"));
            //TODO: load config from DB, get some data from depended services and as a result - build NPC
            return npcai;
        }

        public PlayerBody LoadPlayerBody(Guid characterId, IMechanicEngine mechanicEngine)
		{
			//TODO: load config from DB, get some data from depended services and as a result - load player object
            var character = _characterRepository.Find(characterId).FirstOrDefault();
            
            var player = _unityContainer.Resolve<PlayerBody>();
            player.AddWeapon(_unityContainer.Resolve<WeaponSimpleBullet>("Revolver"));
            player.AddWeapon(_unityContainer.Resolve<WeaponSimpleBullet>("Gun"));
            player.AddWeapon(_unityContainer.Resolve<WeaponMultipleShotgunBullet>("Shotgun"));
            
            //Fill playerBody with character data
            player.Id = character.Id;


            //Create session
            var newSession = new GameSession(character.Id);
            _sessionRepository.AddSession(newSession);

            player.SessionId = newSession.Id;

            return player;
		}
	}
}

