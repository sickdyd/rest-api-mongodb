const request = require("supertest");

describe("routes / home", () => {
  it("should return index view when requesting /", async () => {
    const server = require("../../../index");
    const res = await request(server).get("/");
    expect(res.status).toBe(200);
    await server.close();
  });
});