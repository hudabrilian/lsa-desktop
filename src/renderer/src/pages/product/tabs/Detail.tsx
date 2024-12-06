import { Stack, Title } from '@mantine/core'
import ProductForm from '@renderer/components/product/Form'
import ProductSkeleton from '@renderer/components/ProductSkeleton'
import { useProductContext } from '@renderer/context/ProductContext'

export default function DetailProductTab(): JSX.Element {
  const { product, isLoading } = useProductContext()

  if (isLoading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <Stack>
      <Title order={2}>Info product</Title>
      <ProductForm product={product} />
    </Stack>
  )
}
