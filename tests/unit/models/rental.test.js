const { validateRental } = require("../../../models/rental");
const mongoose = require("mongoose");

describe("rental schema validation", () => {

  let mockRental;

  beforeEach(()=> {
    mockRental = {
      customerId: mongoose.Types.ObjectId().toHexString(),
      movieId: mongoose.Types.ObjectId().toHexString(),
    }
  });

  it("should return an error if customerId is not a valid objectId", () => {
    mockRental.customerId = "a";
    const result = validateRental(mockRental);
    expect(result.error.details[0].type).toMatch(/string.pattern.name/);
  });

  it("should return an error if customerId is undefined", () => {
    mockRental.customerId = undefined;
    const result = validateRental(mockRental);
    expect(result.error.details[0].type).toMatch(/any.required/);
  });

  it("should return an error if customerId is not a valid objectId", () => {
    mockRental.movieId = "a";
    const result = validateRental(mockRental);
    expect(result.error.details[0].type).toMatch(/string.pattern.name/);
  });

  it("should return an error if customerId is undefined", () => {
    mockRental.movieId = undefined;
    const result = validateRental(mockRental);
    expect(result.error.details[0].type).toMatch(/any.required/);
  });

  it("should return a rental if input is valid", () => {
    const result = validateRental(mockRental);
    expect(result.error).toBe(undefined);
    expect(result.value).toMatchObject(mockRental);
  });

});