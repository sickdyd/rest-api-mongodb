const request = require("supertest");
const {Genre} = require("../../../models/genre");
const {User} = require("../../../models/user");
const mongoose = require("mongoose");
let server;

describe("/api/genres", () => {
  beforeEach(() => { server = require("../../../index") });
  afterEach(async () => {
    // clean up database
    await Genre.remove({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return al genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ])
      const res = await request(server).get("/api/genres")
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name = "genre1")).toBeTruthy();
      expect(res.body.some(g => g.name = "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id)
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/0")
      expect(res.status).toBe(404);
    });
    it("should return 404 if no genre with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id)
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {

    let token;
    let name;

    // Generate the token to simulate authentication
    // Set the name for the happy path
    beforeEach(() => {
      token = new User().generateAuthToken()
      name = "genre1";
    });

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        // Pass the token in the header in our request
        .set("x-auth-token", token)
        .send({ name });
    }

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();       
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();  
      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      const res = await exec();
      const genre = await Genre.find({ name: "genre1" });
      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid in the body of the resposne", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {

    let token; 
    let newName; 
    let genre; 
    let id;

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      token = new User().generateAuthToken();     
      id = genre._id; 
      newName = 'updatedName'; 
    })

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    }

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if the genre id is not valid", async () => {
      id = "0"
      const res = await exec();
      expect(res.status).toBe(400);
    });
    
    it("should return 400 if the genre id is valid but not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      newName = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      newName = Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should update the genre if input is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return the updated genre if input is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });

  });

  describe("DELETE /:id", () => {

    let token; 
    let id;

    beforeEach(async () => {
      id = mongoose.Types.ObjectId();
      token = new User({ isAdmin: true }).generateAuthToken(); 
    })

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
    }

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 400 if the genre id is not valid", async () => {
      id = "0"
      const res = await exec();
      expect(res.status).toBe(400);
    });
    
    it("should return 400 if the genre id is valid but not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should delete the genre if input is valid", async () => {
      const genre = new Genre({ name: "genre1 "});
      await genre.save();
      id = genre._id;
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should delete the genre and return it if input is valid", async () => {
      const genre = new Genre({ name: "genre1"});
      await genre.save();
      id = genre._id;
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });

  });
});