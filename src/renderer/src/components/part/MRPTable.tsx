import { Paper, Table, Text } from '@mantine/core'
import { useProductContext } from '@renderer/context/ProductContext'
import { MRPTableData } from '@renderer/types'

export default function MRPTablePage({ data }: { data: MRPTableData }): JSX.Element {
  const { product } = useProductContext()

  if (!product) {
    return <Text>Product not found</Text>
  }

  return (
    <Paper shadow="xs" withBorder>
      <Table.ScrollContainer minWidth={1000}>
        <Table withColumnBorders highlightOnHover>
          <Table.Tbody>
            <Table.Tr style={{ textAlign: 'center' }}>
              <Table.Td>Periode</Table.Td>
              {Array(product.period + 1)
                .fill(0)
                .map((_, index) => (
                  <Table.Td key={`periode-${index}`}>
                    <Text>{index}</Text>
                  </Table.Td>
                ))}
            </Table.Tr>
            <Table.Tr style={{ textAlign: 'center' }}>
              <Table.Td>GR</Table.Td>
              {data.gr.map((d, index) => (
                <Table.Td key={`gr-${index}`}>{d}</Table.Td>
              ))}
            </Table.Tr>
            <Table.Tr style={{ textAlign: 'center' }}>
              <Table.Td>SR</Table.Td>
              {data.sr.map((d, index) => (
                <Table.Td key={`sr-${index}`}>{d}</Table.Td>
              ))}
            </Table.Tr>
            <Table.Tr style={{ textAlign: 'center' }}>
              <Table.Td>POH</Table.Td>
              {data.poh.map((d, index) => (
                <Table.Td key={`poh-${index}`}>{d}</Table.Td>
              ))}
            </Table.Tr>
            <Table.Tr style={{ textAlign: 'center' }}>
              <Table.Td>NR</Table.Td>
              {data.nr.map((d, index) => (
                <Table.Td key={`nr-${index}`}>{d}</Table.Td>
              ))}
            </Table.Tr>
            <Table.Tr style={{ textAlign: 'center' }}>
              <Table.Td>POP</Table.Td>
              {data.pop.map((d, index) => (
                <Table.Td key={`pop-${index}`}>{d}</Table.Td>
              ))}
            </Table.Tr>
            <Table.Tr style={{ textAlign: 'center' }}>
              <Table.Td>POR</Table.Td>
              {data.por.map((d, index) => (
                <Table.Td key={`por-${index}`}>{d}</Table.Td>
              ))}
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  )
}
