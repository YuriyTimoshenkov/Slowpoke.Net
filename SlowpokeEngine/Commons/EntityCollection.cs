using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace SlowpokeEngine.Commons
{
    public class EntityCollection<TKey, TValue> : IndexList<TKey, TValue> where TValue : class
    {
        private readonly PropertyInfo _keyProperty;

        public EntityCollection(string keyPropertyName)
        {
            _keyProperty = MainExtensions.GetProperties(typeof (TValue))
                                         .FirstOrDefault(n => n.Name == keyPropertyName);

            if (_keyProperty == null)
                throw new NullReferenceException("Key property is null");
        }

        private TKey GetKey(TValue value)
        {
            return (TKey) _keyProperty.GetValue(value);
        }

        public TValue Get(TValue item)
        {
            return item == null
                       ? null
                       : Get(GetKey(item));
        }

        public TValue AddOrUpdate(TValue item)
        {
            return item == null
                       ? null
                       : AddOrUpdate(GetKey(item), item);
        }

        public TValue AddOrMerge(TValue item)
        {
            return item == null
                       ? null
                       : AddOrMerge(GetKey(item), item);
        }

        public TValue Add(TValue queue)
        {
            return AddOrUpdate(queue);
        }

        public void AddRange(IEnumerable<TValue> items)
        {
            if (items == null)
                return;

            foreach (var item in items)
                Add(item);
        }

        public TValue Remove(TValue item)
        {
            if (item == null)
                return null;

            TValue result;
            return Dict.TryRemove(GetKey(item), out result)
                       ? result
                       : null;
        }
    }
}