class PhysicsEngine implements IPhysicsEngine {

    constructor(shapeCollisionManager: IShapeCollisionManager) {

    }

    processBodyAction(command: CommandBase): PhysicsProcessingResult {
        //foreach(var handler in _commandHandlers)
        //{
        //    if (handler.Item1(command))
        //        return handler.Item2(command);
        //}
        return new PhysicsProcessingResultEmpty();
    }


    toDelete() {//dfsf }

    }
}
