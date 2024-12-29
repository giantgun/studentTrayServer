import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core'
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Default } from '@sequelize/core/decorators-legacy'



export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Attribute(DataTypes.INTEGER)
  @NotNull
  @PrimaryKey
  @AutoIncrement
  declare userId: CreationOptional<number>;

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

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
