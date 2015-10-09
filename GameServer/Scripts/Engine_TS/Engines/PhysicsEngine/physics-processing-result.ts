class PhysicsProcessingResult { }

class PhysicsProcessingResultCollision extends PhysicsProcessingResult {
    bodies: Body[];

    constructor(bodies: Body[]) {
        super();
        bodies = bodies;
    }
}

class PhysicsProcessingResultEmpty extends PhysicsProcessingResult { }