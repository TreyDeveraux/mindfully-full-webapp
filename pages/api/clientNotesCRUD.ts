import { NotAllowedIcon } from '@chakra-ui/icons'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, note } = req.body

  if (req.method === 'POST') {
    const notes = await prisma.clientNotes.create({
      data: {
        note: note.toLowerCase(),
      },
    })

    const client = await prisma.client.update({
      where: {
        id: id,
      },
      data: {
        notes: {
          connect: {
            id: notes.id,
          },
        },
      },
    })
    console.log(client, notes)
    return res.status(200).json({ client, notes })
  }

  if (req.method === 'PATCH') {
    const notes = await prisma.clientNotes.update({
      where: {
        id,
      },
      data: {
        note: note,
      },
    })
    return res.status(200).json(notes)
  }

  if (req.method === 'DELETE') {
    const notes = await prisma.clientNotes.delete({
      where: {
        id,
      },
    })
    return res.status(200).json(notes)
  }
}
