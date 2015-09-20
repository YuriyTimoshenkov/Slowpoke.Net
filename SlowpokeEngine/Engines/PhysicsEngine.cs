using System;
using System.Collections.Generic;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using SlowpokeEngine.Extensions;
using System.Linq;
using SlowpokeEngine.Engines.Map;

namespace SlowpokeEngine.Engines
{
	public class PhysicsEngine : IPhysicsEngine
	{
        ActionHandlersManager<Func<GameCommand, bool>, Func<GameCommand, PhysicsProcessingResult>> _commandHandlers =
            new ActionHandlersManager<Func<GameCommand, bool>, Func<GameCommand, PhysicsProcessingResult>>();

        IShapeCollisionManager _shapeCollisionManager;
        IMapEngine _mapEngine;

        public PhysicsEngine(IShapeCollisionManager shapeCollisionManager, IMapEngine mapEngine)
		{
            _shapeCollisionManager = shapeCollisionManager;
            _mapEngine = mapEngine;

            BuildHandlers();
		}

		public PhysicsProcessingResult ProcessBodyAction(GameCommand command)
		{
            foreach(var handler in _commandHandlers)
            {
                if (handler.Item1(command))
                    return handler.Item2(command);
            }

            return new PhysicsProcessingResultEmpty();
		}

        private void BuildHandlers()
        {
            //Bullet and ground collision
            _commandHandlers.AddHandler((command) =>
                {
                    if (!(command.ActiveBody is Bullet && command is GameCommandMove))
                        return false;

                    var bullet = (Bullet)command.ActiveBody;
                    var distance = Math.Sqrt((Math.Pow(bullet.StartPosition.X - bullet.Shape.Position.X, 2) +
                    Math.Pow(bullet.StartPosition.Y - bullet.Shape.Position.Y, 2)));

                    return distance >= bullet.ShootingDistance;
                },
                (command) =>
                {
                    return new PhysicsProcessingResultCollision(new List<Body>() {new PassiveBody(null)});
                });

            //Body move
            _commandHandlers.AddHandler((command) =>
                {
                    return command is GameCommandMove;
                },
                (command) =>
                {
                    var body = command.ActiveBody;
                    var moveCommand = (GameCommandMove)command;

                    var previousPosition = body.Shape.Position;
                    body.Shape.Position = moveCommand.Direction.MovePoint(body.Shape.Position, body.Speed * moveCommand.Duration.TotalMilliseconds / 1000.0);

                    //get all bodies for collision checking
                    List<Body> collisionBodies = new List<Body>();

                    foreach (var bodyItem in _mapEngine.GetBodiesForCollision(body).Where(v => v is PassiveBody || v is IUsableBody || (v is ActiveBody && ((ActiveBody)v).Id != body.Id)))
                    {
                        if(_shapeCollisionManager.CheckCollision(body.Shape, bodyItem.Shape) 
                            && !(bodyItem is Bullet || bodyItem is DynamitBody))
                        {
                            collisionBodies.Add(bodyItem);
                        }
                    }

                    if (collisionBodies.Count > 0)
                    {
                        if (collisionBodies.All(v => v is IUsableBody))
                        {
                            _mapEngine.UpdateActiveBody(body);
                        }
                        else
                        {
                            body.Shape.Position = previousPosition;
                        }

                        return new PhysicsProcessingResultCollision(collisionBodies);
                    }
                    else
                    {
                        _mapEngine.UpdateActiveBody(body);
                        return new PhysicsProcessingResultEmpty();
                    }
                });

            _commandHandlers.AddHandler((command) =>
                    {
                        return command is GameCommandChangeDirection;
                    },
                    (command) =>
                    {
                        var changeDirectionCommane = (GameCommandChangeDirection)command;
                        var body = command.ActiveBody;

                        body.Direction = Vector.CalculateUnitVector(changeDirectionCommane.Direction);

                        return new PhysicsProcessingResultEmpty();
                    });

            //Make damage
            _commandHandlers.AddHandler((command) =>
            {
                return command is GameCommandMakeDamage;
            },
            (command) =>
            {
                var body = command.ActiveBody;
                List<Body> collisionBodies = new List<Body>();

                foreach (var bodyItem in _mapEngine.GetBodiesForCollision(body).Where(v => v is PassiveBody || (v is ActiveBody && ((ActiveBody)v).Id != body.Id)))
                {
                    if (_shapeCollisionManager.CheckCollision(body.Shape, bodyItem.Shape)
                        && !(bodyItem is Bullet))
                    {
                        collisionBodies.Add(bodyItem);
                    }
                }

                return new PhysicsProcessingResultCollision(collisionBodies);
            });
        }
	}
}

