import { Stack } from '@mantine/core'
import BOMGraph from '@renderer/components/product/BOMGraph'
import ProductSkeleton from '@renderer/components/ProductSkeleton'
import { useProductContext } from '@renderer/context/ProductContext'

export default function BOMProductTab(): JSX.Element {
  const { product, isLoading } = useProductContext()

  if (isLoading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <Stack my="md">
      <BOMGraph product={product} />
    </Stack>
  )
}
