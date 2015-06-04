using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
	public interface IPlayerBodyFacade
	{
		Guid Id { get;}

        BodyState State { get; }

        void Move(long commandId, Vector direction, TimeSpan duration);
        void ChangeDirection(long commandId, Vector direction);
        void Shoot();
        void ChangeWeapon();
        void Use();
	}
}

