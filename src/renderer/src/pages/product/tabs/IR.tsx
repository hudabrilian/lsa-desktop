import { Stack, Title } from '@mantine/core'
import InventoryRecordForm from '@renderer/components/product/IRForm'
import ProductSkeleton from '@renderer/components/ProductSkeleton'
import { useProductContext } from '@renderer/context/ProductContext'

export default function InventoryRecordProductPage(): JSX.Element {
  const { product, isLoading } = useProductContext()

  if (isLoading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <Stack>
      <Title order={2}>Inventory Record product</Title>
      <InventoryRecordForm product={product} />
    </Stack>
  )
}
