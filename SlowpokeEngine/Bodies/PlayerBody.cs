using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Actions;
using System.Collections.Generic;
using SlowpokeEngine.Weapons;

namespace SlowpokeEngine.Bodies
{
	public class PlayerBody : ActiveBody, IPlayerBodyFacade
	{
        public List<WeaponBase> Weapons { get; private set; }

        public PlayerBody(
            Shape shape,
			Vector direction,
			IMechanicEngine mechanicEngine
            ):base(shape, direction,  mechanicEngine)
        {
            Weapons = new List<WeaponBase>();
        }

		public void ProcessAction (GameCommand bodyAction)
		{
            _mechanicEngine.ProcessGameCommand(bodyAction);
		}

        public void Move(Vector direction)
        {
            ProcessAction(new GameCommandMove(direction, _mechanicEngine, this));
        }

        public void ChangeDirection(Vector direction)
        {
            ProcessAction(new GameCommandChangeDirection(direction, _mechanicEngine, this));
        }

        public void Shoot(int weaponIndex)
        {
            if(weaponIndex >= 0 && Weapons.Count >= weaponIndex)
            {
                //calculate start point
                var startPosition = Direction.MovePoint(
                    Shape.Position, Shape.MaxDimension);

                Weapons[weaponIndex - 1].Shoot(startPosition, Direction);
            }
        }
    }
}

