import { Stack, Title } from '@mantine/core'
import MPSForm from '@renderer/components/product/MPSForm'
import ProductSkeleton from '@renderer/components/ProductSkeleton'
import { useProductContext } from '@renderer/context/ProductContext'

export default function MPSProductTab(): JSX.Element {
  const { product, isLoading } = useProductContext()

  if (isLoading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <Stack>
      <Title order={2}>Master Production Schedule product</Title>
      <MPSForm product={product} />
    </Stack>
  )
}
