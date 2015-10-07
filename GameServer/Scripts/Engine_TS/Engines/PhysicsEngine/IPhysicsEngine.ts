interface IPhysicsEngine {
    processBodyAction(action: CommandBase): PhysicsProcessingResult;
}