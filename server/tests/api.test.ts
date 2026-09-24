import { beforeAll, afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import User from "../src/models/User.js";
import {
  connectTestDatabase,
  clearTestDatabase,
  disconnectTestDatabase,
} from "./setup.js";

process.env.JWT_SECRET = "test-secret";

beforeAll(async () => {
  await connectTestDatabase();
});

afterEach(async () => {
  await clearTestDatabase();
});

afterAll(async () => {
  await disconnectTestDatabase();
});

describe("Health API", () => {
  it("returns a successful health response", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "ForgeDesk API is running",
    });
  });
});

describe("Authentication API", () => {
  it("rejects registration with invalid data", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "",
      email: "invalid-email",
      password: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it("registers a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "TestPassword123",
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("test@example.com");
    expect(response.body.user.role).toBe("user");
    expect(response.body.token).toBeDefined();
  });

  it("logs in an existing user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "TestPassword123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "TestPassword123",
    });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("test@example.com");
    expect(response.body.token).toBeDefined();
  });

  it("rejects incorrect login credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "TestPassword123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "WrongPassword123",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("protects the current-user endpoint", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required");
  });
});

describe("Task API", () => {
  it("protects the task endpoint", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required");
  });

  it("rejects invalid task data", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Task User",
        email: "task@example.com",
        password: "TestPassword123",
      });

    const token = registerResponse.body.token;

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
        priority: "high",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors[0].field).toBe("title");
  });

  it("creates a task for the authenticated user", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Task User",
        email: "task@example.com",
        password: "TestPassword123",
      });

    const token = registerResponse.body.token;

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Automated test task",
        priority: "high",
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Automated test task");
    expect(response.body.priority).toBe("high");
    expect(response.body.status).toBe("todo");
  });

  it("returns only tasks belonging to the authenticated user", async () => {
    const firstUser = await request(app).post("/api/auth/register").send({
      name: "First User",
      email: "first@example.com",
      password: "TestPassword123",
    });

    const secondUser = await request(app).post("/api/auth/register").send({
      name: "Second User",
      email: "second@example.com",
      password: "TestPassword123",
    });

    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${firstUser.body.token}`)
      .send({
        title: "First user's task",
        priority: "medium",
      });

    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${secondUser.body.token}`)
      .send({
        title: "Second user's task",
        priority: "high",
      });

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${firstUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("First user's task");
  });
});

describe("Task API hardening", () => {
  it("rejects an invalid JWT", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired token");
  });

  it("rejects an invalid task ID", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Task User",
        email: "invalid-id@example.com",
        password: "TestPassword123",
      });

    const response = await request(app)
      .patch("/api/tasks/not-a-valid-id")
      .set("Authorization", `Bearer ${registerResponse.body.token}`)
      .send({
        status: "done",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors[0].field).toBe("id");
  });

  it("rejects an invalid priority", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Task User",
        email: "invalid-priority@example.com",
        password: "TestPassword123",
      });

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${registerResponse.body.token}`)
      .send({
        title: "Invalid priority task",
        priority: "urgent",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors[0].field).toBe("priority");
  });

  it("rejects an invalid status", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Task User",
        email: "invalid-status@example.com",
        password: "TestPassword123",
      });

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${registerResponse.body.token}`)
      .send({
        title: "Status validation task",
        priority: "medium",
      });

    const response = await request(app)
      .patch(`/api/tasks/${createResponse.body._id}`)
      .set("Authorization", `Bearer ${registerResponse.body.token}`)
      .send({
        status: "invalid-status",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors[0].field).toBe("status");
  });

  it("rejects an empty task update", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Task User",
        email: "empty-update@example.com",
        password: "TestPassword123",
      });

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${registerResponse.body.token}`)
      .send({
        title: "Task for empty update",
        priority: "low",
      });

    const response = await request(app)
      .patch(`/api/tasks/${createResponse.body._id}`)
      .set("Authorization", `Bearer ${registerResponse.body.token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  it("rejects unexpected fields when creating a task", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Task User",
        email: "strict-create@example.com",
        password: "TestPassword123",
      });

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${registerResponse.body.token}`)
      .send({
        title: "Strict validation task",
        priority: "medium",
        userId: "should-not-be-accepted",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  it("prevents a user from updating another user's task", async () => {
    const firstUser = await request(app).post("/api/auth/register").send({
      name: "First User",
      email: "update-owner@example.com",
      password: "TestPassword123",
    });

    const secondUser = await request(app).post("/api/auth/register").send({
      name: "Second User",
      email: "update-attacker@example.com",
      password: "TestPassword123",
    });

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${firstUser.body.token}`)
      .send({
        title: "Protected task",
        priority: "high",
      });

    const response = await request(app)
      .patch(`/api/tasks/${createResponse.body._id}`)
      .set("Authorization", `Bearer ${secondUser.body.token}`)
      .send({
        title: "Unauthorized update",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task not found");
  });

  it("prevents a user from deleting another user's task", async () => {
    const firstUser = await request(app).post("/api/auth/register").send({
      name: "First User",
      email: "delete-owner@example.com",
      password: "TestPassword123",
    });

    const secondUser = await request(app).post("/api/auth/register").send({
      name: "Second User",
      email: "delete-attacker@example.com",
      password: "TestPassword123",
    });

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${firstUser.body.token}`)
      .send({
        title: "Protected delete task",
        priority: "high",
      });

    const response = await request(app)
      .delete(`/api/tasks/${createResponse.body._id}`)
      .set("Authorization", `Bearer ${secondUser.body.token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task not found");

    const ownerTasks = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${firstUser.body.token}`);

    expect(ownerTasks.status).toBe(200);
    expect(ownerTasks.body).toHaveLength(1);
    expect(ownerTasks.body[0].title).toBe("Protected delete task");
  });
});

describe("Role authorization", () => {
  it("rejects a normal user from the admin endpoint", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Normal User",
        email: "normal@example.com",
        password: "TestPassword123",
      });

    const response = await request(app)
      .get("/api/auth/admin-test")
      .set("Authorization", `Bearer ${registerResponse.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "You do not have permission to access this resource",
    );
  });

  it("allows an admin to access the admin endpoint", async () => {
    const user = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "hashed-password",
      role: "admin",
    });

    const token = jwt.sign(
      {
        userId: user._id,
        role: "admin",
      },
      process.env.JWT_SECRET as string,
    );

    const response = await request(app)
      .get("/api/auth/admin-test")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("You have administrator access");
  });
});
