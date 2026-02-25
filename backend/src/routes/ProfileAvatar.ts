import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../plugins/prisma";
import { ProfileAvatarResponseSchema } from "../schemas/UserSchema";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { profileAvatarSet } from "../utils/UserResponses";
import { errorResponse } from "../utils/UserResponses";
import { Static } from "@sinclair/typebox";
import { verifyAccess } from "../authentication/auth";
import { request } from "http";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { cwd } from 'node:process';

//type ProfileAvatarSet = FastifyRequest<{ Body: Static<typeof ProfileAvatarSchema>}>;

// const AVATAR_DIR = path.resolve(process.cwd(), "uploads", "avatars");
const AVATAR_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads", "avatars");

const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 4 * 1024 * 1024;

export default async function avatarRoutes(app: FastifyInstance) {
	// Ensure avatar directory exists

	app.put("/api/user/avatar/set", {
		schema: {
			response: {
				200: ProfileAvatarResponseSchema,
				default: ErrorResponseSchema
			},
		},
	},

	async (request: FastifyRequest, reply: FastifyReply) => {
		let filepath: string | null = null;
		try {
			const userId = await verifyAccess(request, reply);
			if (!userId) {
				return;
			}

			const file = await request.file();
			if (!file) {
				return reply.status(400).send(errorResponse(400, "Avatar file is required"));
			}

			if (!ALLOWED_FORMATS.includes(file.mimetype)) {
				return reply.status(400).send(errorResponse(400, "Unsupported image format"));
			}

			const buffer = await file.toBuffer();
			if (buffer.length > MAX_SIZE) {
				return reply.status(400).send(errorResponse(400, "Avatar must be under 4MB"));
			}

			// Resize + normalize
			const avatarBuffer = await sharp(buffer).resize(128, 128).webp({ quality: 80 }).toBuffer();

			const filename = `${uuidv4()}.webp`;
			filepath = path.join(AVATAR_DIR, filename);

			await fs.writeFile(filepath, avatarBuffer);

			// Remove old avatar if exists
			const user = await prisma.user_info.findUnique({
				where: { userId },
				select: { avatarName: true },
			});

			if (user?.avatarName) {
				await fs.unlink(path.join(AVATAR_DIR, user.avatarName)).catch(() => {});
			}

			// Update DB
			const userData = await prisma.user_info.update({
				where: { userId },
				data: { avatarName: filename },
				select: {
					userId: true,
					userName: true,
					avatarName: true,
				}
			});

			return reply.status(200).send(profileAvatarSet(userData));
		} catch (err) {
			console.log(err);
			if (filepath) {
				await fs.unlink(filepath).catch(() => {});
			}
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	}
	);
}
