using System;
using System.Collections.Concurrent;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Engines
{
    public class PhysicalEngine : IPhysicalEngine
    {
        public delegate PhysicsProcessingResult ProcessActionHandler(BodyAction action);

        private readonly ConcurrentDictionary<Type, ProcessActionHandler> _actionHandlers
            = new ConcurrentDictionary<Type, ProcessActionHandler>();

        public PhysicalEngine()
        {
            AddHandler<BodyActionMove>(Move);
            AddHandler<BodyActionChangeDirection>(ChangeDirection);
        }

        public PhysicsProcessingResult ProcessBodyAction(BodyAction action)
        {
            ProcessActionHandler handler;
            if (_actionHandlers.TryGetValue(action.GetType(), out handler))
                return handler(action);

            throw new Exception("No ProcessBodyAction handlers found");
        }

        private void AddHandler<T>(ProcessActionHandler handler)
        {
            _actionHandlers.TryAdd(typeof (T), handler);
        }
        
        #region Handlers

        private static PhysicsProcessingResult Move(BodyAction action)
        {
            CalculateCollision(action.Body);
            return PhysicsProcessingResult.Ok;
        }

        private static void CalculateCollision(ActiveBody body)
        {
            body.Position = new Point(body.Position.X + body.Direction.X,
                                      body.Position.Y + body.Direction.Y);
        }

        private static PhysicsProcessingResult ChangeDirection(BodyAction action)
        {
            var directionChanges = (BodyActionChangeDirection) action;

            action.Body.Direction = new Vector(
                action.Body.Direction.X + directionChanges.Dx,
                action.Body.Direction.Y + directionChanges.Dy);

            return PhysicsProcessingResult.Ok;
        }

        #endregion
    }
}