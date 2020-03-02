const request = require("supertest");
const {User} = require("../../../models/user");
const bcrypt = require("bcrypt");
let server;

describe("/api/auth", () => {

  beforeEach(async () => {
    server = require("../../../index");

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash("testing", salt);

    await User.collection.insertOne({
      name: "Mario",
      email: "test@test.it",
      password: pass,
    });
  });

  afterEach(async () => {
    await server.close();
    // clean up database
    await User.remove({});
  });

  describe("POST /", () => {

    let mockCredentials;

    beforeEach(() => {
      mockCredentials = {
        email: "test@test.it",
        password: "testing"
      }
    });
    
    const exec = async () => await request(server)
    .post("/api/auth")
    .send(mockCredentials);

    it("should return 400 if the email is not valid", async () => {
      mockCredentials.email = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if the email is not found", async () => {
      mockCredentials.email = "test1@test.it";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if the password is not valid", async () => {
      mockCredentials.password = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if the password is not valid for the user found", async () => {
      mockCredentials.password = "testing1";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return a token if the credentials are valid", async () => {
      const user = await User.findOne({ email: mockCredentials.email });
      const token = user.generateAuthToken();
      const res = await exec();
      expect(res.text).toMatch(token);
    });
  });

});