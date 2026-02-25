import Fastify from "fastify";
import multipart from "@fastify/multipart";
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
import matchStatus from "./routes/MatchStatus";
import refreshAccess  from "./routes/RefreshAccess";
import profileUpdateRoutes from "./routes/ProfileUpdate";
import avatarRoutes from "./routes/ProfileAvatar";
import deleteMatch from "./routes/DeleteMatch";
import path from "path";
import fastifyStatic from "@fastify/static";
import matchResult from "./routes/MatchResult";
import aiToken from "./routes/AIToken";
import './utils/validateEnv';

dotenv.config();

const app = Fastify({
	logger: true,
	trustProxy: true
}).withTypeProvider<TypeBoxTypeProvider>();

const port = process.env.BACKEND_PORT? Number(process.env.BACKEND_PORT) : 3000;

async function buildServer() {
	// Register CORS plugin
	await app.register(cors, {
		origin: "https://localhost",
		credentials: true,
		methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT']
	});
	// ENABLE multipart/form-data for file uploads
	await app.register(multipart, {
		limits: {
			fileSize: 4 * 1024 * 1024,
		},
	});

	const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads", "avatars");
	await app.register(fastifyStatic, {
		root: UPLOAD_DIR,
		prefix: "/avatars/", // URL prefix
	});

	app.get("/health", async () => ({ Hello: "Backend is running...." }));

	app.register(fastifyCookie);
	app.register(registrationRoutes);
	app.register(loginRoutes);
	app.register(profileRoutes);
	app.register(profileUpdateRoutes);
	app.register(friendList);
	app.register(friendRequest);
	app.register(logoutRoutes);
	app.register(matchmakingRequest);
	app.register(matchStatus);
	app.register(refreshAccess);
	app.register(avatarRoutes);
	app.register(deleteMatch);
	app.register(matchResult);
	app.register(aiToken);
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
