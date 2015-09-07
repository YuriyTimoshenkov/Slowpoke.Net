using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using Microsoft.Practices.Unity;
using SlowpokeEngine.DAL;
using System.Linq;
using System.Collections.Generic;

namespace SlowpokeEngine.Bodies
{
	public class UnityBodyBuilder : IBodyBuilder
	{
        private UnityContainer _unityContainer;
        private IGameSessionRepository _sessionRepository;
        private ICharacterRepository _characterRepository;
        private Random _randomizer = new Random();

        public UnityBodyBuilder(
            UnityContainer unityContainer,
            IGameSessionRepository sessionRepository,
            ICharacterRepository characterRepository)
        {
            _unityContainer = unityContainer;
            _sessionRepository = sessionRepository;
            _characterRepository = characterRepository;
        }

        public ActiveBody BuildNPCAI(IMechanicEngine mechanicEngine)
        {
            var npcai = _unityContainer.Resolve<NPCAI>();
            npcai.AddWeapon(_unityContainer.Resolve<WeaponSimpleBullet>("Revolver"));
            npcai.SocialGroups.Add("Police");
            //TODO: load config from DB, get some data from depended services and as a result - build NPC
            return npcai;
        }

        public LifeContainer BuildLifeContainer(IMechanicEngine mechanicEngine)
        {
            var lifeContainer = _unityContainer.Resolve<LifeContainer>();

            return lifeContainer;
        }

        public PlayerBody LoadPlayerBody(Guid characterId, IMechanicEngine mechanicEngine)
		{
			//TODO: load config from DB, get some data from depended services and as a result - load player object
            var character = _characterRepository.Find(characterId).FirstOrDefault();

            var player = _unityContainer.Resolve<PlayerBody>(
                new ParameterOverride("name", character.Name));
            player.AddWeapon(_unityContainer.Resolve<WeaponSimpleBullet>("Revolver"));
            player.AddWeapon(_unityContainer.Resolve<WeaponSimpleBullet>("Gun"));
            player.AddWeapon(_unityContainer.Resolve<WeaponMultipleShotgunBullet>("Shotgun"));
            player.AddWeapon(_unityContainer.Resolve<WeaponDynamite>("Dynamite"));

            player.SocialGroups.Add("Bandit");

            //Fill playerBody with character data
            player.Id = character.Id;


            //Create session
            var newSession = new GameSession(character.Id);
            _sessionRepository.AddSession(newSession);

            player.SessionId = newSession.Id;

            return player;
		}

        public BoxBody BuildBox(IMechanicEngine mechanicEngine, Point point)
        {
            var bodyType = _randomizer.Next(1000);
            Body bodyInsideBox = null;

            if (bodyType % 2 != 0)
            {
                bodyInsideBox = _unityContainer.Resolve<WeaponSimpleBullet>("Revolver");
                System.Diagnostics.Debug.WriteLine("Revolver created");
            }
            else
            {
                bodyInsideBox = BuildLifeContainer(mechanicEngine);
                System.Diagnostics.Debug.WriteLine("Life created");
            }

            var box = new BoxBody(new ShapeRectangle(30, 30, point),
                new List<Body>() { bodyInsideBox },
                mechanicEngine,
                20,
                20);

            return box;
        }
    }
}

