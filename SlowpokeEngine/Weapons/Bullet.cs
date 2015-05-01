﻿using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SlowpokeEngine.Weapons
{
    public class Bullet : ActiveBody
    {
        private DateTime _startMove = DateTime.MinValue;
        public  Guid OwnerId { get; private set; }

        public Point StartPosition { get; private set; }
        public int ShootingDistance { get; private set; }
        public int Damage { get; private set;}

        public Bullet(
            int shootingDistance,
            int speed,
            int damage,
            Shape shape, 
			Vector direction,
            Guid ownerId,
			IMechanicEngine mechanicEngine):base(shape, direction, mechanicEngine,1,1,0, speed)
        {
            ShootingDistance = shootingDistance;
            Damage = damage;
            OwnerId = ownerId;
            
            //calculate position
            Shape.Position = Direction.MovePoint(Shape.Position, Shape.MaxDimension);
            StartPosition = Shape.Position;
        }

        public override void UpdateState()
        {
            if(_startMove == DateTime.MinValue)
            {
                _startMove = DateTime.Now;
            }
            else
            {
                var duration = DateTime.Now - _startMove;

                if (duration.TotalMilliseconds > 10)
                {
                    _mechanicEngine.AddCommand(new GameCommandMove(this.Direction, _mechanicEngine, this, duration));

                    _startMove = DateTime.Now;
                }
            }

            base.UpdateState();
        }
    }
}
