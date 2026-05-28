import { Box, Button, Group, Title } from '@mantine/core'
import ProductList from '@renderer/components/product/List'
import { Link } from 'react-router-dom'

export default function ListProductsPage(): React.JSX.Element {
  const handleOpenDirectory = async (): Promise<void> => {
    window.api.products.openDirectory()
  }

  return (
    <Box>
      <Group justify="space-between" align="center">
        <Title order={2}>Products</Title>
        <Group>
          <Button onClick={handleOpenDirectory}>Open directory</Button>
          <Button variant="gradient" component={Link} to={`/product/create`}>
            Add Product
          </Button>
        </Group>
      </Group>
      <ProductList />
    </Box>
  )
}
