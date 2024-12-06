import { Box, Button, Group, Title } from '@mantine/core'
import ProductList from '@renderer/components/product/List'
import { Link } from 'react-router-dom'

export default function ListProductsPage(): JSX.Element {
  return (
    <Box>
      <Group justify="space-between" align="center">
        <Title order={2}>List Product</Title>
        <Button component={Link} to={`/product/create`}>
          Add new
        </Button>
      </Group>
      <ProductList />
    </Box>
  )
}
