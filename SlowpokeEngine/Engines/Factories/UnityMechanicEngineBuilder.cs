using SlowpokeEngine.Engines;
using SlowpokeEngine.Bodies;
using Microsoft.Practices.Unity;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using SlowpokeEngine.DAL;

namespace SlowpokeEngine
{
	public class UnityMechanicEngineBuilder : IMechanicEngineBuilder
	{
		public IMechanicEngine Build()
		{
            UnityContainer unityContainer = new UnityContainer();

            unityContainer.RegisterInstance<UnityContainer>(unityContainer);
            unityContainer.RegisterType<IMapEngine, MapEngine>(new ContainerControlledLifetimeManager());
            unityContainer.RegisterType<IGameSessionRepository, GameSessionRepositoryEF>();
            unityContainer.RegisterType<IShapeCollisionManager, ShapeCollisionManager>();
            unityContainer.RegisterType<IPhysicalEngine, PhysicalEngine>();
            unityContainer.RegisterType<IViewPort, ViewPort>();
            unityContainer.RegisterType<IMechanicEngine, MechanicEngine>();

            unityContainer.RegisterType<IBodyBuilder, UnityBodyBuilder>();
            unityContainer.RegisterType<NPC>(new InjectionConstructor(
                new ShapeCircle(10, new Point(0, 0)), typeof(IMechanicEngine)
                ));
            unityContainer.RegisterType<PlayerBody>(new InjectionConstructor(
                new ShapeCircle(5, new Point(0, 0)),
                new Vector(1, 3),
                typeof(IMechanicEngine),
                typeof(IGameSessionRepository)
                ));
            unityContainer.RegisterType<WeaponGun>(new InjectionConstructor(
                10, 2, 100, 10, typeof(IMechanicEngine)
                ));

            var mechanicEngine = unityContainer.Resolve<IMechanicEngine>();

			return mechanicEngine;
		}
	}
}