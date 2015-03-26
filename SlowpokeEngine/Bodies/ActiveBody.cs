using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Extensions;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
	public abstract class ActiveBody : Body
	{
		protected readonly IMechanicEngine _mechanicEngine;

		public Guid Id { get; set; }

		public Vector Direction { get; set; }

        public string ActiveBodyType { get { return this.GetType().Name; } }

        public int Life { get; private set; }
        
        public int LifeMax { get; private set; }


		public ActiveBody(
			Shape shape, 
			Vector direction,
			IMechanicEngine mechanicEngine,
            int life, int lifeMax)
		{
			Id = Guid.NewGuid();
			_mechanicEngine = mechanicEngine;
			Shape = shape;
			Direction = direction;
            Life = life;
            LifeMax = lifeMax;
		}

        public virtual void Run() { }
        public virtual void ReleaseGame() { }
        public virtual void Harm(int damage)
        {
            Life -= damage;
        }
	}
}
