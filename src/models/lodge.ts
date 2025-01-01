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
import { User } from './user';

export class Lodge extends Model<InferAttributes<Lodge>, InferCreationAttributes<Lodge>>{
    @Attribute(DataTypes.INTEGER)
    @NotNull
    @PrimaryKey
    @AutoIncrement
    declare lodgeId: CreationOptional<number>;

    @BelongsTo(() => User, {
        foreignKey:  'userId',
        inverse: {
            as: 'lodges',
            type: 'hasMany',
          },
    })
    declare UserId?: NonAttribute<User>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number;

    declare setUserId: BelongsToSetAssociationMixin<User, User['userId']>
    
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

    @Attribute(DataTypes.TEXT('long'))
    @NotNull
    declare imagesUrlArrayString: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare numberAvailable: number;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}