// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "../../../src/prisma"

import { interpret } from "xstate"
import { collatzProblemMachine } from '../../../src/machines/CollatzProblemMachine'

type ResponseData = {
  success: boolean
  message?: string
  data?: {}
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  switch (req.method) {
    case "GET": {
      const data = await prisma.machine.findMany()
      res.status(200).json({ success: true, data })
      break
    }
    case "POST": {
      const d = Math.floor(Math.random() * 1000) + 1
      const service = interpret(collatzProblemMachine.withContext({ value: d, count: 0 }))
      await prisma.machine.create({ data: { name: d.toString(), data: JSON.stringify(service.getSnapshot()) } })
      res.status(200).json({ success: true })
      break
    }
    case "DELETE": {
      await prisma.machine.deleteMany()
      res.status(200).json({ success: true })
      break
    }
    default:
      res.status(400).json({ success: false, message: "method not allowed" })
  }
}