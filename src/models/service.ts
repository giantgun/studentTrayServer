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

export class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service>>{
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    @NotNull
    declare serviceId: CreationOptional<number>

    @BelongsTo(() => User, {
        foreignKey:  'userId',
        inverse: {
            as: 'services',
            type: 'hasMany',
            },
    })
    declare UserId?: NonAttribute<User>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number;

    declare setUserId: BelongsToSetAssociationMixin<User, User['userId']>

    @Attribute(DataTypes.TEXT('long'))
    @NotNull
    declare imagesUrlArrayString: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare title: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare description: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare price: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare category: string;

    @Attribute(DataTypes.STRING)
    @Default("")
    declare online: string

    @Attribute(DataTypes.STRING)
    @Default("")
    declare inPerson: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare jsonStingifiedAvailabilty: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare school: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare priceType: string;

    @Attribute(DataTypes.TEXT('long'))
    @AllowNull
    declare videoUrl:  CreationOptional<string>

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}