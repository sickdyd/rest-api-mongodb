const { validateCustomer } = require("../../../models/customer");

describe("customer schema validation", () => {

  let mockCustomer;

  beforeEach(()=> {
    mockCustomer = {
      isGold: true,
      name: "testing",
      phone: "0123456789"
    }
  });

  it("should return an error if isGold is not a bool", () => {
    mockCustomer.isGold = "a";
    const result = validateCustomer(mockCustomer);
    expect(result.error.details[0].type).toMatch(/boolean.base/);
  });

  it("should return an error if the name is zero length", () => {
    mockCustomer.name = "";
    const result = validateCustomer(mockCustomer);
    expect(result.error.details[0].type).toMatch(/string.empty/);
  });

  it("should return an error if the name is less than 5 chars", () => {
    mockCustomer.name = "a";
    const result = validateCustomer(mockCustomer);
    expect(result.error.details[0].type).toMatch(/string.min/);
  });

  it("should return an error if the name is more than 50 chars", () => {
    mockCustomer.name = Array(52).join("a");
    const result = validateCustomer(mockCustomer);
    expect(result.error.details[0].type).toMatch(/string.max/);
  });

  it("should return an error if the phone is zero length", () => {
    mockCustomer.phone = "";
    const result = validateCustomer(mockCustomer);
    expect(result.error.details[0].type).toMatch(/string.empty/);
  });

  it("should return an error if the phone is less than 5 chars", () => {
    mockCustomer.phone = "0";
    const result = validateCustomer(mockCustomer);
    expect(result.error.details[0].type).toMatch(/string.min/);
  });

  it("should return an error if the phone is more than 50 chars", () => {
    mockCustomer.phone = Array(52).join("0");
    const result = validateCustomer(mockCustomer);
    expect(result.error.details[0].type).toMatch(/string.max/);
  });

  it("should return the customer if input is valid", () => {
    const result = validateCustomer(mockCustomer);
    expect(result.error).toBe(undefined);
    expect(result.value).toMatchObject(mockCustomer);
  });

});