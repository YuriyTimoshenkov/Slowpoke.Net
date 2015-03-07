using System;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
    public abstract class ActiveBody
    {
        protected readonly IMechanicEngine _mechanicEngine;

        protected ActiveBody(
            Point position,
            Vector direction,
            IMechanicEngine mechanicEngine)
        {
            Id = Guid.NewGuid();
            _mechanicEngine = mechanicEngine;
            Position = position;
            Direction = direction;
        }

        public Guid Id { get; private set; }
        public Vector Direction { get; set; }
        public Point Position { get; set; }

        public virtual void ReleaseGame()
        {}
    }
}