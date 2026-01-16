import Fastify from "fastify";
import dotenv from "dotenv";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import registrationRoutes from "./routes/Register";
import loginRoutes from "./routes/Login";
import logoutRoutes from "./routes/Logout";
import profileRoutes from "./routes/Profile";
import friendRequest from "./routes/FriendRequest";
import friendList from "./routes/FriendList";
import matchmakingRequest from "./routes/Matchmaking";
import gameTokenRoute from "./routes/GameToken";
import matchStatus from "./routes/MatchStatus";

dotenv.config();

const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();
const port = process.env.BACKEND_PORT? Number(process.env.BACKEND_PORT) : 3000;


async function buildServer() {
	// Register CORS plugin
	await app.register(cors, {
		origin: "http://localhost:5173",
		credentials: true
	});

	app.get("/health", async () => ({ Hello: "Backend is running...." }));

	app.register(fastifyCookie);
	app.register(registrationRoutes);
	app.register(loginRoutes);
	app.register(profileRoutes);
	app.register(friendList);
	app.register(friendRequest);
	app.register(logoutRoutes);
	app.register(matchmakingRequest);
	app.register(gameTokenRoute);
	app.register(matchStatus);
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
