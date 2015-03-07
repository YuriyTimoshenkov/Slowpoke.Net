using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace SlowpokeEngine.Commons
{
    public class IndexList<TKey, TValue> : IEnumerable<TValue> where TValue : class
    {
        private readonly ConcurrentDictionary<TKey, TValue> _dict = new ConcurrentDictionary<TKey, TValue>();

        public ConcurrentDictionary<TKey, TValue> Dict
        {
            get { return _dict; }
        }

        public TValue this[TKey key]
        {
            get { return Get(key); }
            set { AddOrUpdate(key, value); }
        }

        public IEnumerator<TValue> GetEnumerator()
        {
            return Dict.Values.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public TValue Get(TKey id)
        {
            TValue queue;
            return Dict.TryGetValue(id, out queue)
                       ? queue
                       : null;
        }

        public TValue Do(TKey id, Action<TValue> action)
        {
            var item = Get(id);
            if (item == null)
                return null;

            action.Invoke(item);
            return item;
        }


        public TValue AddOrUpdate(TKey key, TValue value)
        {
            return Dict.AddOrUpdate(key, value, (id, u) => value);
        }

        public TValue Add(TKey key, TValue value)
        {
            return AddOrUpdate(key, value);
        }

        public TValue AddOrMerge(TKey key, TValue value)
        {
            return Dict.AddOrUpdate(key, value, (a, d) => d.Merge(value));
        }

        public TValue Remove(TKey key)
        {
            TValue result;
            return Dict.TryRemove(key, out result)
                       ? result
                       : null;
        }

        public void Clear()
        {
            Dict.Clear();
        }

        public int Count
        {
            get { return Dict.Count; }
        }
    }
}
