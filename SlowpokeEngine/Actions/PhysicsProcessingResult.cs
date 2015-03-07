namespace SlowpokeEngine.Actions
{
    public class PhysicsProcessingResult
    {
        public PhysicsProcessingResultType ResultType { get; set; }

        public static PhysicsProcessingResult Ok
        {
            get { return new PhysicsProcessingResult(){ResultType = PhysicsProcessingResultType.Ok};}
        }
    }
}