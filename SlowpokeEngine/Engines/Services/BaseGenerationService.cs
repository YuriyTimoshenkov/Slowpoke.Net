using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Services
{
    public abstract class BaseGenerationService : IMechanicService
    {
        protected IMechanicEngine _mechanicEngine;
        protected IBodyBuilder _bodyBuilder;
        private DateTime _lastGeneration = new DateTime();
        private readonly TimeSpan _generationStep = new TimeSpan(0,0,5);

        public BaseGenerationService(
            IMechanicEngine mechanicEngine, 
            IBodyBuilder bodyBuilder)
        {
            _mechanicEngine = mechanicEngine;
            _bodyBuilder = bodyBuilder;
        }

        public void Update()
        {
            if (DateTime.Now - _lastGeneration > _generationStep)
            {
                Generate();

                _lastGeneration = DateTime.Now;
            }
        }

        protected abstract void Generate();
    }
}
