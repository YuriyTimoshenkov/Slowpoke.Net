using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public interface IPhysicalEngine
	{
        /// <summary>
        /// Почему не оставить просто Process а когда появится ещё метод уже думать над конкретикой?
        /// </summary>
        /// <param name="action"></param>
        /// <param name="body"></param>
        /// <returns></returns>
		PhysicsProcessingResult ProcessBodyAction (BodyAction action, ActiveBody body);
	}
}

