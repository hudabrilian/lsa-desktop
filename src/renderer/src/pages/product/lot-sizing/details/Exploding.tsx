import { Box, Paper, Stack, Table, Text } from '@mantine/core'
import { useProductContext } from '@renderer/context/ProductContext'
import { exploding } from '@renderer/utils/mrp'
import { Part } from 'src/preload/types'

export default function ExplodingTab({ part }: { part: Part }): JSX.Element {
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
          <Text>Langkah 1:</Text>
          <Text>POR terpilih material induk (parent): {data.partParent.name}</Text>
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
          <Text>Langkah 2:</Text>
          <Text>
            GR material {part.name} didapatkan dari hasil perkalian antara POR dengan jumlah
            material per induk
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
