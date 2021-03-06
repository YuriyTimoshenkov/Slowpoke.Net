﻿using System;
using System.ComponentModel;
using System.Globalization;

namespace SlowpokeEngine.Entities
{
	[Serializable]
	public struct Vector
	{
		[Browsable(false)]
		public bool IsZero
		{
			get { return X == 0 && Y == 0; }
		}

        public double X
        {
			get;
			set;
		}

        public double Y
        {
			get;
			set;
		}

        public Vector(double x, double y)
            : this()
		{
			X = x;
			Y = y;
		}

        public Point MovePoint(Point point, double distance)
        {
            var unitVector = Vector.CalculateUnitVector(this);

            return new Point(point.X + unitVector.X * distance, point.Y + unitVector.Y * distance);
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

        public static Vector Subtract(Point pt, Point sz)
        {
            return new Vector(pt.X - sz.X, pt.Y - sz.Y);
        } 

        public static Vector CalculateUnitVector(Vector vector)
        {
            //Calculate scalar direction vector
            var magnitute = Math.Sqrt(Math.Pow(vector.X, 2) + Math.Pow(vector.Y, 2));
            return new Vector(
                vector.X / magnitute,
                vector.Y / magnitute);
        }

		public override bool Equals(object obj)
		{
			if (!(obj is Vector)) return false;
			var comp = (Vector) obj;
			return comp.X == X && comp.Y == Y;
		}

        public override int GetHashCode()
		{
            return X.GetHashCode() ^ Y.GetHashCode();
		}

        public void Offset(double dx, double dy)
		{
			X += dx;
			Y += dy;
		}

		public void Offset(Vector p)
		{
			Offset(p.X, p.Y);
		}

        public static implicit operator double[](Vector p)
		{
			return new[] {p.X, p.Y};
		}

        public static implicit operator Vector(double[] array)
		{
			if(array == null)
				return new Vector(0,0);

			return array.Length < 2
				? new Vector(0, 0)
					: new Vector(array[0], array[1]);
		}

        public static implicit operator Vector(Tuple<double, double> tuple)
		{
			return tuple == null
				? new Vector(0,0)
					: new Vector(tuple.Item1, tuple.Item2);
		}

        public static implicit operator Tuple<double, double>(Vector p)
		{
            return new Tuple<double, double>(p.X, p.Y);
		}


		#endregion Static 

		public override string ToString()
		{
			return "{X=" + X.ToString(CultureInfo.CurrentCulture) + ", Y=" + Y.ToString(CultureInfo.CurrentCulture) + "}";
		}

	}
}

