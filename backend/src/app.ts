import Fastify from "fastify";
import dotenv from "dotenv";
import registrationRoutes from "./routes/register";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import loginRoutes from "./routes/login";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";

dotenv.config();

const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();
const port = process.env.BACKEND_PORT? Number(process.env.BACKEND_PORT) : 3000


async function buildServer() {
  // Register CORS plugin
  await app.register(cors, {
    origin: "*"
  });
  app.get("/health", async () => ({ Hello: "Backend is running...." }));
  app.register(fastifyCookie);
  app.register(registrationRoutes);
  app.register(loginRoutes);
}

const start = async () => {
	try {
		await buildServer();
		await app.listen({port, host: '0.0.0.0'});
		app.log.info('Server is listening at port: ${port}');
	}
	catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

start();

export default app;
