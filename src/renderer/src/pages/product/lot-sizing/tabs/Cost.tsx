import { Button, Center, Group, Stack, Table, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import ProductSkeleton from '@renderer/components/ProductSkeleton'
import { useProductContext } from '@renderer/context/ProductContext'
import { recapCostData } from '@renderer/utils/mrp'
import { Link } from 'react-router-dom'

export default function CostProductTab(): React.JSX.Element {
  const { product, isLoading } = useProductContext()

  if (isLoading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  if (product.parts.length < 2) {
    return (
      <Center my="md">
        <Stack align="center">
          <Text>No parts found</Text>
          <Button component={Link} to={`/product/${product.id}/parts`}>
            Add product parts
          </Button>
        </Stack>
      </Center>
    )
  }

  const data = recapCostData({ product })

  return (
    <Stack>
      <Group justify="space-between" py={6}>
        <Text>
          The following cost data represents the lowest total cost from the selected method for each
          material
        </Text>
        <Button
          onClick={() => {
            modals.open({
              title: 'Please choose the desired format',
              centered: true,
              children: (
                <Group grow>
                  <Button onClick={() => modals.closeAll()} mt="md">
                    Excel
                  </Button>
                  <Button onClick={() => modals.closeAll()} mt="md">
                    PDF
                  </Button>
                </Group>
              )
            })
          }}
        >
          Export
        </Button>
      </Group>
      <Table withColumnBorders highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Td>Part Name</Table.Td>
            <Table.Td>Level</Table.Td>
            <Table.Td>Cost</Table.Td>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((d, index) => (
            <Table.Tr key={index}>
              <Table.Td>{d.name}</Table.Td>
              <Table.Td>{d.level}</Table.Td>
              <Table.Td>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0
                }).format(d.cost)}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  )
}
