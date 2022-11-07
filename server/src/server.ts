import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import dotenv from "dotenv"

import { pollRoutes } from "./routes/poll";
import { userRoutes } from "./routes/user";
import { guessRoutes } from "./routes/guess";
import { gameRoutes } from "./routes/game";
import { authRoutes } from "./routes/auth";

dotenv.config()

async function bootstrap() {
  const fastify = Fastify({
    logger: true, // para o fastify emitir logs
  });

  await fastify.register(fastifyCors, {
    origin: true,
  });

  await fastify.register(fastifyJwt, {
    secret: process.env.SECRET_JWT
  })

  fastify.register(pollRoutes);
  fastify.register(userRoutes);
  fastify.register(guessRoutes);
  fastify.register(gameRoutes);
  fastify.register(authRoutes);

  await fastify.listen({ port: 3006, host: '0.0.0.0' });
}

bootstrap();
