import { 
    BelongsToSetAssociationMixin,
    CreationOptional,
    DataTypes,
    InferAttributes, 
    InferCreationAttributes, 
    Model, 
    NonAttribute
} from "@sequelize/core";
import { Attribute, AutoIncrement, BelongsTo, NotNull, PrimaryKey } from "@sequelize/core/decorators-legacy";
import { User } from "./user";


export class Business extends Model<InferAttributes<Business>, InferCreationAttributes<Business>>{
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    @NotNull
    declare businessId: CreationOptional<number>;

    @BelongsTo(()=> User, {
        foreignKey: "userId",
        inverse: {
            as: "businessId",
            type: "hasOne"
        }
    })
    declare UserId?: NonAttribute<User>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number;

    declare setUserId: BelongsToSetAssociationMixin<User, User['userId']>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare firstName: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare lastName: string ;

    getFullname() {
        return [this.firstName, this.lastName].join(' ');
    }

    @Attribute(DataTypes.STRING)
    @NotNull
    declare businessName: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare address: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare nearestSchool: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare phoneNumber: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare businessEmail: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare description: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}