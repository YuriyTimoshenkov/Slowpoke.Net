interface ICharacterConfiguration {
    Shape: ServerShape;
    Life: number;
    LifeMax: number;
    ViewZone: number;
    Speed: number;
}

interface ILifeContainerConfiguration {
    Shape: ServerShape;
    LifeContent: number;
}

interface IEntityGenerationServiceConfiguration {
    EntitiesCount: number;
}

interface IWeaponSimpleBulletConfiguration {
    Shape: ServerShape;
    ShootingFrequency: number;
    BulletSize: number;
    BulletSpeed: number;
    ShootingDistance: number;
    Damage: number;
    Name: string;
}

interface IDynamitConfiguration extends IWeaponSimpleBulletConfiguration
{
    DetonationTime: number;
    BangRadius: number;
}

interface IEngineConfiguration

    {
    NPC: ICharacterConfiguration;
    Player: ICharacterConfiguration;
    LifeContainer: ILifeContainerConfiguration;
    NPCGenerationService: IEntityGenerationServiceConfiguration;
    BoxesGenerationService: IEntityGenerationServiceConfiguration;
    Revolver: IWeaponSimpleBulletConfiguration;
    Gun: IWeaponSimpleBulletConfiguration;
    ShotGun: IWeaponSimpleBulletConfiguration;
    Dynamit: IDynamitConfiguration;
    } 


