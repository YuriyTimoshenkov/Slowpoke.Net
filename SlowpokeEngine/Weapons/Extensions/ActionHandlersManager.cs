using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Extensions
{
    public class ActionHandlersManager<T1, T2> : IEnumerable<Tuple<T1, T2>>
    {
        public List<Tuple<T1, T2>> Handlers { get; private set; }

        public ActionHandlersManager()
        {
            Handlers = new List<Tuple<T1, T2>>();
        }

        public void AddHandler(T1 selector,T2 function)
        {
            Handlers.Add(new Tuple<T1, T2>(selector, function));
        }

        public void AddHandler(Tuple<T1, T2> handler)
        {
            Handlers.Add(handler);
        }

        public IEnumerator<Tuple<T1, T2>> GetEnumerator()
        {
            return Handlers.GetEnumerator();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return Handlers.GetEnumerator();
        }
    }
}
