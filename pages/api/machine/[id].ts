// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "../../../src/prisma"
import { tryit } from "../../../src/helper"

import { State, interpret } from "xstate"
import { collatzProblemMachine, CollatzProblemMachineContext, CollatzProblemMachineEvent } from '../../../src/machines/CollatzProblemMachine'

type ResponseData = {
  success: boolean
  message?: string
  data?: {}
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const [, id] = tryit(Number)(req.query.id)
  if (!id) {
    res.status(400).json({ success: false, message: "id is required" })
    return
  }
  switch (req.method) {
    case "GET": {
      const data = await prisma.machine.findUnique({ where: { id } })
      if (!data) {
        res.status(404).json({ success: false, message: "machine not found" })
      } else {
        res.status(200).json({ success: true, data })
      }
      break
    }
    case "POST": {
      const current = await prisma.machine.findUnique({ where: { id } })
      if (!current) {
        res.status(404).json({ success: false, message: "machine not found" })
        return
      }
      const currentState = State.create<CollatzProblemMachineContext, CollatzProblemMachineEvent>(JSON.parse(current.data))
      const service = interpret(collatzProblemMachine).start(currentState)
      service.send("NEXT")
      service.stop()
      const nextStateStr = JSON.stringify(service.getSnapshot())
      const machine = await prisma.machine.update({
        where: { id },
        data: {
          data: nextStateStr
        }
      })
      res.status(200).json({ success: true, data: machine })
      break
    }

    default:
      res.status(400).json({ success: false, message: "method not allowed" })
  }
}