import { Button, Center, Group, Stack, Table, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import ProductSkeleton from '@renderer/components/ProductSkeleton'
import { useProductContext } from '@renderer/context/ProductContext'
import { recapPORData } from '@renderer/utils/mrp'
import { Link } from 'react-router-dom'

export default function PORProductTab(): JSX.Element {
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

  const data = recapPORData({ product })

  return (
    <Stack>
      <Group justify="space-between" py={6}>
        <Text>
          Data Planned Order Release berikut merupakan jumlah POR setiap material dengan total biaya
          terkecil
        </Text>
        <Button
          onClick={() => {
            modals.open({
              title: 'Silahkan pilih format yang diinginkan',
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
            <Table.Td>Nama Part</Table.Td>
            <Table.Td>Level</Table.Td>
            {Array(product.period)
              .fill(0)
              .map((_, index) => (
                <Table.Td key={index}>{index + 1}</Table.Td>
              ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((d, index) => (
            <Table.Tr key={index}>
              <Table.Td>{d.name}</Table.Td>
              <Table.Td>{d.level}</Table.Td>
              {d.por.map((p, index) => (
                <Table.Td key={index}>{p}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  )
}
