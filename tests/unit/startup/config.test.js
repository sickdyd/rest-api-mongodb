const config = require("config");
config.jwtPrivateKey = null;
const getPrivateKey = require("../../../startup/config");

describe("startup / config", () => {
  it("should throw error if no jwtPrivateKey is defined in the ENV variables", () => {
    expect(getPrivateKey).toThrow(new Error("FATAL ERROR: jwtPrivateKey is not defined in the ENV variables."));
  });
});