import { createMachine, MachineConfig, MachineOptions } from "xstate"

export type CollatzProblemMachineContext = {
  value: number
  count: number
}

export type CollatzProblemMachineEvent = {
  type: "NEXT"
}

const config: MachineConfig<CollatzProblemMachineContext, any, CollatzProblemMachineEvent> = {
  predictableActionArguments: true,
  initial: "idle",
  states: {
    idle: {
      on: {
        NEXT: {
          target: "proc",
          actions: "operate",
        }
      }
    },
    proc: {
      always: [
        {
          target: "done",
          cond: "isOne",
        },
        {
          target: "idle",
        }
      ],
    },
    done: { type: "final" }
  }
}

const option: MachineOptions<CollatzProblemMachineContext, CollatzProblemMachineEvent> = {
  guards: {
    isOne: (ctx) => ctx.value === 1
  },
  actions: {
    operate: (ctx) => {
      if (ctx.value % 2) ctx.value = ctx.value * 3 + 1
      else ctx.value = ctx.value / 2
      ctx.count += 1
    }
  }
}

export const collatzProblemMachine = createMachine(config, option)