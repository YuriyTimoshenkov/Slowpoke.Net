using Microsoft.Practices.Unity;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Bodies
{
    public class LifeContainer : PassiveBody, IUsableBody
    {
        private int _lifeContent;

        public LifeContainer(Shape shape, int lifeContent)
            : base(shape)
        {
            _lifeContent = lifeContent;
        }
        public bool Use(ActiveBody consumerBody)
        {
            consumerBody.Heal(_lifeContent);

            _lifeContent = 0;

            return true;
        }
    }
}
