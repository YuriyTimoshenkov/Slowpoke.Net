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
    class Bullet : ActiveBody
    {
        public Point StartPosition { get; private set; }
        public int ShootingDistance { get; private set; }
        private int _speed;
        private volatile Timer _timer;

        public Bullet(
            int shootingDistance,
            int speed,
            Point position, 
			Vector direction,
			IMechanicEngine mechanicEngine):base(new ShapeCircle(2,position), direction, mechanicEngine)
        {
            StartPosition = position;
            ShootingDistance = shootingDistance;
            _speed = speed;
            
            //calculate position
            Shape.Position = Direction.MovePoint(Shape.Position, Shape.MaxDimension);
        }

        public override void Run()
        {
            _timer = new Timer(Move, null, 0, _speed);
        }

        private void Move(object state)
        {
            _mechanicEngine.ProcessGameCommand(new GameCommandMove(this.Direction, _mechanicEngine, this));
        }

        public override void ReleaseGame()
        {
            _timer.Change(Timeout.Infinite, Timeout.Infinite);
        }
    }
}
