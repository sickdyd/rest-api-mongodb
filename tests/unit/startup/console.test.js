const mockApp = {
  get: jest.fn().mockReturnValue("development"),
  use: jest.fn(),
}
require("../../../startup/console")(mockApp);

describe("startup / console", () => {
  it("should log messages in console if in development environment", async () => {
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function));
  });
});