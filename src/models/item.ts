import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
    BelongsToSetAssociationMixin,
  } from '@sequelize/core'
import { Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo } from '@sequelize/core/decorators-legacy'
import { User } from './user';

export class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>>{
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    @NotNull
    declare itemId: CreationOptional<number>

    @BelongsTo(() => User, {
        foreignKey:  'userId',
        inverse: {
            as: 'items',
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
    declare imagesUrlArrayString: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare title: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare description: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare price: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare condition: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare category: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}