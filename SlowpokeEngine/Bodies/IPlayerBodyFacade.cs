using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
	public interface IPlayerBodyFacade
	{
		Guid Id { get;}

        void Move(Vector direction);
        void ChangeDirection(int dX, int dY);
        void Shoot(int weaponIndex);
	}
}

