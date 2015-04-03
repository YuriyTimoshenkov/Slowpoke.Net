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
        private readonly int _mapCellSize = 50;

		public IMechanicEngine Build()
		{
            UnityContainer unityContainer = new UnityContainer();

            unityContainer.RegisterInstance<UnityContainer>(unityContainer);
            unityContainer.RegisterType<ICharacterRepository, CharacterRepositoryEF>();
            unityContainer.RegisterType<IMap, Map>(
                new ContainerControlledLifetimeManager(),
                new InjectionConstructor(BuildSimpleMap(), _mapCellSize));
            unityContainer.RegisterType<IMapEngine, MapEngine>(
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
                new ShapeCircle(20, new Point(300, 500)),
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

            var mechanicEngine = unityContainer.Resolve<IMechanicEngine>();

			return mechanicEngine;
		}

        private List<List<IMapTile>> BuildSimpleMap()
        {
            string[,] rawMap = new string[16, 10] {
        {"water", "water", "water", "water", "water", "water", "water", "water", "water", "water"},
        {"water", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "water"},
        {"water", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "water"},
        {"water", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "water"},
        {"water", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "water"},
        {"water", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "water"},
        {"water", "meadow", "water", "meadow", "meadow", "road", "road", "road", "road", "water"},
        {"water", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "water"},
        {"water", "meadow", "water", "meadow", "meadow", "road", "meadow", "meadow", "meadow", "water"},
        {"water", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "water"},
        {"water", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "water"},
        {"water", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "water"},
        {"water", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "water"},
        {"water", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "water"},
        {"water", "meadow", "water", "rock", "rock", "road", "rock", "rock", "rock", "water"},
        {"water", "water", "water", "water", "water", "water", "water", "water", "water", "water"}
        };

            var finalMap = new List<List<IMapTile>>();

            foreach (var row in Enumerable.Range(0, rawMap.GetLength(0)))
            {
                var newLayer = new List<IMapTile>();

                foreach (var column in Enumerable.Range(0, rawMap.GetLength(1)))
                {
                    var newTile = new MapTile(rawMap[row,column],
                        rawMap[row, column] == "water" ? true : false,
                        new Point(column, row), new ShapeRectangle(
                            _mapCellSize,_mapCellSize,
                            new Point(column * _mapCellSize + _mapCellSize / 2, row * _mapCellSize + _mapCellSize / 2)
                            ));

                    newLayer.Add(newTile);
                }

                finalMap.Add(newLayer);
            }

            return finalMap;
        }
	}
}