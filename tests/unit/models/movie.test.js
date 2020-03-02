const { validate } = require("../../../models/movie");
const mongoose = require("mongoose");

describe("movie schema validation", () => {

  let mockMovie;

  beforeEach(()=> {
    mockMovie = {
      title: "Alien 3",
      genreId: mongoose.Types.ObjectId().toHexString(),
      numberInStock: 1,
      dailyRentalRate: 5,
    }
  });

  it("should return an error if the title is zero length", () => {
    mockMovie.title = "";
    const result = validate(mockMovie);
    expect(result.error.details[0].type).toMatch(/string.empty/);
  });

  it("should return an error if the title is less than 2 chars", () => {
    mockMovie.title = "a";
    const result = validate(mockMovie);
    expect(result.error.details[0].type).toMatch(/string.min/);
  });

  it("should return an error if the title is more than 255 chars", () => {
    mockMovie.title = Array(257).join("a");
    const result = validate(mockMovie);
    expect(result.error.details[0].type).toMatch(/string.max/);
  });

  it("should return an error if the genreId is not a valid id", () => {
    mockMovie.genreId = "a";
    const result = validate(mockMovie);
    expect(result.error.details[0].type).toMatch(/string.pattern.name/);
  });

  it("should return an error if the numberInStock is not a number", () => {
    mockMovie.numberInStock = "a";
    const result = validate(mockMovie);
    expect(result.error.details[0].type).toMatch(/number.base/);
  });

  it("should return an error if the numberInStock is undefined", () => {
    mockMovie.numberInStock = undefined;
    const result = validate(mockMovie);
    expect(result.error.details[0].type).toMatch(/any.required/);
  });

  it("should return an error if the dailyRentalRate is not a number", () => {
    mockMovie.dailyRentalRate = "a";
    const result = validate(mockMovie);
    expect(result.error.details[0].type).toMatch(/number.base/);
  });

  it("should return an error if the dailyRentalRate is undefined", () => {
    mockMovie.dailyRentalRate = undefined;
    const result = validate(mockMovie);
    expect(result.error.details[0].type).toMatch(/any.required/);
  });

  it("should return a movie if input is valid", () => {
    const result = validate(mockMovie);
    expect(result.error).toBe(undefined);
    expect(result.value).toMatchObject(mockMovie);
  });

});