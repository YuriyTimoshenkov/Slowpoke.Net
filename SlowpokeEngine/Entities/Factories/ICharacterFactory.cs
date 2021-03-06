﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Entities.Factories
{
    public interface ICharacterFactory
    {
        GameCharacter Create(Guid ownerUserId, string  Name);
    }
}
