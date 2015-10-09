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
using SlowpokeEngine.Configuration;

namespace SlowpokeEngine
{
	public class UnityMechanicEngineBuilder : IMechanicEngineBuilder
	{
        private readonly int _mapCellSize = 100;

        public IMechanicEngine Build(Action<IPlayerBodyFacade> playerStateHandler, IEngineConfiguration configuration)
		{
            UnityContainer unityContainer = new UnityContainer();

            unityContainer.RegisterInstance<UnityContainer>(unityContainer);
            unityContainer.RegisterType<ILogger, NLogAdapter>(new InjectionConstructor("Slowpoke.Log"));
            unityContainer.RegisterType<ICharacterRepository, CharacterRepositoryEF>();
            unityContainer.RegisterType<IMechanicService, NPCGenerationService>("NPCGenerationService");
            unityContainer.RegisterType<IMechanicService, BoxesGenerationService>("LifeContainerGenerationService");
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
            unityContainer.RegisterInstance<Action<IPlayerBodyFacade>>(playerStateHandler);
            unityContainer.RegisterType<IMechanicEngine, MechanicEngine>(new ContainerControlledLifetimeManager());

            unityContainer.RegisterType<IBodyBuilder, UnityBodyBuilder>();

            unityContainer.RegisterType<Shape, ShapeCircle>("NPCShape",
                new InjectionConstructor(((ShapeCircle)configuration.NPC.Shape).Radius, configuration.NPC.Shape.Position));
            unityContainer.RegisterType<NPCAI>(new InjectionConstructor(
                new ResolvedParameter<Shape>("NPCShape"), 
                typeof(IMechanicEngine), 
                configuration.NPC.Life, 
                configuration.NPC.LifeMax,
                configuration.NPC.ViewZone,
                configuration.NPC.Speed
                ));

            unityContainer.RegisterType<Shape, ShapeCircle>("LifeContainerShape",
                new InjectionConstructor(((ShapeCircle)configuration.NPC.Shape).Radius, configuration.NPC.Shape.Position));
            unityContainer.RegisterType<LifeContainer>(
                new InjectionConstructor(
                    new ResolvedParameter<Shape>("LifeContainerShape"),
                50));


            unityContainer.RegisterType<Shape, ShapeCircle>("PlayerShape",
                new InjectionConstructor(((ShapeCircle)configuration.NPC.Shape).Radius, configuration.NPC.Shape.Position));
            unityContainer.RegisterType<PlayerBody>(new InjectionConstructor(
                new ResolvedParameter<Shape>("PlayerShape"), 
                new Vector(1, 3),
                typeof(IMechanicEngine),
                typeof(IGameSessionRepository),
                configuration.Player.Life,
                configuration.Player.LifeMax,
                string.Empty,
                configuration.Player.ViewZone,
                configuration.Player.Speed
                ));

            BuildWeapons(unityContainer, configuration);

            var mechanicEngine = unityContainer.Resolve<IMechanicEngine>();

            //Build services
            var npcGenerationService = unityContainer.Resolve<IMechanicService>(
                "NPCGenerationService", new ParameterOverride("npcCount", configuration.NPCGenerationService.EntitiesCount));
            mechanicEngine.Services.Add(npcGenerationService);

            var lifeContainerGenerationService = unityContainer.Resolve<IMechanicService>(
                "LifeContainerGenerationService", new ParameterOverride("containersCount", configuration.BoxesGenerationService.EntitiesCount));
            mechanicEngine.Services.Add(lifeContainerGenerationService);

			return mechanicEngine;
		}


        private static void BuildWeapons(UnityContainer unityContainer, IEngineConfiguration configuration)
        {
            string revoler = "Revolver";
            unityContainer.RegisterType<WeaponSimpleBullet>(revoler, new InjectionConstructor(
                configuration.Revolver.Damage,
                configuration.Revolver.BulletSize,
                configuration.Revolver.ShootingDistance,
                configuration.Revolver.BulletSpeed,
                new TimeSpan(0, 0, 0, 0, configuration.Revolver.ShootingFrequency), typeof(IMechanicEngine), configuration.Revolver.Name, configuration.Revolver.Shape
                ));
            string gun = "Gun";
            unityContainer.RegisterType<WeaponSimpleBullet>(gun, new InjectionConstructor(
                configuration.Gun.Damage,
                configuration.Gun.BulletSize,
                configuration.Gun.ShootingDistance,
                configuration.Gun.BulletSpeed,
                new TimeSpan(0, 0, 0, 0, configuration.Gun.ShootingFrequency), typeof(IMechanicEngine), configuration.Gun.Name, configuration.Gun.Shape
                ));
            string shotGun = "Shotgun";
            unityContainer.RegisterType<WeaponMultipleShotgunBullet>(shotGun, new InjectionConstructor(
               configuration.ShotGun.Damage,
                configuration.ShotGun.BulletSize,
                configuration.ShotGun.ShootingDistance,
                configuration.ShotGun.BulletSpeed,
                new TimeSpan(0, 0, 0, 0, configuration.ShotGun.ShootingFrequency), typeof(IMechanicEngine), configuration.ShotGun.Name, configuration.ShotGun.Shape
                ));

            string dynamite = "Dynamite";
            unityContainer.RegisterType<WeaponDynamite>(dynamite, new InjectionConstructor(
                configuration.Dynamit.DetonationTime,
                configuration.Dynamit.BangRadius,
                configuration.Dynamit.Damage,
                configuration.Dynamit.BulletSize,
                configuration.Dynamit.ShootingDistance,
                configuration.Dynamit.BulletSpeed,
                new TimeSpan(0, 0, 0, configuration.Dynamit.ShootingFrequency),
                typeof(IMechanicEngine),
                configuration.Dynamit.Name,
                configuration.Dynamit.Shape
                ));
        }
	}
}