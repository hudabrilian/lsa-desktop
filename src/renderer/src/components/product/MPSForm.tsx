import { Box, Button, NumberInput, SimpleGrid, Tooltip } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { Product } from 'src/preload/types'

export default function MPSForm({ product }: { product: Product }): JSX.Element {
  const form = useForm<{
    data: number[]
  }>({
    mode: 'controlled',
    initialValues: {
      data: !product.mps || product.mps.length < 1 ? Array(product.period).fill(0) : product.mps
    },
    validate: {
      data: isNotEmpty('MPS data must be greater than 0')
    }
  })

  const submitHandler = async (values: { data: number[] }): Promise<void> => {
    product.mps = values.data

    await window.api.products.update(product.id, {
      ...product,
      updatedAt: new Date()
    })

    form.setInitialValues(form.values)
    form.resetDirty()

    notifications.show({
      title: 'Information',
      message: 'Product updated successfully'
    })
  }

  return (
    <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
      <SimpleGrid cols={12} my={10}>
        {Array(product.period)
          .fill(0)
          .map((_, index) => (
            <Tooltip key={index} label={form.getInputProps(`data.${index}`).value}>
              <NumberInput
                label={index + 1}
                style={{ textAlign: 'center' }}
                min={0}
                required
                withAsterisk={false}
                hideControls
                {...form.getInputProps(`data.${index}`)}
              />
            </Tooltip>
          ))}
      </SimpleGrid>
      <Box my={10}>
        <Button type="submit" disabled={!form.isDirty()} fullWidth>
          Save changes
        </Button>
      </Box>
      {/* <Code block>{JSON.stringify(form.values.data, null, 2)}</Code> */}
    </form>
  )
}
