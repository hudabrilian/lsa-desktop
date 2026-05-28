import { Stack, Title } from '@mantine/core'
import ProductForm from '@renderer/components/product/Form'

export default function CreateProductPage(): React.JSX.Element {
  return (
    <Stack>
      <Title order={2}>Create Product</Title>
      <ProductForm />
    </Stack>
  )
}
