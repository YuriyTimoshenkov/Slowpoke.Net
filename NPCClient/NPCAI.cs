using System;
using System.Threading;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using System.Linq;
using SlowpokeEngine;
using SlowpokeHubs;

namespace NPCClient
{
	public class NPCAI 
	{
        private DateTime _startMove = DateTime.MinValue;
        private IClientMechanicEngine _mechanicEngine;
        private Vector _direction;
        public Guid CharacterId { get; set; }
        public Guid PlayerId { get; set; }
        private Point _position;

        public NPCAI(IClientMechanicEngine mechanicEngine, Vector direction, Guid playerId)
        {
            PlayerId = playerId;
            _mechanicEngine = mechanicEngine;
            _direction = direction;
        }

        public void UpdateState()
        {
            var frame = _mechanicEngine.ViewPort.GetFrame(CharacterId, null);

            //Update position
            var mySelf = frame.Bodies.FirstOrDefault(v => v.Id == CharacterId);

            if (mySelf == null) return;

            _position = mySelf.Shape.Position;
            _direction = mySelf.Direction;

            BodyFacade enemy = null;
            double minDistance = -1;

            var newDirection = new Vector();

            //Find enemy
            foreach (var body in frame.Bodies.Where(v => v.Id != CharacterId))
            {
                // Only PlayerBodies can be enemies
                if (isEnemy(body))
                {
                    var _newDirection = Vector.CalculateUnitVector(Vector.Subtract(body.Shape.Position, _position));
                    double distance = calculateDistance(_newDirection);
                    if (distance < minDistance || minDistance == -1)
                    {
                        enemy = body;
                        minDistance = distance;
                        newDirection = _newDirection;
                    }

                    Console.WriteLine(string.Format("NPC {0}, enemy {1} found.", CharacterId, enemy.Id));
                }
            }

            if (enemy != null)
            {
                if (_direction != newDirection)
                {
                    _mechanicEngine.ChangeDirection(newDirection, PlayerId);
                }

                _mechanicEngine.Shoot(PlayerId);

                Console.WriteLine(string.Format("NPC {0}, shooting.", CharacterId));

                //Run to enemy
                if (_startMove == DateTime.MinValue)
                {
                    _startMove = DateTime.Now;
                }
                else
                {
                    var duration = DateTime.Now - _startMove;

                    if (duration.TotalMilliseconds > 10)
                    {
                        _mechanicEngine.Move(newDirection, PlayerId, duration);

                        Console.WriteLine(string.Format("NPC {0}, moving.", CharacterId));

                        _startMove = DateTime.Now;
                    }
                }
            }
            else
                _startMove = DateTime.MinValue;
        }

        private bool isEnemy(BodyFacade body)
        {
            return body.BodyType == "PlayerBody";
        }

        private double calculateDistance(Vector newVector)
        {
            return Math.Sqrt(Math.Pow(newVector.X, 2) + Math.Pow(newVector.Y, 2));
        }        
	}
}

