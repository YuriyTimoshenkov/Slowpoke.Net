using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeHubs
{
    public class BodyFacade
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string BodyType { get; set; }
        public Vector Direction { get; set; }
        public int Life { get; set; }
        public int LifeMax { get; set; }
        public BodyState State { get; set; }
        public int Score { get; set; }
        public int ViewZone { get; set; }
        public int WeaponsCount { get; set; }
        public string CurrentWeapon { get; set; }
        public IList<string> SocialGroups { get; set; }
        public ShapeFacade Shape { get; set; }
        //Points per second
        public int Speed { get; set; }
        public long LastProcessedCommandId { get; set; }
        public long CreatedByCommandId { get; set; }
        public Guid OwnerId { get; set; }

        public static BodyFacade FromBody(Body body)
        {
            var result = new BodyFacade();

            result.Id = body.Id;
            result.BodyType = body.BodyType;
            result.Shape = ShapeFacade.FromShape(body.Shape);

            if(body is ActiveBody)
            {
                var aBody = body as ActiveBody;
                result.CurrentWeapon = aBody.CurrentWeapon == null ? string.Empty : aBody.CurrentWeapon.Name;
                result.Direction = aBody.Direction;
                result.Life = aBody.Life;
                result.LifeMax = aBody.LifeMax;
                result.Score = aBody.Score;
                result.SocialGroups = aBody.SocialGroups;
                result.Speed = aBody.Speed;
                result.State = aBody.State;
                result.ViewZone = aBody.ViewZone;
                result.WeaponsCount = aBody.WeaponsCount;
                result.LastProcessedCommandId = aBody.LastProcessedCommandId;
                result.CreatedByCommandId = aBody.CreatedByCommandId;
            }

            if(body is PlayerBody)
            {
                var pBody = body as PlayerBody;
                result.Name = pBody.Name;
            }

            return result;
        }
    }
}
