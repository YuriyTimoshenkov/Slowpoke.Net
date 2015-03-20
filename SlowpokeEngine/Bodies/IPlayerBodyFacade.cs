using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
	public interface IPlayerBodyFacade
	{
		Guid Id { get;}

        void Move(Vector direction);
        void ChangeDirection(Vector direction);
        void Shoot(int weaponIndex);
	}
}

