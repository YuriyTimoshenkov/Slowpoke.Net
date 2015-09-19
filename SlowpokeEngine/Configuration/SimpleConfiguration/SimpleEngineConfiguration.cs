using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public class SimpleEngineConfiguration : IEngineConfiguration
    {
        public ICharacterConfiguration NPC { get; set; }
        public ICharacterConfiguration Player { get; set; }
        public ILifeContainerConfiguration LifeContainer { get; set; }
        public IEntityGenerationServiceConfiguration NPCGenerationService { get; set; }
        public IEntityGenerationServiceConfiguration BoxesGenerationService { get; set; }
        public IWeaponSimpleBulletConfiguration Revolver { get; set; }
        public IWeaponSimpleBulletConfiguration Gun { get; set; }
        public IWeaponSimpleBulletConfiguration ShortGun { get; set; }
        public IDynamitConfiguration Dynamit { get; set; }
    }
}
