using System;
using System.Collections.Generic;

namespace SlowpokeEngine
{
	public class PhysicalEngine
	{
		private Dictionary<Type, Func<Action,ActiveBody, PhysicsProcessingResult>> ActionHandlers = new Dictionary<Type, Func<Action, ActiveBody, PhysicsProcessingResult>> ();

		public PhysicalEngine ()
		{
			ActionHandlers.Add (typeof(ActionMove), ProcessBodyActionMove);
		}

		public PhysicsProcessingResult ProcessBodyAction(Action action, ActiveBody body)
		{
			Func<Action,ActiveBody, PhysicsProcessingResult> handler;
			if (ActionHandlers.TryGetValue (action.GetType (), out handler)) {
				return handler (action, body);
			} else {
				throw new Exception ("No ProcessBodyAction handlers found");
			}
		}

		private PhysicsProcessingResult ProcessBodyActionMove(Action action, ActiveBody body)
		{
			return new PhysicsProcessingResult () { ResultType = PhysicsProcessingResultType.Ok };
		}
	}
}

