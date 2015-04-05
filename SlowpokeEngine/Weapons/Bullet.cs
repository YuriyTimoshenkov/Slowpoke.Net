using SlowpokeEngine.Actions;
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
        public Point StartPosition { get; private set; }
        public int ShootingDistance { get; private set; }
        private TimeSpan _speed;
        private DateTime _lastMove = DateTime.Now;
        public int Damage { get; private set;}

        public Bullet(
            int shootingDistance,
            int speed,
            int damage,
            Shape shape, 
			Vector direction,
			IMechanicEngine mechanicEngine):base(shape, direction, mechanicEngine,1,1)
        {
            ShootingDistance = shootingDistance;
            _speed = new TimeSpan(0, 0, 0, 0, speed);
            Damage = damage;
            
            //calculate position
            Shape.Position = Direction.MovePoint(Shape.Position, Shape.MaxDimension);
            StartPosition = Shape.Position;
        }

        public override void UpdateState()
        {
            if (DateTime.Now - _lastMove > _speed)
            {
                _mechanicEngine.AddCommand(new GameCommandMove(this.Direction, _mechanicEngine, this));
                _lastMove = DateTime.Now;
            }

            base.UpdateState();
        }
    }
}
