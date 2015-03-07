using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Actions
{
    public class BodyActionChangeDirection : BodyAction
    {
        public BodyActionChangeDirection(int dx, int dy)
        {
            Dx = dx;
            Dy = dy;
        }

        public BodyActionChangeDirection(int dX, int dY, ActiveBody body) : base(body)
        {
            Dx = dX;
            Dy = dY;
        }

        public int Dx { get; private set; }
        public int Dy { get; private set; }
    }
}