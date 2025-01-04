import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
    BelongsToSetAssociationMixin,
  } from '@sequelize/core'
import { Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo, Default } from '@sequelize/core/decorators-legacy'
import { User } from './user';
import { Business } from './business';

export class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>>{
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    @NotNull
    declare reviewId: CreationOptional<number>

    @BelongsTo(() => User, {
        foreignKey:  'userId',
        inverse: {
            as: 'reviews',
            type: 'hasMany',
            },
    })
    declare UserId?: NonAttribute<User>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: CreationOptional<number>;

    declare setUserId: BelongsToSetAssociationMixin<User, User['userId']>

    @BelongsTo(() => Business, {
        foreignKey:  'businessId',
        inverse: {
            as: 'reviews',
            type: 'hasMany',
            },
    })
    declare BusinessId?: NonAttribute<Business>;

    @Attribute(DataTypes.INTEGER)
    declare businessId:  CreationOptional<number>

    declare setBusinessId: BelongsToSetAssociationMixin<Business, Business['businessId']>

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare numberOfStars: number

    @Attribute(DataTypes.TEXT('long'))
    @NotNull
    declare description: string

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}