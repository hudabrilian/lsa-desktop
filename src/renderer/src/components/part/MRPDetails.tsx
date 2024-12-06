import { Stack, Title, Text, Group, Table, Paper } from '@mantine/core'
import { useProductContext } from '@renderer/context/ProductContext'
import { MRPTableData } from '@renderer/types'
import { sum } from 'mathjs'
import { Part } from 'src/preload/types'

export default function MRPDetail({ part, data }: { part: Part; data: MRPTableData }): JSX.Element {
  const { product } = useProductContext()

  if (!product) {
    return <Text>Product not found</Text>
  }

  const poh = [...data.poh]
  poh[0] = 0

  const costData = {
    orderCost: part.inventoryRecord.orderCost,
    holdingCost: part.inventoryRecord.holdingCost,
    totalPOH: sum(poh),
    frequencyOrder: data.frequency,
    totalOrderCost: part.inventoryRecord.orderCost * data.frequency,
    totalHoldingCost: part.inventoryRecord.holdingCost * sum(poh),
    totalCost:
      part.inventoryRecord.orderCost * data.frequency + part.inventoryRecord.holdingCost * sum(poh),
    averageInventory: sum(poh) / product.period
  }

  return (
    <Stack>
      <Group justify="space-between" align="flex-start" grow>
        <Paper shadow="xs" p="md" withBorder>
          <Stack>
            <Title order={3}>Data</Title>
            <Table highlightOnHover>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Order Cost (S)</Table.Td>
                  <Table.Td>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0
                    }).format(costData.orderCost)}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Holding Cost (H)</Table.Td>
                  <Table.Td>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0
                    }).format(costData.holdingCost)}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Total POH</Table.Td>
                  <Table.Td>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'decimal',
                      maximumFractionDigits: 3
                    }).format(costData.totalPOH)}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Order Frequency</Table.Td>
                  <Table.Td>{costData.frequencyOrder}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Stack>
        </Paper>
        <Paper shadow="xs" p="md" withBorder>
          <Stack>
            <Title order={3}>Cost Calculation</Title>
            <Table highlightOnHover>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Total Order Cost</Table.Td>
                  <Table.Td>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0
                    }).format(costData.totalOrderCost)}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Total Holding Cost</Table.Td>
                  <Table.Td>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0
                    }).format(costData.totalHoldingCost)}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Total Cost</Table.Td>
                  <Table.Td>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0
                    }).format(costData.totalCost)}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Average Inventory</Table.Td>
                  <Table.Td>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'decimal',
                      maximumFractionDigits: 3
                    }).format(costData.averageInventory)}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Stack>
        </Paper>
      </Group>
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={3}>Notes</Title>
          <Table highlightOnHover>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Total Order Cost</Table.Td>
                <Table.Td>
                  <Text>Order Cost x Order Frequency</Text>
                </Table.Td>
                <Table.Td>
                  <Text>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0
                    }).format(costData.orderCost)}{' '}
                    x {data.frequency}
                  </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Total Holding Cost</Table.Td>
                <Table.Td>
                  <Text>Holding Cost x Total POH</Text>
                </Table.Td>
                <Table.Td>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(costData.holdingCost)}{' '}
                  x{' '}
                  {new Intl.NumberFormat('id-ID', {
                    style: 'decimal',
                    maximumFractionDigits: 3
                  }).format(costData.totalPOH)}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Total Cost</Table.Td>
                <Table.Td>
                  <Text>Total Order Cost + Total Holding Cost</Text>
                </Table.Td>
                <Table.Td>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(costData.totalOrderCost)}{' '}
                  +{' '}
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(costData.totalHoldingCost)}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Average Inventory</Table.Td>
                <Table.Td>
                  <Text>Total POH / Periode</Text>
                </Table.Td>
                <Table.Td>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'decimal',
                    maximumFractionDigits: 3
                  }).format(costData.totalPOH)}{' '}
                  / {product.period}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Stack>
      </Paper>
    </Stack>
  )
}
