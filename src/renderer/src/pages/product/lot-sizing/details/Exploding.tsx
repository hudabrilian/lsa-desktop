import { Box, Paper, Stack, Table, Text } from '@mantine/core'
import { useProductContext } from '@renderer/context/ProductContext'
import { exploding } from '@renderer/utils/mrp'
import { Part } from 'src/preload/types'

export default function ExplodingTab({ part }: { part: Part }): React.JSX.Element {
  const { product } = useProductContext()

  if (!product) {
    return <Text>Product not found</Text>
  }

  if (!part.parent) {
    return <Box>Nothing.</Box>
  }

  const data = exploding({
    product,
    part
  })
  return (
    <Stack my="md">
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Text>Step 1:</Text>
          <Text>Selected POR of the parent material: {data.partParent.name}</Text>
          <Table withColumnBorders highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {Array(product.period)
                  .fill(0)
                  .map((_, index) => (
                    <Table.Th key={index}>{index + 1}</Table.Th>
                  ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                {data.gr.map((val, index) => (
                  <Table.Td key={index}>{val}</Table.Td>
                ))}
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Stack>
      </Paper>
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Text>Step 2:</Text>
          <Text>
            GR for material {part.name} is obtained by multiplying POR by the amount per parent
          </Text>
          <Table withColumnBorders highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {Array(product.period)
                  .fill(0)
                  .map((_, index) => (
                    <Table.Td key={index}>{index + 1}</Table.Td>
                  ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                {data.por.map((val, index) => (
                  <Table.Td key={index}>{val}</Table.Td>
                ))}
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Stack>
      </Paper>
    </Stack>
  )
}
