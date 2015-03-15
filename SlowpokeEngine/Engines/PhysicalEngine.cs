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

                    //Calculate scalar direction vector
                    var magnitute = Math.Sqrt(Math.Pow(moveCommand.Direction.X, 2) + Math.Pow(moveCommand.Direction.Y, 2));
                    var unitDirectionVector = new Vector(
                        (int)Math.Round(moveCommand.Direction.X / magnitute),
                        (int)Math.Round(moveCommand.Direction.Y / magnitute));
                   

                    body.Position = new Point(
                    body.Position.X + unitDirectionVector.X,
                    body.Position.Y + unitDirectionVector.Y);

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

                        body.Direction = new Vector(
                        body.Direction.X + directionChanges.Dx,
                        body.Direction.Y + directionChanges.Dy);

                        return new PhysicsProcessingResultEmpty();
                    });
        }
	}
}

