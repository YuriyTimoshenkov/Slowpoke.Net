using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
namespace SlowpokeEngine.Actions
{
	public class GameCommandMakeDamage : GameCommand
	{
        public int Damage { get; set; }

        public GameCommandMakeDamage(long id, 
            IMechanicEngine mechanicEngine, 
            ActiveBody activeBody,
            int damage) :
            base(mechanicEngine, activeBody) 
        {
            Id = id;
            Damage = damage;
        }
	}
}

