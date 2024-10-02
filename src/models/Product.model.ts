import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({
    tableName: "products",
})
class Products extends Model {
    // Creacion de columna name
    @Column({
        type: DataType.STRING(100),
    })
    declare name: string;

    // Creacion de columna price
    @Column({
        type: DataType.FLOAT,
    })
    declare price: number;

    // Creacion de la columna availability
    @Default(true) // Valor por default
    @Column({
        type: DataType.BOOLEAN,
    })
    declare availability: boolean;
}

export default Products;
