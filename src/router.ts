import { Router } from "express";
import { body, param } from "express-validator";
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateAvailability,
    updateProduct,
} from "./handlers/products";
import { handleInputErrors } from "./middleware";

const router = Router();

// ----------------------------------------------
//            Schema Producto Docs
// ----------------------------------------------

/**
 * @swagger
 *  components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The product id
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The product name
 *                      example: Monitor Curvo de 45 pulgadas
 *                  price:
 *                      type: number
 *                      description: The product price
 *                      example: 500
 *                  availability:
 *                      type: boolean
 *                      description: The product availability
 *                      example: true
 *
 */

// ----------------------------------------------
//            Routes - router - products
// ----------------------------------------------

// GET - Obtener todos los productos
/**
 * @swagger
 * /api/products:
 *      get:
 *          sumarry: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: "#/components/schemas/Product"
 */

router.get("/", getProducts);

// GET - Obtener producto por su ID
/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get a product by id
 *          tags:
 *              - Products
 *          description: Return a product based on its unique id
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The id of the protuct to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      aplication/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Product"
 *              400:
 *                  description: Bad Request - Invalid id
 *              404:
 *                  description: Not Found
 */

router.get(
    "/:id",
    // Validar parametro
    param("id").isInt().withMessage("La id no es valida"),
    // Middleware que recolecta los errores de la validacion anterior
    handleInputErrors,
    // Funcion Handler para obtener un producto por id
    getProductById
);

// POST - Crear Producto
/**
 * @swagger
 * /api/products:
 *      post:
 *          summary: Create a new product in the database
 *          tags:
 *              - Products
 *          description: Returns a new record in the database
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Celular Samsung"
 *                              price:
 *                                  type: number
 *                                  example: 500
 *          responses:
 *              201:
 *                  description: Product created succesfully
 *              400:
 *                  description: Bad Request - Invalid input data
 *
 */

router.post(
    "/",
    // Validacion con express-validator
    body("name").notEmpty().withMessage("El nombre del producto no puede estar vacio"),
    body("price")
        .notEmpty()
        .withMessage("El precio del producto no puede estar vacio")
        .isNumeric()
        .withMessage("El precio del producto debe ser un número")
        .custom((value) => value > 0)
        .withMessage("El precio del producto no es valido "),
    // Middleware que recolecta los errores de la validacion anterior
    handleInputErrors,
    // Funcion Handler que guarda el producto en la BD
    createProduct
);

// PUT - Actualizar producto por id
/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *          summary: Updates a product with user input
 *          tags:
 *              - Products
 *          description: Returns de updated product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The id of the protuct to update
 *              required: true
 *              schema:
 *                  type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Celular Samsung"
 *                              price:
 *                                  type: number
 *                                  example: 500
 *                              availability:
 *                                  type: boolean
 *                                  example: false
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          shcema:
 *                              $ref: "#/components/schemas/Product"
 *              400:
 *                  description: Bad Request - Invalid input data or invalid id
 *              404:
 *                  description: Not Found - Product not found
 *
 */
router.put(
    "/:id",
    // Validacion con express-validator
    param("id").isInt().withMessage("La id no es valida"),

    body("name").notEmpty().withMessage("El nombre del producto no puede estar vacio"),
    body("price")
        .notEmpty()
        .withMessage("El precio del producto no puede estar vacio")
        .isNumeric()
        .withMessage("El precio del producto debe ser un número")
        .custom((value) => value > 0)
        .withMessage("El precio del producto no es valido"),
    body("availability").isBoolean().withMessage("Valor para la disponibilidad no valido"),
    // Middleware que recolecta los errores de la validacion anterior
    handleInputErrors,
    updateProduct
);

// Modificar la disponibilidad
/**
 * @swagger
 * /api/products/{id}:
 *      patch:
 *          summary: Update the availability for a product
 *          tags:
 *              - Products
 *          description: Returns the updated availability
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The id of the protuct to update the availability
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          shcema:
 *                              $ref: "#/components/schemas/Product"
 *              400:
 *                  description: Bad Request - Invalid id
 *              404:
 *                  description: Not Found - Product not found
 *
 */
router.patch(
    "/:id",
    param("id").isInt().withMessage("La id no es valida"),
    handleInputErrors,
    updateAvailability
);

// Eliminar Producto
/**
 * @swagger
 * /api/products/{id}:
 *      delete:
 *          summary: Delete a product by for unique id
 *          tags:
 *              - Products
 *          description: Delete a product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The id of the product to delete
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              value: "Producto eliminado"

 *              400:
 *                  description: Bad Request - Invalid id
 *              404:
 *                  description: Not Found - Product not found
 *
 */
router.delete(
    "/:id",
    param("id").isInt().withMessage("La id no es valida"),
    handleInputErrors,
    deleteProduct
);

export default router;
