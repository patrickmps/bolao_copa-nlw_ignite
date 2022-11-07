import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data : {
            name: 'Fulano',
            email: 'fulano@gmail.com',
            avatarUrl: 'https://github.com/patrickmps.png',
        }
    })

    const poll = await prisma.poll.create({
        data: {
            title: 'Example Poll',
            code: 'BOL123',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-05T12:00:00.103Z',
            firstTeamCountryCode: 'DE',
            secoundTeamCountryCode: 'BR'
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-04T12:00:00.103Z',
            firstTeamCountryCode: 'BR',
            secoundTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secoundTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_pollId: {
                                userId: user.id,
                                pollId: poll.id
                            }
                        }
                    }
                }
            }
        }
    })


}

main()