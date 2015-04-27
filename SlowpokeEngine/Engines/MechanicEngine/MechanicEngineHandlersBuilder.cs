using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Weapons;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Engines
{
    public class MechanicEngineHandlersBuilder
    {
        public Tuple<
            Func<GameCommand, PhysicsProcessingResult, bool>,
            Action<GameCommand, PhysicsProcessingResult>> BuildBulletCollisionHandler(IMechanicEngine mechanicEngine)
        {
            return new Tuple<Func<GameCommand, PhysicsProcessingResult, bool>, Action<GameCommand, PhysicsProcessingResult>>(
            (gameCommand, result) =>
            {
                return result is PhysicsProcessingResultCollision
                    && gameCommand.ActiveBody is Bullet;
            },
                    (gameCommand, result) =>
                    {
                        var resultCollision = (PhysicsProcessingResultCollision)result;
                        var bullet = (Bullet)gameCommand.ActiveBody;
                        mechanicEngine.ReleaseBody(gameCommand.ActiveBody.Id);

                        foreach (var body in resultCollision.Bodies)
                        {
                            var bulletOwnerBody = mechanicEngine.FindBody(bullet.OwnerId);


                            if (body is ActiveBody && bulletOwnerBody != null
                                && ((ActiveBody)body).SocialGroups.Intersect(bulletOwnerBody.SocialGroups).Count() == 0)
                            {
                                //Set damage to collided active body
                                var collidedActiveBody = ((ActiveBody)body);
                                collidedActiveBody.Harm(bullet.Damage);

                                //Kill collided active body if needed
                                if (collidedActiveBody.Life <= 0)
                                {
                                    mechanicEngine.ReleaseBody(collidedActiveBody.Id);

                                    //Increase score of bullet owner
                                    if (bulletOwnerBody != null)
                                    {
                                        bulletOwnerBody.UpdateScore(collidedActiveBody.LifeMax);
                                    }
                                }
                            }
                        }
                    });
        }

        public Tuple<
            Func<GameCommand, PhysicsProcessingResult, bool>,
            Action<GameCommand, PhysicsProcessingResult>> BuildUsableContainerCollisionHandler(IMechanicEngine mechanicEngine)
        {
            return new Tuple<Func<GameCommand, PhysicsProcessingResult, bool>, Action<GameCommand, PhysicsProcessingResult>>(
            (gameCommand, result) =>
            {
                return result is PhysicsProcessingResultCollision
                    && gameCommand.ActiveBody is PlayerBody
                    && ((PhysicsProcessingResultCollision)result).Bodies[0] is IUsableBody;
            },
                    (gameCommand, result) =>
                    {
                        var resultCollision = (PhysicsProcessingResultCollision)result;
                        var player = (PlayerBody)gameCommand.ActiveBody;

                        //Set usable container
                        player.UsableBodyInScope = (IUsableBody)resultCollision.Bodies[0];
                    });
        }
    }
}
