﻿using System;
using System.ComponentModel;
using System.Globalization;

namespace SlowpokeEngine.Entities
{
    [Serializable]
    public struct Vector
    {
        public Vector(int x, int y) : this()
        {
            X = x;
            Y = y;
        }

        [Browsable(false)]
        public bool IsZero
        {
            get { return X == 0 && Y == 0; }
        }

        public int X { get; set; }
        public int Y { get; set; }

        public override string ToString()
        {
            return string.Format(CultureInfo.CurrentCulture,
                "{{X={0}, Y={1}}}", X, Y);
        }

        #region Static

        public static readonly Vector Empty = new Vector();

        public static bool operator ==(Vector left, Vector right)
        {
            return left.X == right.X && left.Y == right.Y;
        }

        public static bool operator !=(Vector left, Vector right)
        {
            return !(left == right);
        }

        public static Vector operator +(Vector pt, Vector sz)
        {
            return Add(pt, sz);
        }

        public static Vector Add(Vector pt, Vector sz)
        {
            return new Vector(pt.X + sz.X, pt.Y + sz.Y);
        }

        public static Vector operator -(Vector pt, Vector sz)
        {
            return Subtract(pt, sz);
        }

        public static Vector Subtract(Vector pt, Vector sz)
        {
            return new Vector(pt.X - sz.X, pt.Y - sz.Y);
        }

        public override bool Equals(object obj)
        {
            if (!(obj is Vector))
                return false;

            var comp = (Vector) obj;
            return comp.X == X && comp.Y == Y;
        }

        public override int GetHashCode()
        {
            return X ^ Y;
        }

        public void Offset(int dx, int dy)
        {
            X += dx;
            Y += dy;
        }

        public void Offset(Vector p)
        {
            Offset(p.X, p.Y);
        }

        public static implicit operator int[](Vector p)
        {
            return new[] {p.X, p.Y};
        }

        public static implicit operator Vector(int[] array)
        {
            if (array == null)
                return new Vector(0, 0);

            return array.Length < 2
                       ? new Vector(0, 0)
                       : new Vector(array[0], array[1]);
        }

        public static implicit operator Vector(Tuple<int, int> tuple)
        {
            return tuple == null
                       ? new Vector(0, 0)
                       : new Vector(tuple.Item1, tuple.Item2);
        }

        public static implicit operator Tuple<int, int>(Vector p)
        {
            return new Tuple<int, int>(p.X, p.Y);
        }

        #endregion Static 
    }
}