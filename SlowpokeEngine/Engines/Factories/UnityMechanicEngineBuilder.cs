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

namespace SlowpokeEngine
{
	public class UnityMechanicEngineBuilder : IMechanicEngineBuilder
	{
        private readonly int _mapCellSize = 50;

		public IMechanicEngine Build()
		{
            UnityContainer unityContainer = new UnityContainer();

            unityContainer.RegisterInstance<UnityContainer>(unityContainer);
            unityContainer.RegisterType<ICharacterRepository, CharacterRepositoryEF>();
            unityContainer.RegisterType<IMap, Map>(
                new ContainerControlledLifetimeManager(),
                new InjectionConstructor(_mapCellSize));
            unityContainer.RegisterType<IMapEngine, MapEngine>(
                new ContainerControlledLifetimeManager());
            unityContainer.RegisterType<IGameLevelRepository, HardcodedLevelRepo>(
                new ContainerControlledLifetimeManager());
            unityContainer.RegisterType<IGameSessionRepository, GameSessionRepositoryEF>();
            unityContainer.RegisterType<IShapeCollisionManager, ShapeCollisionManager>();
            unityContainer.RegisterType<IPhysicalEngine, PhysicalEngine>();
            unityContainer.RegisterType<IViewPort, ViewPort>();
            unityContainer.RegisterType<IMechanicEngine, MechanicEngine>(new ContainerControlledLifetimeManager());

            unityContainer.RegisterType<IBodyBuilder, UnityBodyBuilder>();
            unityContainer.RegisterType<NPC>(new InjectionConstructor(
                new ShapeCircle(20, new Point(300, 100)), typeof(IMechanicEngine), 100, 100
                ));
            unityContainer.RegisterType<NPCAI>(new InjectionConstructor(
                new ShapeCircle(20, new Point(200, 200)), typeof(IMechanicEngine), 100, 100
                ));
            unityContainer.RegisterType<PlayerBody>(new InjectionConstructor(
                new ShapeCircle(20, new Point(275, 575)),
                new Vector(1, 3),
                typeof(IMechanicEngine),
                typeof(IGameSessionRepository),
                100, 100,
                string.Empty
                ));

            //Weapons
            string revoler = "Revolver";
            unityContainer.RegisterType<WeaponSimpleBullet>(revoler, new InjectionConstructor(
                5, 2, 200, 4, new TimeSpan(0, 0, 0, 0, 300), typeof(IMechanicEngine), revoler
                ));
            string gun = "Gun";
            unityContainer.RegisterType<WeaponSimpleBullet>(gun, new InjectionConstructor(
               7, 2, 600, 6, new TimeSpan(0, 0, 1), typeof(IMechanicEngine), gun
               ));
            string shotGun = "Shotgun";
            unityContainer.RegisterType<WeaponMultipleShotgunBullet>(shotGun, new InjectionConstructor(
               15, 1, 170, 3, new TimeSpan(0, 0, 1), typeof(IMechanicEngine), shotGun
               ));
            string dynamite = "Dynamite";
            unityContainer.RegisterType<WeaponDynamite>(dynamite, new InjectionConstructor(
                2000, 20, 300, 4, 100, 5, new TimeSpan(0, 0, 0, 300), typeof(IMechanicEngine), dynamite
                ));

            var mechanicEngine = unityContainer.Resolve<IMechanicEngine>();

			return mechanicEngine;
		}
	}
}