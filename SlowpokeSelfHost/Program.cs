using System;
using System.Runtime.InteropServices;
using SlowpokeEngine;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Extensions;


namespace SlowpokeSelfHost
{
	class MainClass
	{
		public static void Main (string[] args)
		{

			TestUsingOfPoint();

			var factory = new SlowpokeFactory ();
			var game = factory.BuildGame ();

			game.AddNPC (new NPC ());

			Console.ReadLine ();

			game.StopGame ();
		}


		/// <summary>
		/// По хорошему это все надо обернуть в UT, а не  юзать в таком кустарном методе 
		/// я не знаю Monodevelop держит MSUnit из коробки или нет. 
		/// Ниже все что коментарий должено быть названием отдельного Метода/Теста 
		/// </summary>
		public static void TestUsingOfPoint()
		{
			//New Point
			var point = new Point(42, 42);
			Print("Create new point", "{0}", point);

			var point2 = new Point(15, 15);

			//compare not equals
			if (point != point2)
			{
				Print("Not equals", "Point {0} not equals {1}", point, point2);
			}

			//subtraction
			var diifPoint = point - point2;
			Print("Subtraction", "{0} - {1} = {2}", point, point2, diifPoint);

			
			//addition
			var point3 = point2 + diifPoint;
			Print("addition", "{0} + {1} = {2}", point2, diifPoint, point3);
			
			//compare equals
			if (point == point3)
			{
				Print("Compare equals", "{0} == {1}", point, point3);
			}
			
			//Assignment and addition
			point += point2;
			
			//Implicit to array
			int[] xy = point;
			Print("Implicit to array", "X={0}, Y={1}", xy[0], xy[1]);

			//Implicit from array
			point = new[] { 12, 12 };
			Print("Implicit from array", "{0}", point);
			
			//Implicit from Tuple
			point = new Tuple<int, int>(42, 42);
			Print("Implicit from Tuple", "{0}", point);

			//Implicit to Tuple
			Tuple<int, int> tuple = point;
			Print("Implicit to Tuple", "{0}", tuple);

	
		}

		private static  void Print(string caption, string format, params object[] args)
		{
			Console.ForegroundColor = ConsoleColor.White;
			Console.WriteLine("{0}:",caption);
			Console.ResetColor();

			Console.WriteLine(format,args);
			Console.WriteLine(new string('_',Console.WindowWidth));
		}


	}
}
