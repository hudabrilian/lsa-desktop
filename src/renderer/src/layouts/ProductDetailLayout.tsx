import { Button, Group, Stack, Title } from '@mantine/core'
import SetProduct from '@renderer/components/product/SetProduct'
import { ProductProvider, useProductContext } from '@renderer/context/ProductContext'
import { ArrowLeft } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

export default function ProductDetailLayout(): JSX.Element {
  return (
    <ProductProvider>
      <SetProduct />
      <Stack gap="md">
        <ProductDetailHeader />
        <Outlet />
      </Stack>
    </ProductProvider>
  )
}

export function ProductDetailHeader(): JSX.Element {
  const { product } = useProductContext()

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <Group>
      <Button component={Link} to="/product" size="compact-sm" variant="light">
        <ArrowLeft strokeWidth="1.5px" size="1.3rem" />
      </Button>
      <Title order={2}>{product.name}</Title>
    </Group>
  )
}
