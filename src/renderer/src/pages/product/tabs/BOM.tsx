import { ScrollAreaAutosize, Stack, Title } from '@mantine/core'
import BOMGraph from '@renderer/components/product/BOMGraph'
import ProductSkeleton from '@renderer/components/ProductSkeleton'
import { useProductContext } from '@renderer/context/ProductContext'

export default function BOMProductPage(): JSX.Element {
  const { product, isLoading } = useProductContext()

  if (isLoading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <Stack>
      <Title order={2}>Bill of Materials product</Title>
      <ScrollAreaAutosize>
        <BOMGraph product={product} />
      </ScrollAreaAutosize>
    </Stack>
  )
}
