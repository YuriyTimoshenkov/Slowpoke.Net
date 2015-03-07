using System.Collections.Generic;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Actions
{
    public abstract class BodyAction
    {
        protected BodyAction()
        {}

        protected BodyAction(ActiveBody body)
        {
            Body = body;
        }

        public Dictionary<string, object> Parameters { get; set; }
        public ActiveBody Body { get; protected set; }
    }
}