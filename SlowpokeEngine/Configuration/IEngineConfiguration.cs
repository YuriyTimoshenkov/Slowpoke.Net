using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Configuration
{
    public interface IEngineConfiguration
    {
        ICharacterConfiguration NPC { get; set; }
        ICharacterConfiguration Player { get; set; }
        ILifeContainerConfiguration LifeContainer { get; set; }
        IEntityGenerationServiceConfiguration NPCGenerationService { get; set; }
        IEntityGenerationServiceConfiguration BoxesGenerationService { get; set; }
        IWeaponSimpleBulletConfiguration Revolver { get; set; }
        IWeaponSimpleBulletConfiguration Gun { get; set; }
        IWeaponSimpleBulletConfiguration ShortGun { get; set; }
        IDynamitConfiguration Dynamit { get; set; }
    }
}
