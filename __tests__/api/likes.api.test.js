import handler from "../../pages/api/movies/[idMovie]/likes";
import { createMocks } from "node-mocks-http";
import * as mongodb from "../../lib/mongodb.ts";

jest.mock("../../lib/mongodb", () => ({
    __esModule: true,
    default: {
        db: jest.fn(() => ({
            collection: jest.fn(() => ({
                findOne: jest.fn(async () => ({ idTMDB: 123, likeCounter: 5 })),
                updateOne: jest.fn(async () => ({ matchedCount: 0, modifiedCount: 0 })),
                insertOne: jest.fn(async (data) => ({ insertedId: data.idTMDB })),
            })),
        })),
    },
}));

describe("/api/likes API", () => {
    it("should increment like counter for an existing movie", async () => {
        const { req, res } = createMocks({
            method: "PATCH",
            query: { idMovie: 123 },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(201);
        expect(res._getJSONData().data.action).toBe("likeCounter updated");
    });

    it("should create like counter for a new movie", async () => {
        const { req, res } = createMocks({
            method: "PATCH",
            query: { idMovie: 456 },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(201);
        expect(res._getJSONData().data.action).toBe("likeCounter updated");
    });

    it("should get like counter for a movie", async () => {
        const { req, res } = createMocks({
            method: "GET",
            query: { idMovie: 123 },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData().data.likes).toBeDefined();
    });

    it("should return 405 if method is not allowed", async () => {
        const { req, res } = createMocks({
            method: "PUT",
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
    });
});