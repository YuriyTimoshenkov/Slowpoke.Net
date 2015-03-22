using System;
using System.Collections.Generic;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using SlowpokeEngine.Extensions;

namespace SlowpokeEngine.Engines
{
	public class PhysicalEngine : IPhysicalEngine
	{
        ActionHandlersManager<Func<GameCommand, bool>, Func<GameCommand, PhysicsProcessingResult>> _commandHandlers =
            new ActionHandlersManager<Func<GameCommand, bool>, Func<GameCommand, PhysicsProcessingResult>>();

        IShapeCollisionManager _shapeCollisionManager;
        IMapEngine _mapEngine;

        public PhysicalEngine(IShapeCollisionManager shapeCollisionManager, IMapEngine mapEngine)
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
                    return new PhysicsProcessingResultCollision(new List<Body>() {new PassiveBody()});
                });

            _commandHandlers.AddHandler((command) =>
                {
                    return command is GameCommandMove;
                },
                (command) =>
                {
                    var body = command.ActiveBody;
                    var moveCommand = (GameCommandMove)command;

                    var moveUnitVector = Vector.CalculateUnitVector(moveCommand.Direction);

                    body.Shape.Position = new Point(
                    body.Shape.Position.X + moveUnitVector.X,
                    body.Shape.Position.Y + moveUnitVector.Y);


                    //get all bodies for collision checking
                    List<Body> collisionBodies = new List<Body>();

                    foreach(var bodyItem in _mapEngine.GetBodiesForCollision())
                    {
                        if(_shapeCollisionManager.CheckCollision(body.Shape, bodyItem.Shape))
                        {
                            collisionBodies.Add(bodyItem);
                        }
                    }

                    if (collisionBodies.Count > 0)
                    {
                        return new PhysicsProcessingResultCollision(collisionBodies);
                    }
                    else
                    {
                        return new PhysicsProcessingResultEmpty();
                    }
                });

            _commandHandlers.AddHandler((command) =>
                    {
                        return command is GameCommandChangeDirection;
                    },
                    (command) =>
                    {
                        var directionChanges = (GameCommandChangeDirection)command;
                        var body = command.ActiveBody;

                        body.Direction = Vector.CalculateUnitVector(directionChanges.Direction);

                        return new PhysicsProcessingResultEmpty();
                    });
        }
	}
}

