import { Stack, Title } from '@mantine/core'
import PartForm from '@renderer/components/part/Form'
import ProductSkeleton from '@renderer/components/ProductSkeleton'
import { useProductContext } from '@renderer/context/ProductContext'

export default function PartsProductPage(): JSX.Element {
  const { product, isLoading } = useProductContext()

  if (isLoading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <Stack>
      <Title order={2}>Parts product</Title>
      <PartForm product={product} />
    </Stack>
  )
}
