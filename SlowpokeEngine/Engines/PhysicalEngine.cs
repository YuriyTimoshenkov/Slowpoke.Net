using System;
using System.Collections.Generic;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Engines
{
	public class PhysicalEngine : IPhysicalEngine
	{
		private readonly Dictionary<Type, Func<BodyAction,ActiveBody, PhysicsProcessingResult>> _actionHandlers = new Dictionary<Type, Func<BodyAction, ActiveBody, PhysicsProcessingResult>> ();

		public PhysicalEngine ()
		{
			_actionHandlers.Add (typeof(BodyActionMove), ProcessBodyActionMove);
			_actionHandlers.Add (typeof(BodyActionChangeDirection), ProcessBodyActionChangeDirection);
		}

		public PhysicsProcessingResult ProcessBodyAction(BodyAction action, ActiveBody body)
		{
			Func<BodyAction,ActiveBody, PhysicsProcessingResult> handler;
			if (_actionHandlers.TryGetValue (action.GetType (), out handler)) {
				return handler (action, body);
			}

			throw new Exception ("No ProcessBodyAction handlers found");
		}

		private PhysicsProcessingResult ProcessBodyActionMove(BodyAction action, ActiveBody body)
		{
			//Calculate collision
			body.Position = new Point (
				body.Position.X + body.Direction.X,
				body.Position.Y + body.Direction.Y);
			

			return new PhysicsProcessingResult
			{
				ResultType = PhysicsProcessingResultType.Ok
			};
		}

	    private PhysicsProcessingResult ProcessBodyActionChangeDirection(BodyAction action, ActiveBody body)
		{
			var directionChanges = (BodyActionChangeDirection)action;

			body.Direction = new Vector (
				body.Direction.X + directionChanges.Dx,
				body.Direction.Y + directionChanges.Dy);

			return new PhysicsProcessingResult
			{
				ResultType = PhysicsProcessingResultType.Ok
			};
		}
	}
}

