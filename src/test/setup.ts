import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

declare global {
  function get_cookie(): Promise<string[]>;
}

global.get_cookie = async () => {
  const response = await request(app)
    .post("/api/users/signup/")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);
  return response.get('Set-Cookie');
};

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
