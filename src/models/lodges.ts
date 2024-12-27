import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from '@sequelize/core'
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Default } from '@sequelize/core/decorators-legacy'

export class Lodge extends Model<InferAttributes<Lodge>, InferCreationAttributes<Lodge>>{
    @Attribute(DataTypes.INTEGER)
    @NotNull
    @PrimaryKey
    @AutoIncrement
    declare lodgeId: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare propertyType: string;

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
    declare phoneNumber: string;
}