import mongoose from "mongoose";
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

let container: StartedTestContainer | undefined;

beforeAll(async () => {
  if (process.env.SKIP_TESTCONTAINERS === "1") {
    // Allow running lightweight unit tests without Docker.
    return;
  }

  container = await new GenericContainer("mongo:latest")
    .withExposedPorts(27017)
    .withWaitStrategy(Wait.forLogMessage("Waiting for connections"))
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(27017);
  const uri = `mongodb://${host}:${port}/test`;

  process.env.MONGODB_URI = uri;

  await mongoose.connect(uri, { dbName: "test" });
}, 60_000);

afterAll(async () => {
  if (process.env.SKIP_TESTCONTAINERS === "1") {
    return;
  }
  await mongoose.disconnect();
  if (container) {
    await container.stop();
  }
});
