import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
    BelongsToSetAssociationMixin,
} from '@sequelize/core'
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Default, BelongsTo } from '@sequelize/core/decorators-legacy'
import { User } from './user'

export class Room extends Model <InferAttributes<Room>, InferCreationAttributes<Room>>{
    @Attribute(DataTypes.INTEGER)
    @AutoIncrement
    @PrimaryKey
    @NotNull
    declare RoomId: CreationOptional<number>

    @BelongsTo(()=> User, {
        foreignKey: "userId",
        inverse: {
            as: "rooms",
            type: "hasMany"
        }
    })
    declare UserId?: NonAttribute<User>

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number

    declare setUserId: BelongsToSetAssociationMixin<User, User['userId']>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare imagesArrayString: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare propertyType: string

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare numberOfBedrooms: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare numberOfBathrooms: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare paymentFrequency: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare price: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare priceType: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare location: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare nearestSchool: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare walkingTime: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare kekeTime: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare description: string;

    @Attribute(DataTypes.BOOLEAN)
    declare WiFi: boolean;

    @Attribute(DataTypes.BOOLEAN)
    declare parking: boolean;

    @Attribute(DataTypes.BOOLEAN)
    declare electricity: boolean;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare electricityDescription: string;

    @Attribute(DataTypes.BOOLEAN)
    declare water: boolean;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare waterDescription: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare networkQuality: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare networkDescription: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare ownerName: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare OwnerPhone: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare ownerProgramme: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare yearOfStudy: string

    @Attribute(DataTypes.DATE)
    @NotNull
    declare dateOfBirth: Date

    @Attribute(DataTypes.STRING)
    declare additionalInfo: string
}