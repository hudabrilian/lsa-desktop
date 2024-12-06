import { Button, Code, Group, Stack, Table, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from 'src/preload/types'

export default function ProductList(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([])
  const [selProduct, setSelProduct] = useState<
    | {
        id: string
        name: string
      }
    | undefined
  >()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selProduct) {
      deleteModal()
    }
  }, [selProduct])

  const fetchData = async (): Promise<void> => {
    try {
      const productsData = await window.api.products.getAll()
      setProducts(productsData)
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  const deleteModal = (): void => {
    if (!selProduct) return

    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: (
        <Text size="sm">
          Are you sure to remove product <Code>{selProduct.name}</Code>
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: async () => {
        await window.api.products.delete(selProduct.id)

        fetchData()

        notifications.show({
          title: 'Information',
          message: 'Successfully deleted product'
        })
      }
    })
  }

  return (
    <Stack mt="md">
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product name</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {products.length > 0 &&
            products.map((product) => (
              <Table.Tr key={product.id}>
                <Table.Td>
                  <Text>{product.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Group align="end" justify="end" gap={4}>
                    <Button
                      variant="gradient"
                      component={Link}
                      to={`/product/${product.id}/lot-sizing`}
                    >
                      Lot Sizing
                    </Button>
                    <Button component={Link} to={`/product/${product.id}/info`}>
                      Information
                    </Button>
                    <Button
                      color="red"
                      onClick={() =>
                        setSelProduct({
                          id: product.id,
                          name: product.name
                        })
                      }
                    >
                      Delete
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
        {products.length < 1 && <Table.Caption>Data not found</Table.Caption>}
      </Table>
    </Stack>
  )
}
