import { Paper, Stack, Table, Text, Title } from '@mantine/core'
import { useProductContext } from '@renderer/context/ProductContext'
import { selectedPOR } from '@renderer/utils/mrp'
import { Part } from 'src/preload/types'

export default function SelectedPORTab({ part }: { part: Part }): JSX.Element {
  const { product } = useProductContext()

  if (!product) {
    return <Text>Product not found</Text>
  }

  const por = selectedPOR({ product, part })
  por.shift()

  return (
    <Stack py={10}>
      <Title order={3} style={{ textAlign: 'center' }}>
        POR Terpilih
      </Title>
      <Paper withBorder>
        <Table withColumnBorders highlightOnHover>
          <Table.Tbody>
            <Table.Tr style={{ textAlign: 'center' }}>
              <Table.Td>Periode</Table.Td>
              {Array(product.period)
                .fill(0)
                .map((_, index) => (
                  <Table.Td key={`periode-${index}`}>
                    <Text>{index + 1}</Text>
                  </Table.Td>
                ))}
            </Table.Tr>
            <Table.Tr style={{ textAlign: 'center' }}>
              <Table.Td>NR</Table.Td>
              {por.map((d, index) => (
                <Table.Td key={`nr-${index}`}>{d}</Table.Td>
              ))}
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
      <Text style={{ textAlign: 'center' }}>
        POR Terpilih akan menjadi GR untuk material pada level di bawahnya melalui proses exploding
      </Text>
    </Stack>
  )
}
