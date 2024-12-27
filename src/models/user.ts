import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core'
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Default, HasMany } from '@sequelize/core/decorators-legacy'
import { Lodge } from './lodges';


export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Attribute(DataTypes.INTEGER)
  @NotNull
  @PrimaryKey
  @AutoIncrement
  declare userId: CreationOptional<number>;

  
  @HasMany(() => Lodge, 'lodgeId')
  declare lodges?: NonAttribute<Lodge[]>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare username: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare firstName: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare lastName: string ;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare email: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare password: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare dateOfBirth: Date;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare school: string;

  @Attribute(DataTypes.STRING)
  @Default('John')
  declare photoUrl: CreationOptional<string>;


  getFullname() {
    return [this.firstName, this.lastName].join(' ');
  }
}
