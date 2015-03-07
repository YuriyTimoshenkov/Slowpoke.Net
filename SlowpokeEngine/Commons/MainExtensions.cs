using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace SlowpokeEngine.Commons
{
    public static class MainExtensions
    {
        private static readonly ConcurrentDictionary<Type, List<PropertyInfo>> _propertyDictionary =
            new ConcurrentDictionary<Type, List<PropertyInfo>>();

        public static IEnumerable<PropertyInfo> GetProperties(Type type)
        {
            List<PropertyInfo> properties;
            if (_propertyDictionary.TryGetValue(type, out properties))
                return properties;

            properties = type.GetProperties().ToList();
            _propertyDictionary.TryAdd(type, properties);

            return properties;
        }

        public static bool In<T>(this T source, params T[] list)
        {
            return source != null && list.Contains(source);
        }

        public static bool NotIn<T>(this T source, params T[] list)
        {
            return (source != null && list.Contains(source)) == false;
        }

        public static bool Between<T>(this T actual, T lower, T upper) where T : IComparable<T>
        {
            return actual.CompareTo(lower) >= 0 && actual.CompareTo(upper) < 0;
        }

        public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            foreach (var element in source)
            {
                action(element);
            }
        }

        public static bool EqualsAll<T>(this IList<T> list)
        {
            if (list == null || list.Count < 2)
                return true;

            var first = list[0];
            for (var i = 1; i < list.Count; i++)
            {
                if (!first.Equals(list[i]))
                    return false;
            }
            return true;
        }

        public static bool EqualsAll<T>(params T[] list)
        {
            if (list == null || list.Length < 2)
                return true;

            var first = list[0];
            for (var i = 1; i < list.Length; i++)
            {
                if (!first.Equals(list[i]))
                    return false;
            }
            return true;
        }

        public static decimal GetMedian(this IEnumerable<int> source)
        {
            if (source == null)
                return 0;

            var temp = source.ToArray();
            Array.Sort(temp);

            if (temp.Length == 0)
                return 0;

            if (temp.Length%2 == 0)
                return (temp[temp.Length/2 - 1] + temp[temp.Length/2])/2m;
            return temp[temp.Length/2];
        }

        public static T Merge<T>(this T source, T newValue) where T : class
        {
            if (source == null)
                return null;

            if (newValue == null)
                return source;

            foreach (var info in GetProperties(source.GetType()))
            {
                if (info.CanWrite)
                    info.SetValue(source, info.GetValue(newValue));
            }
            return source;
        }

        public static T CloneR<T>(this T source) where T : class
        {
            if (source == null)
                return default(T);

            var result = Activator.CreateInstance<T>();

            foreach (var info in typeof (T).GetProperties())
            {
                info.SetValue(result, info.GetValue(source));
            }

            return result;
        }
    }
}