import { Box, Container, VStack, Button, HStack, Heading, Spacer, Text } from "@chakra-ui/react"
import useSWR from "swr"

export default function Home() {
  const { data, error, mutate } = useSWR("/api/machine", (url: string) => fetch(url).then(res => res.json()))

  return (
    <Container mt={6}>
      <HStack>
        <Heading>Test</Heading>
        <Spacer></Spacer>
        <Button
          colorScheme="teal"
          onClick={async () => {
            await fetch("/api/machine", { method: "POST" })
            await mutate()
          }}
        >
          Add
        </Button>
        <Button
          colorScheme="pink"
          onClick={async () => {
            await fetch("/api/machine", { method: "DELETE" })
            await mutate()
          }}
        >
          Clear All
        </Button>
      </HStack>

      {error ? <Box>Error loading data:{JSON.stringify(error)}</Box> : null}
      {!error && !data ? <Box>Loading...</Box> : null}
      {data && (
        <VStack spacing={3} w={"full"} rounded={"md"} m={3} alignItems={"flex-start"}>
          {data?.data &&
            data.data.map((machine: any, index: number) => (
              <HStack key={index}>
                <Button
                  minW={"5rem"}
                  onClick={async () => {
                    await fetch(`/api/machine/${machine.id}`, { method: "POST" })
                    await mutate()
                  }}
                  disabled={JSON.parse(machine.data).context.value == 1}
                >
                  {machine.name}
                </Button>
                <Text>{JSON.parse(machine.data).context.count}</Text> /
                <Text>{JSON.parse(machine.data).context.value}</Text>
              </HStack>
            ))}
        </VStack>
      )}
    </Container>
  )
}
