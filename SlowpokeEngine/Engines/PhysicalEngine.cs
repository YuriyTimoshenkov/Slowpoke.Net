using System;
using System.Collections.Generic;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public class PhysicalEngine
	{
		private readonly Dictionary<Type, Func<Action,ActiveBody, PhysicsProcessingResult>> _actionHandlers = new Dictionary<Type, Func<Action, ActiveBody, PhysicsProcessingResult>> ();

		public PhysicalEngine ()
		{
			_actionHandlers.Add (typeof(ActionMove), ProcessBodyActionMove);
		}

		public PhysicsProcessingResult ProcessBodyAction(Action action, ActiveBody body)
		{
			Func<Action,ActiveBody, PhysicsProcessingResult> handler;
			if (_actionHandlers.TryGetValue (action.GetType (), out handler)) {
				return handler (action, body);
			}

			throw new Exception ("No ProcessBodyAction handlers found");
		}

		private PhysicsProcessingResult ProcessBodyActionMove(Action action, ActiveBody body)
		{
			var moveAction = (ActionMove)action; 

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

