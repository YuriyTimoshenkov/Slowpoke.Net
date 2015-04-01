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

namespace SlowpokeEngine
{
	public class UnityMechanicEngineBuilder : IMechanicEngineBuilder
	{
		public IMechanicEngine Build()
		{
            UnityContainer unityContainer = new UnityContainer();

            unityContainer.RegisterInstance<UnityContainer>(unityContainer);
            unityContainer.RegisterType<ICharacterRepository, CharacterRepositoryEF>();
            unityContainer.RegisterType<IMap, Map>(
                new ContainerControlledLifetimeManager(),
                new InjectionConstructor(BuildSimpleMap(), 50));
            unityContainer.RegisterType<IMapEngine, MapEngine>(
                new ContainerControlledLifetimeManager());
            unityContainer.RegisterType<IGameSessionRepository, GameSessionRepositoryEF>();
            unityContainer.RegisterType<IShapeCollisionManager, ShapeCollisionManager>();
            unityContainer.RegisterType<IPhysicalEngine, PhysicalEngine>();
            unityContainer.RegisterType<IViewPort, ViewPort>();
            unityContainer.RegisterType<IMechanicEngine, MechanicEngine>();

            unityContainer.RegisterType<IBodyBuilder, UnityBodyBuilder>();
            unityContainer.RegisterType<NPC>(new InjectionConstructor(
                new ShapeCircle(20, new Point(0, 0)), typeof(IMechanicEngine), 100, 100
                ));
            unityContainer.RegisterType<NPCAI>(new InjectionConstructor(
                new ShapeCircle(20, new Point(200, 200)), typeof(IMechanicEngine), 100, 100
                ));
            unityContainer.RegisterType<PlayerBody>(new InjectionConstructor(
                new ShapeCircle(20, new Point(0, 0)),
                new Vector(1, 3),
                typeof(IMechanicEngine),
                typeof(IGameSessionRepository),
                100, 100
                ));
            unityContainer.RegisterType<WeaponSimpleBullet>("Revolver",new InjectionConstructor(
                5, 2, 200, 4, new TimeSpan(0, 0, 0, 0, 300), typeof(IMechanicEngine)
                ));
            unityContainer.RegisterType<WeaponSimpleBullet>("Gun", new InjectionConstructor(
               7, 2, 600, 6, new TimeSpan(0, 0, 1), typeof(IMechanicEngine)
               ));
            unityContainer.RegisterType<WeaponMultipleShotgunBullet>("Shotgun", new InjectionConstructor(
               15, 1, 170, 3, new TimeSpan(0, 0, 1), typeof(IMechanicEngine)
               ));

            var mechanicEngine = unityContainer.Resolve<IMechanicEngine>();

			return mechanicEngine;
		}

        private List<List<IMapTile>> BuildSimpleMap()
        {
            string[,] rawMap = new string[16, 10] {
        {"meadow", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "meadow"},
        {"meadow", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "meadow"},
        {"meadow", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "meadow"},
        {"meadow", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "meadow"},
        {"meadow", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "meadow"},
        {"meadow", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "meadow"},
        {"meadow", "meadow", "water", "meadow", "meadow", "road", "road", "road", "road", "road"},
        {"meadow", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "meadow"},
        {"meadow", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "rock"},
        {"meadow", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "rock"},
        {"meadow", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "rock"},
        {"meadow", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "rock"},
        {"meadow", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "rock"},
        {"meadow", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "rock"},
        {"meadow", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "rock"},
        {"meadow", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "rock"}
        };

            var finalMap = new List<List<IMapTile>>();

            foreach (var row in Enumerable.Range(0, rawMap.GetLength(0)))
            {
                var newLayer = new List<IMapTile>();

                foreach (var column in Enumerable.Range(0, rawMap.GetLength(1)))
                {
                    newLayer.Add(new MapTile(rawMap[row,column]));
                }

                finalMap.Add(newLayer);
            }

            return finalMap;
        }
	}
}