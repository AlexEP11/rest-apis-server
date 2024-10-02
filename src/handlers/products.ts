import { Request, Response } from "express";
import Products from "../models/Product.model";

export const getProducts = async (req: Request, res: Response) => {
    try {
        // Obtener todos los productos
        const products = await Products.findAll({
            // attributes: {exclude: ["createdAt", "updatedAt"]}    // Excluir columnas
        });
        res.json({ data: products }); // Mostrar todos los productos
    } catch (error) {}
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        // Obtener el producto mediante el id de los parametros de la url
        const { id } = req.params;
        const product = await Products.findByPk(id, {
            // attributes: {exclude: ["createdAt", "updatedAt"]}    // Excluir columnas
        });

        // Verificar que el producto exista
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }

        res.json({ data: product }); // Mostrar todos los productos
    } catch (error) {}
};

export const createProduct = async (req: Request, res: Response) => {
    // // Validacion con express-validator
    // await check("name")
    //     .notEmpty()
    //     .withMessage("El nombre del prodcuto no puede estar vacio")
    //     .run(req);

    // await check("price")
    //     .notEmpty()
    //     .withMessage("El precio del producto no puede estar vacio")
    //     .isNumeric()
    //     .withMessage("El precio del producto debe ser un número")
    //     .custom((value) => value > 0)
    //     .withMessage("El precio del producto no es valido ")
    //     .run(req);

    // // Recoleccion de errores
    // let errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     res.status(400).json({ errors: errors.array() });
    //     return;
    // }

    // Guardar en la BD lo obtenido de req
    try {
        const product = await Products.create(req.body);
        res.status(201).json({ data: product });
    } catch (error) {
        console.log(error);
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    // Obtiene el producto mediante su ID
    const product = await Products.findByPk(id);

    if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
    }

    // Actualiza el producto con lo que hay en req.body
    await product.update(req.body);
    await product.save();

    res.json({ data: product });
};

export const updateAvailability = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
    }

    // Actualiza la disponibilidad con lo contrario que hay en la BD
    product.availability = !product.dataValues.availability;
    await product.save();
    res.json({ data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
    }

    // Elimina por completo el producto de la BD
    product.destroy();

    res.json({ data: "Producto eliminado" });
};
