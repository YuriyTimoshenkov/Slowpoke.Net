using System;
using System.Collections.Generic;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;

namespace SlowpokeEngine.Engines
{
	public class PhysicalEngine : IPhysicalEngine
	{
		private readonly List<Tuple<Func<GameCommand,bool>,Func<GameCommand, PhysicsProcessingResult>>> _actionHandlers =
            new List<Tuple<Func<GameCommand, bool>, Func<GameCommand, PhysicsProcessingResult>>>();

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

	    private PhysicsProcessingResult ProcessBodyActionChangeDirection(GameCommand command)
		{
			var directionChanges = (GameCommandChangeDirection)command;
            var body = command.ActiveBody;

			body.Direction = new Vector (
				body.Direction.X + directionChanges.Dx,
				body.Direction.Y + directionChanges.Dy);

            return new PhysicsProcessingResultEmpty(); 
		}

        private void BuildHandlers()
        {
            _actionHandlers.Add(new Tuple<Func<GameCommand, bool>, Func<GameCommand, PhysicsProcessingResult>>(
                new Func<GameCommand, bool>((command) =>
                {
                    if (!(command.ActiveBody is Bullet))
                        return false;

                    var bullet = (Bullet)command.ActiveBody;
                    var distance = Math.Sqrt((Math.Pow(bullet.StartPosition.X - bullet.Position.X, 2) +
                    Math.Pow(bullet.StartPosition.Y - bullet.Position.Y, 2)));

                    return distance >= bullet.ShootingDistance;
                }),
                new Func<GameCommand, PhysicsProcessingResult>((command) =>
                {
                    return new PhysicsProcessingResultCollision(new List<Body>() {new PassiveBody()});
                })));

            _actionHandlers.Add(new Tuple<Func<GameCommand, bool>, Func<GameCommand, PhysicsProcessingResult>>(
                new Func<GameCommand, bool>((command) =>
                {
                    return command is GameCommandMove;
                }),
                new Func<GameCommand, PhysicsProcessingResult>((command) =>
                {
                    var body = command.ActiveBody;

                    body.Position = new Point(
                    body.Position.X + body.Direction.X,
                    body.Position.Y + body.Direction.Y);

                    return new PhysicsProcessingResultEmpty(); 
                })));

            _actionHandlers.Add(new Tuple<Func<GameCommand, bool>, Func<GameCommand, PhysicsProcessingResult>>(
                    new Func<GameCommand, bool>((command) =>
                    {
                        return command is GameCommandChangeDirection;
                    }),
                    new Func<GameCommand, PhysicsProcessingResult>((command) =>
                    {
                        var directionChanges = (GameCommandChangeDirection)command;
                        var body = command.ActiveBody;

                        body.Direction = new Vector(
                        body.Direction.X + directionChanges.Dx,
                        body.Direction.Y + directionChanges.Dy);

                        return new PhysicsProcessingResultEmpty();
                    })));
        }
	}
}

