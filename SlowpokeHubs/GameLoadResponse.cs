using SlowpokeEngine.Configuration;
using SlowpokeEngine.Engines.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeHubs
{
    public class GameLoadResponse
    {
        public BodyFacade Player { get; set; }
        public IMap Map { get; set; }
        public IEngineConfiguration Configuration { get; set; }
    }
}
