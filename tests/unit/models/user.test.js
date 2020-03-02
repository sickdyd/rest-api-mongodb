const { User, validate } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid json web token", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});

describe("user schema validation", () => {

  let mockUser;

  beforeEach(()=> {
    mockUser = {
      name: "test",
      email: "test@test.it",
      password: "1234abcd"
    }
  });

  it("should return an error if the name is zero length", () => {
    mockUser.name = "";
    const result = validate(mockUser);
    expect(result.error.details[0].type).toMatch(/string.empty/);
  });

  it("should return an error if the name is too short", () => {
    mockUser.name = "a";
    const result = validate(mockUser);
    expect(result.error.details[0].type).toMatch(/string.min/);
  });

  it("should return an error if the name is too long", () => {
    mockUser.name = Array(57).join("a");
    const result = validate(mockUser);
    expect(result.error.details[0].type).toMatch(/string.max/);
  });

  it("should return an error if the email is invalid", () => {
    mockUser.email = "aaa@aaa";
    const result = validate(mockUser);
    expect(result.error.details[0].type).toMatch(/string.email/);
  });

  it("should return an error if the password does not match complexity options", () => {
    mockUser.password = "1234";
    const result = validate(mockUser);
    expect(result.error.details[0].type).toMatch(/passwordComplexity/);
  });

  it("should return the user if input is valid", () => {
    const result = validate(mockUser);
    expect(result.error).toBe(undefined);
  });

});