import request from "supertest";
import server from "../../server";

describe("POST /api/products", () => {
    test("Sould create a new product", async () => {
        const response = await request(server).post("/api/products").send({
            name: "Mouse - Testing ",
            price: 500,
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("data");

        expect(response.status).not.toBe(404);
        expect(response.body).not.toHaveProperty("errors");
    });

    test("Validate that the price is greater than 0", async () => {
        const response = await request(server).post("/api/products").send({
            name: "PlayStation",
            price: 0,
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(1);
    });
    test("Validate that the price is a number ", async () => {
        const response = await request(server).post("/api/products").send({
            name: "PlayStation",
            price: "Hola",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(2);
    });
});

describe("GET /api/products", () => {
    test("Check if /api/products exist", async () => {
        const response = await request(server).get("/api/products");

        expect(response.status).not.toBe(404);
    });

    test("Should return a JSON with products information", async () => {
        const response = await request(server).get("/api/products");

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveLength(1);
        expect(response.body).not.toHaveProperty("errors");
    });
});

describe("GET /api/products/:id", () => {
    test("Should return 404 for an inexistent product", async () => {
        const productID = 2000;
        const response = await request(server).get(`/api/products/${productID}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Producto no encontrado");
    });
    test("Should check a valid ID in the URL", async () => {
        const response = await request(server).get("/api/products/invalid-id");
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors[0].msg).toBe("La id no es valida");
    });

    test("Should check a valid ID in the URL", async () => {
        const response = await request(server).get("/api/products/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
    });
});

describe("PUT /api/products/:id", () => {
    it("should check a valid ID in the URL", async () => {
        const response = await request(server).put("/api/products/not-valid-url").send({
            name: "Monitor Curvo",
            availability: true,
            price: 300,
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe("La id no es valida");
    });

    it("should display validation error messages when updating a product", async () => {
        const response = await request(server).put("/api/products/1").send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(5);

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty("data");
    });

    it("should validate that the price is greater than 0", async () => {
        const response = await request(server).put("/api/products/1").send({
            name: "Monitor Curvo",
            availability: true,
            price: 0,
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe("El precio del producto no es valido");

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty("data");
    });

    it("should return a 404 response for a non-existent product", async () => {
        const productId = 2000;
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Monitor Curvo",
            availability: true,
            price: 300,
        });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Producto no encontrado");

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty("data");
    });

    it("should update an existing product with valid data", async () => {
        const response = await request(server).put(`/api/products/1`).send({
            name: "Monitor Curvo",
            availability: true,
            price: 300,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");

        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty("errors");
    });
});

describe("PATCH /api/products/:id", () => {
    test("Should return a 404 status response for an invalid product", async () => {
        const productId = 2000;
        const response = await request(server).patch(`/api/products/${productId}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Producto no encontrado");
    });

    test("Should update product availability ", async () => {
        const response = await request(server).patch(`/api/products/1`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
    });
});

describe("DELETE /api/products/:id", () => {
    it("should check a valid ID", async () => {
        const response = await request(server).delete("/api/products/not-valid");
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors[0].msg).toBe("La id no es valida");
    });

    it("should return a 404 response for a non-existent product", async () => {
        const productId = 2000;
        const response = await request(server).delete(`/api/products/${productId}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Producto no encontrado");
        expect(response.status).not.toBe(200);
    });

    it("should delete a product", async () => {
        const response = await request(server).delete("/api/products/1");
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("Producto eliminado");

        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(400);
    });
});
