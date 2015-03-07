using System;
using System.ComponentModel;
using System.Globalization;

namespace SlowpokeEngine.Entities
{
    [Serializable]
    public struct Point
    {
        public Point(int x, int y) : this()
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
            return string.Format(CultureInfo.CurrentCulture, "{{X={0}, Y={1}}}", X, Y);
        }

        #region Static

        public static readonly Point Empty = new Point();

        public static bool operator ==(Point left, Point right)
        {
            return left.X == right.X && left.Y == right.Y;
        }

        public static bool operator !=(Point left, Point right)
        {
            return !(left == right);
        }

        public static Point operator +(Point pt, Point sz)
        {
            return Add(pt, sz);
        }

        public static Point Add(Point pt, Point sz)
        {
            return new Point(pt.X + sz.X, pt.Y + sz.Y);
        }

        public static Point operator -(Point pt, Point sz)
        {
            return Subtract(pt, sz);
        }

        public static Point Subtract(Point pt, Point sz)
        {
            return new Point(pt.X - sz.X, pt.Y - sz.Y);
        }

        public override bool Equals(object obj)
        {
            if (!(obj is Point))
                return false;
            var comp = (Point) obj;
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

        public void Offset(Point p)
        {
            Offset(p.X, p.Y);
        }

        public static implicit operator int[](Point p)
        {
            return new[] {p.X, p.Y};
        }

        public static implicit operator Point(int[] array)
        {
            if (array == null)
                return new Point(0, 0);

            return array.Length < 2
                       ? new Point(0, 0)
                       : new Point(array[0], array[1]);
        }

        public static implicit operator Point(Tuple<int, int> tuple)
        {
            return tuple == null
                       ? new Point(0, 0)
                       : new Point(tuple.Item1, tuple.Item2);
        }

        public static implicit operator Tuple<int, int>(Point p)
        {
            return new Tuple<int, int>(p.X, p.Y);
        }

        #endregion Static 
    }
}