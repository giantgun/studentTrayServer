import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
    BelongsToSetAssociationMixin,
  } from '@sequelize/core'
import { Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo, Default, AllowNull } from '@sequelize/core/decorators-legacy'
import { User } from './user';
import { Business } from './business';

export class Advert extends Model<InferAttributes<Advert>, InferCreationAttributes<Advert>>{
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    @NotNull
    declare advertId: CreationOptional<number>

    @BelongsTo(() => User, {
        foreignKey:  'userId',
        inverse: {
            as: 'adverts',
            type: 'hasMany',
            },
    })
    declare UserId?: NonAttribute<User>;

    @Attribute(DataTypes.INTEGER)
    @AllowNull
    declare userId: CreationOptional<number>;

    declare setUserId: BelongsToSetAssociationMixin<User, User['userId']>

    @BelongsTo(() => Business, {
        foreignKey:  'businessId',
        inverse: {
            as: 'adverts',
            type: 'hasMany',
            },
    })
    declare BusinessId?: NonAttribute<Business>;

    @Attribute(DataTypes.INTEGER)
    declare businessId:  CreationOptional<number>

    declare setBusinessId: BelongsToSetAssociationMixin<Business, Business['businessId']>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare title: string;

    @Attribute(DataTypes.TEXT('long'))
    @NotNull
    declare content: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare school: string;

    @Attribute(DataTypes.STRING)
    @AllowNull
    declare actionLink: string;

    @Attribute(DataTypes.STRING)
    @AllowNull
    declare actionPhoneNumber: string;

    @Attribute(DataTypes.STRING)
    @AllowNull
    declare actionWhatsappNumber: string;

    @Attribute(DataTypes.TEXT('long'))
    @NotNull
    declare imagesUrlArrayString: string

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}