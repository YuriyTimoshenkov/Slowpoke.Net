using System;
using System.Collections.Generic;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public class PhysicalEngine : IPhysicalEngine
	{
		private readonly Dictionary<Type, Func<BodyAction,ActiveBody, PhysicsProcessingResult>> _actionHandlers = new Dictionary<Type, Func<BodyAction, ActiveBody, PhysicsProcessingResult>> ();

		public PhysicalEngine ()
		{
			_actionHandlers.Add (typeof(BodyActionMove), ProcessBodyActionMove);
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
			var moveAction = (BodyActionMove)action; 

			//Calculate collision
			body.Position = new Tuple<int, int> (
				body.Position.Item1 + body.Direction.Item1,
				body.Position.Item2 + body.Direction.Item2);
			

			return new PhysicsProcessingResult
			{
				ResultType = PhysicsProcessingResultType.Ok
			};
		}
	}
}

