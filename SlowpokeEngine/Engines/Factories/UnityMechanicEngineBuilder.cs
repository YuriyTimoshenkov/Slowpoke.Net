using SlowpokeEngine.Engines;
using SlowpokeEngine.Bodies;
using Microsoft.Practices.Unity;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using SlowpokeEngine.DAL;
using System;

namespace SlowpokeEngine
{
	public class UnityMechanicEngineBuilder : IMechanicEngineBuilder
	{
		public IMechanicEngine Build()
		{
            UnityContainer unityContainer = new UnityContainer();

            unityContainer.RegisterInstance<UnityContainer>(unityContainer);
            unityContainer.RegisterType<ICharacterRepository, CharacterRepositoryEF>();
            unityContainer.RegisterType<IMapEngine, MapEngine>(new ContainerControlledLifetimeManager());
            unityContainer.RegisterType<IGameSessionRepository, GameSessionRepositoryEF>();
            unityContainer.RegisterType<IShapeCollisionManager, ShapeCollisionManager>();
            unityContainer.RegisterType<IPhysicalEngine, PhysicalEngine>();
            unityContainer.RegisterType<IViewPort, ViewPort>();
            unityContainer.RegisterType<IMechanicEngine, MechanicEngine>();

            unityContainer.RegisterType<IBodyBuilder, UnityBodyBuilder>();
            unityContainer.RegisterType<NPC>(new InjectionConstructor(
                new ShapeCircle(20, new Point(0, 0)), typeof(IMechanicEngine), 100, 100
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
	}
}