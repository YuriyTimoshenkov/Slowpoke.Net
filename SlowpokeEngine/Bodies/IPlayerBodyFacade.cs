using System;
using SlowpokeEngine.Actions;

namespace SlowpokeEngine.Bodies
{
	public interface IPlayerBodyFacade
	{
		Guid Id { get;}

        void Move();
        void ChangeDirection(int dX, int dY);
        void Shoot(int weaponIndex);
	}
}

