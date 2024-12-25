import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from '@sequelize/core';
  import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

  
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

    getFullname() {
        return [this.firstName, this.lastName].join(' ');
      }
  }
  