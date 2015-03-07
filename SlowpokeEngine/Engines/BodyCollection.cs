using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Commons;

namespace SlowpokeEngine.Engines
{
    public class BodyCollection : EntityCollection<Guid, ActiveBody>
    {
        public BodyCollection() : base("Id")
        {}
    }
}