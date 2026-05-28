import { Stack, Title } from '@mantine/core'
import ProductForm from '@renderer/components/product/Form'

export default function CreateProductPage(): React.JSX.Element {
  return (
    <Stack>
      <Title order={2}>Add new Product</Title>
      <ProductForm />
    </Stack>
  )
}
