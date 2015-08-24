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
                    && gameCommand.ActiveBody is Bullet
                    //Execute only when collided with not IUsableBody
                    && ((PhysicsProcessingResultCollision)result).Bodies.Where(v => !(v is IUsableBody)).Count() > 0;
            },
                    (gameCommand, result) =>
                    {
                        var resultCollision = (PhysicsProcessingResultCollision)result;
                        var bullet = (Bullet)gameCommand.ActiveBody;
                        mechanicEngine.ReleaseBody(gameCommand.ActiveBody.Id);

                        foreach (var body in resultCollision.Bodies)
                        {
                            var bulletOwnerBody = mechanicEngine.FindBody(bullet.OwnerId) as CharacterBody;


                            if (body is ActiveBody && bulletOwnerBody != null
                                && ((CharacterBody)body).SocialGroups.Intersect(bulletOwnerBody.SocialGroups).Count() == 0)
                            {
                                //Set damage to collided active body
                                var collidedActiveBody = ((ActiveBody)body);

                                ApplyDamageToActiveBody(mechanicEngine, bulletOwnerBody, collidedActiveBody, bullet.Damage);
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

        public Tuple<
            Func<GameCommand, PhysicsProcessingResult, bool>,
            Action<GameCommand, PhysicsProcessingResult>> BuildMakeDamageCollisionHandler(IMechanicEngine mechanicEngine)
        {
            return new Tuple<Func<GameCommand, PhysicsProcessingResult, bool>, Action<GameCommand, PhysicsProcessingResult>>(
            (gameCommand, result) =>
            {
                return result is PhysicsProcessingResultCollision
                    && gameCommand is GameCommandMakeDamage;
            },
            (gameCommand, result) =>
            {
                var resultCollision = (PhysicsProcessingResultCollision)result;
                var command = (GameCommandMakeDamage)gameCommand;

                foreach (ActiveBody collidedActiveBody in resultCollision.Bodies.Where(v => v is ActiveBody))
                {
                    var bulletOwnerBody = mechanicEngine.FindBody(command.ActiveBody.OwnerId) as CharacterBody;

                    ApplyDamageToActiveBody(mechanicEngine, bulletOwnerBody, collidedActiveBody, command.Damage);
                }

                if(command.ActiveBody is DynamitBody)
                {
                    mechanicEngine.ReleaseBody(command.ActiveBody.Id);
                }
            });
        }

        private void ApplyDamageToActiveBody(IMechanicEngine mechanicEngine,CharacterBody bulletOwnerBody, ActiveBody collidedActiveBody, int damage)
        {
            collidedActiveBody.Harm(damage);

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
}
