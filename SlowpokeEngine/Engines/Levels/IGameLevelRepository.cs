using SlowpokeEngine.Engines.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines.Levels
{
    public interface IGameLevelRepository
    {
        IGameLevel LoadLevel();
    }
}
