import { Box, Button, Group, Title } from '@mantine/core'
import ProductList from '@renderer/components/product/List'
import { Link } from 'react-router-dom'

export default function ListProductsPage(): JSX.Element {
  const handleOpenDirectory = async (): Promise<void> => {
    window.api.products.openDirectory()
  }

  return (
    <Box>
      <Group justify="space-between" align="center">
        <Title order={2}>List Product</Title>
        <Group>
          <Button onClick={handleOpenDirectory}>Open directory</Button>
          <Button component={Link} to={`/product/create`}>
            Add new
          </Button>
        </Group>
      </Group>
      <ProductList />
    </Box>
  )
}
