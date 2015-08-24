using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Extensions;
using SlowpokeEngine.Entities;
using System.Collections.Generic;
using SlowpokeEngine.Weapons;

namespace SlowpokeEngine.Bodies
{
	public abstract class ActiveBody : Body
	{
		protected readonly IMechanicEngine _mechanicEngine;

		public Vector Direction { get; set; }

        public int Life { get; private set; }
        
        public int LifeMax { get; private set; }

        public BodyState State { get; private set; }

        private IUsableBody _usableBodyInScope;
        private Point _lastUsableBodyActivePosition;
        public IUsableBody UsableBodyInScope
        {
            get { return _usableBodyInScope; }
            set
            {
                _usableBodyInScope = value;
                _lastUsableBodyActivePosition = new Point(this.Shape.Position.X, this.Shape.Position.Y);
            }
        }

        //Points per second
        public int Speed { get; private set; }

        public long LastProcessedCommandId { get; set; }
        public long CreatedByCommandId { get; set; }
        public Guid OwnerId { get; protected set; }

		public ActiveBody(
			Shape shape, 
			Vector direction,
			IMechanicEngine mechanicEngine,
            int life, int lifeMax,
            int speed)
            : base(Guid.NewGuid(), shape)
		{
			_mechanicEngine = mechanicEngine;
			Shape = shape;
			Direction = direction;
            Life = life;
            LifeMax = lifeMax;
            State = BodyState.Alive;
            Speed = speed;
		}

        public virtual void Run() { }
        public virtual void UpdateState() 
        {
            //Free usable body if it is no longer available
            if (UsableBodyInScope != null && _lastUsableBodyActivePosition != this.Shape.Position)
            {
                _usableBodyInScope = null;
            }
        }
        public virtual void ReleaseGame() 
        {
            State = BodyState.Dead;
        }
        public virtual void Harm(int damage)
        {
            Life -= damage;
        }

        

        public void Heal(int healingPoints)
        {
            Life = Life + healingPoints <= LifeMax ? Life + healingPoints : LifeMax;

            if(Life > 0)
            {
                State = BodyState.Alive;
            }
        }
        public void Use()
        {
            if (UsableBodyInScope != null)
            {
                UsableBodyInScope.Use(this);
                _mechanicEngine.ReleaseBody(UsableBodyInScope.Id);
            }
        }
	}
}
