import { FastifyInstance } from "fastify";
import { date, z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  fastify.post(
    "/polls/:pollId/games/:gameId/guesses",
    { onRequest: [authenticate] },
    async (req, res) => {
      const creatGuessParams = z.object({
        pollId: z.string(),
        gameId: z.string(),
      })

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secoundTeamPoints: z.number(),
      })

      const { pollId, gameId } = creatGuessParams.parse(req.params)
      const { firstTeamPoints, secoundTeamPoints } = createGuessBody.parse(req.body)

      const participant = await prisma.participant.findUnique({
        where: {
          userId_pollId: {
            pollId,
            userId: req.user.sub,
          }
        }
      })

      if(!participant) {
        return res.status(400).send({
          message: "You're not allowed to create a guess inside this poll."
        })
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          }
        }
      })

      if(guess) {
        return res.status(400).send({
          message: "You already sent a guess to this game on this poll."
        })
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        }
      })

      if(!game) {
        return res.status(400).send({
          message: "Game not found."
        })
      }

      if(game.date < new Date()) {
        return res.status(400).send({
          message: "You cannot send guesses after the game date."
        })
      }

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          firstTeamPoints,
          secoundTeamPoints,
        }
      })

      return res.status(201).send()
    }
  );
}
