import { Stack, Table, Title, Text, Paper } from '@mantine/core'
import { useProductContext } from '@renderer/context/ProductContext'
import { recapData } from '@renderer/utils/mrp'
import { Part } from 'src/preload/types'

export default function CostRecapTab({ part }: { part: Part }): JSX.Element {
  const { product } = useProductContext()

  if (!product) {
    return <Text>Product not found</Text>
  }

  const data = recapData({ part, product })

  const minimumTotalBiaya = data.filter(
    (d) => d.totalCost === Math.min(...data.map((item) => item.totalCost))
  )

  const totalBiayaMinimum = minimumTotalBiaya[0].totalCost

  return (
    <Stack align="center" mt={10}>
      <Title order={3}>Cost Recapitulation</Title>
      <Paper withBorder w="100%">
        <Table withColumnBorders highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Lot Sizing</Table.Th>
              <Table.Th>Order Cost (Rp)</Table.Th>
              <Table.Th>Holding Cost (Rp)</Table.Th>
              <Table.Th>Total Cost (Rp)</Table.Th>
              <Table.Th>Average Inventory</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((d, index) => (
              <Table.Tr
                key={index}
                style={{
                  backgroundColor:
                    minimumTotalBiaya.find((c) => c.method === d.method) && 'slateblue'
                }}
              >
                <Table.Td>{d.method}</Table.Td>
                <Table.Td>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(d.orderCost)}
                </Table.Td>
                <Table.Td>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(d.holdingCost)}
                </Table.Td>
                <Table.Td>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(d.totalCost)}
                </Table.Td>
                <Table.Td>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'decimal',
                    maximumFractionDigits: 3
                  }).format(d.inventory)}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
      <Text>Purple highlight is the lowest total cost of the calculation</Text>
      <Text ta="center">
        Based on the lot sizing calculation results, the lowest total cost for the material{' '}
        {part.name} is
      </Text>
      <Text inline fw="bold" ta="center">
        {new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0
        }).format(totalBiayaMinimum)}
      </Text>
    </Stack>
  )
}
