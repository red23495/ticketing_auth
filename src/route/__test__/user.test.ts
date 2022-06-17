import request from "supertest";
import app from "../../app";

it("returns a 201 on successfull signup", async () => {
  request(app)
    .post("/api/users/signup/")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup/")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup/")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(400);
});

it("sets a cookie after successfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup/")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});

it("fails when a non-existent email is provided", async () => {
  await request(app)
    .post("/api/users/signup/")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);
  request(app)
    .post("/api/users/signin/")
    .send({
      email: "notest@test.com",
      password: "12345678",
    })
    .expect(400);
});

it("fails when a inavlid password is provided", async () => {
  await request(app)
    .post("/api/users/signup/")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);
  request(app)
    .post("/api/users/signin/")
    .send({
      email: "test@test.com",
      password: "123456789",
    })
    .expect(400);
});

it("sets cookie when valid credential is provided", async () => {
  await request(app)
    .post("/api/users/signup/")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin/")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});

it("clears cookie when user signs out", async () => {
  await request(app)
    .post("/api/users/signup/")
    .send({
      email: "test@test.com",
      password: "12345678",
    })
    .expect(201);
  const response = await request(app)
    .get("/api/users/signout/")
    .send()
    .expect(200);
  expect(response.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});

it("returns logged in user when asked", async () => {
  const cookie = await global.get_cookie();
  const response = await request(app)
    .get("/api/users/current_user/")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("returns responds with 403 when not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/current_user/")
    .send()
    .expect(403);
});