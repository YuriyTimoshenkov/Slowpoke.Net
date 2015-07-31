using SlowpokeEngine.Engines;
using SlowpokeEngine.Bodies;
using Microsoft.Practices.Unity;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using SlowpokeEngine.DAL;
using System;
using SlowpokeEngine.Engines.Map;
using System.Collections.Generic;
using System.Linq;
using SlowpokeEngine.Engines.Levels;
using SlowpokeEngine.Engines.Services;
using Common;

namespace SlowpokeEngine
{
	public class UnityMechanicEngineBuilder : IMechanicEngineBuilder
	{
        private readonly int _mapCellSize = 100;

		public IMechanicEngine Build()
		{
            UnityContainer unityContainer = new UnityContainer();

            unityContainer.RegisterInstance<UnityContainer>(unityContainer);
            unityContainer.RegisterType<ILogger, NLogAdapter>(new InjectionConstructor("Slowpoke.Log"));
            unityContainer.RegisterType<ICharacterRepository, CharacterRepositoryEF>();
            unityContainer.RegisterType<IMechanicService, NPCGenerationService>("NPCGenerationService");
            unityContainer.RegisterType<IMechanicService, LifeContainersGenerationService>("LifeContainerGenerationService");
            unityContainer.RegisterType<IMap, Map>(
                new ContainerControlledLifetimeManager(),
                new InjectionConstructor(_mapCellSize));
            unityContainer.RegisterType<IMapEngine, MapEngine>(
                new ContainerControlledLifetimeManager());
            unityContainer.RegisterType<IGameLevelRepository, HardcodedLevelRepo>(
                new ContainerControlledLifetimeManager());
            unityContainer.RegisterType<IGameSessionRepository, GameSessionRepositoryEF>();
            unityContainer.RegisterType<IShapeCollisionManager, ShapeCollisionManager>();
            unityContainer.RegisterType<IPhysicsEngine, PhysicsEngine>();
            unityContainer.RegisterType<IActiveBodyEyesight, ActiveBodyEyesight>();
            unityContainer.RegisterType<IMechanicEngine, MechanicEngine>(new ContainerControlledLifetimeManager());

            unityContainer.RegisterType<IBodyBuilder, UnityBodyBuilder>();
            unityContainer.RegisterType<NPCAI>(new InjectionConstructor(
                new ShapeCircle(20, new Point(200, 200)), typeof(IMechanicEngine), 100, 100, 6, 70
                ));
            unityContainer.RegisterType<LifeContainer>(new InjectionConstructor(
                new ShapeCircle(10, new Point(200, 200)),
                50));
            unityContainer.RegisterType<PlayerBody>(new InjectionConstructor(
                new ShapeCircle(20, new Point(275, 575)),
                new Vector(1, 3),
                typeof(IMechanicEngine),
                typeof(IGameSessionRepository),
                100, 1000,
                string.Empty,
                7,
                200
                ));

            BuildWeapons(unityContainer);

            var mechanicEngine = unityContainer.Resolve<IMechanicEngine>();

            //Build services
            var npcGenerationService = unityContainer.Resolve<IMechanicService>(
                "NPCGenerationService", new ParameterOverride("npcCount", 100));
            mechanicEngine.Services.Add(npcGenerationService);

            var lifeContainerGenerationService = unityContainer.Resolve<IMechanicService>(
                "LifeContainerGenerationService", new ParameterOverride("containersCount", 50));
            mechanicEngine.Services.Add(lifeContainerGenerationService);

			return mechanicEngine;
		}


        private static void BuildWeapons(UnityContainer unityContainer)
        {
            string revoler = "Revolver";
            unityContainer.RegisterType<WeaponSimpleBullet>(revoler, new InjectionConstructor(
                5, 2, 400, 350*4, new TimeSpan(0, 0, 0, 0, 300), typeof(IMechanicEngine), revoler
                ));
            string gun = "Gun";
            unityContainer.RegisterType<WeaponSimpleBullet>(gun, new InjectionConstructor(
               7, 2, 1000, 400*4, new TimeSpan(0, 0, 1), typeof(IMechanicEngine), gun
               ));
            string shotGun = "Shotgun";
            unityContainer.RegisterType<WeaponMultipleShotgunBullet>(shotGun, new InjectionConstructor(
               15, 1, 350, 300*4, new TimeSpan(0, 0, 1), typeof(IMechanicEngine), shotGun
               ));
            string dynamite = "Dynamite";
            unityContainer.RegisterType<WeaponDynamite>(dynamite, new InjectionConstructor(
                2000, 20, 300, 4, 100, 5, new TimeSpan(0, 0, 0, 300), typeof(IMechanicEngine), dynamite
                ));
        }
	}
}