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
        ActionHandlersManager<Func<GameCommand, bool>, Func<GameCommand, PhysicsProcessingResult>> _actionHandlers =
            new ActionHandlersManager<Func<GameCommand, bool>, Func<GameCommand, PhysicsProcessingResult>>();

		public PhysicalEngine ()
		{
            BuildHandlers();
		}

		public PhysicsProcessingResult ProcessBodyAction(GameCommand command)
		{
            foreach(var handler in _actionHandlers)
            {
                if (handler.Item1(command))
                    return handler.Item2(command);
            }

            return new PhysicsProcessingResultEmpty();
		}

        private void BuildHandlers()
        {
            _actionHandlers.AddHandler((command) =>
                {
                    if (!(command.ActiveBody is Bullet))
                        return false;

                    var bullet = (Bullet)command.ActiveBody;
                    var distance = Math.Sqrt((Math.Pow(bullet.StartPosition.X - bullet.Position.X, 2) +
                    Math.Pow(bullet.StartPosition.Y - bullet.Position.Y, 2)));

                    return distance >= bullet.ShootingDistance;
                },
                (command) =>
                {
                    return new PhysicsProcessingResultCollision(new List<Body>() {new PassiveBody()});
                });

            _actionHandlers.AddHandler((command) =>
                {
                    return command is GameCommandMove;
                },
                (command) =>
                {
                    var body = command.ActiveBody;
                    var moveCommand = (GameCommandMove)command;

                    var moveUnitVector = Vector.CalculateUnitVector(moveCommand.Direction);

                    body.Position = new Point(
                    body.Position.X + moveUnitVector.X,
                    body.Position.Y + moveUnitVector.Y);

                    return new PhysicsProcessingResultEmpty(); 
                });

            _actionHandlers.AddHandler((command) =>
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

