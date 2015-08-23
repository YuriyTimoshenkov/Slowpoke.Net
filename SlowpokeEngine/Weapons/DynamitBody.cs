using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Weapons
{
    public class DynamitBody : ActiveBody
    {
        private int _damage;
        private DateTime _startMove = DateTime.MinValue;
        private int _dynamiteDetonationTime;
        private DateTime _detonationStartCountTime;
        private int _bangRadius;

        public DynamitBody(
            Shape shape,
            Vector direction, 
            IMechanicEngine mechanicEngine,
            int damage,
            int speed,
            int dynamiteDetonationTime,
            int bangRadius,
            Guid ownerId
        )
            :base(shape, direction, mechanicEngine, 0, 0, speed)
        {
            _damage = damage;
            _dynamiteDetonationTime = dynamiteDetonationTime;
            _bangRadius = bangRadius;
            ((ShapeCircle)Shape).Radius = _bangRadius;
            OwnerId = ownerId;
        }

        public override void UpdateState()
        {
            if (_startMove == DateTime.MinValue)
            {
                _detonationStartCountTime = _startMove = DateTime.Now;
            }
            else
            {
                if ((DateTime.Now - _detonationStartCountTime).TotalMilliseconds > _dynamiteDetonationTime)
                {
                    ((ShapeCircle)Shape).Radius = _bangRadius;
                    //Make damage
                    _mechanicEngine.AddCommand(new GameCommandMakeDamage(0, _mechanicEngine, this, _damage));
                }
                else
                {

                    var duration = DateTime.Now - _startMove;

                    if (duration.TotalMilliseconds > 10)
                    {
                        _mechanicEngine.AddCommand(new GameCommandMove(0, this.Direction, _mechanicEngine, this, duration));

                        _startMove = DateTime.Now;
                    }
                }
            }

            base.UpdateState();
        }
    }
}
