using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
	public interface IPlayerBodyFacade
	{
		Guid Id { get;}

        BodyState State { get; }

        void Move(Vector direction);
        void ChangeDirection(Vector direction);
        void Shoot();
        void ChangeWeapon();
        void Use();
	}
}

