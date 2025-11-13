import Fastify from "fastify";
import dotenv from "dotenv"
import registrationRoutes from "./routes/register";

dotenv.config();

const app = Fastify({ logger: true });
const port = process.env.BACKEND_PORT? Number(process.env.BACKEND_PORT) : 3000

app.get("/health", async() => ({Hello: "Backend is running...." }));

app.register(registrationRoutes);

const start = async () => {

	try {
		await app.listen({port});
		app.log.info('Server is listening at port: ${port}');
	}
	catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

start();

export default app;

