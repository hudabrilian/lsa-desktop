import { Button, Group, NumberInput, Stack, TextInput } from '@mantine/core'
import { hasLength, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { nanoid } from 'nanoid'
import { useNavigate } from 'react-router-dom'
import { Product } from 'src/preload/types'

export default function ProductForm({ product }: { product?: Product }): JSX.Element {
  const navigate = useNavigate()

  const form = useForm<Product>({
    mode: 'controlled',
    initialValues: product
      ? product
      : {
          id: nanoid(),
          name: '',
          period: 1,
          lowestLevel: 1,
          parts: [],
          mps: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
    validate: {
      name: hasLength({ min: 2, max: 25 }, 'Name must be at least 2 characters long'),
      period: (value) => (value < 1 ? 'Period must be greater than 1' : null),
      lowestLevel: (value) => (value < 1 ? 'Lowest level must be greater than 1' : null)
    }
  })

  const submitHandler = async (values: Product): Promise<void> => {
    if (product) {
      await window.api.products.update(product.id, {
        ...values,
        updatedAt: new Date()
      })
    } else {
      values.parts.push({
        id: nanoid(),
        name: values.name,
        amount: 1,
        level: 0,
        parent: '',
        inventoryRecord: {
          onHand: 0,
          leadTime: 0,
          orderCost: 0,
          holdingCost: 0,
          orderQuantity: 100,
          orderPeriod: 1,
          scheduleReceipt: []
        }
      })

      await window.api.products.add(values)
    }

    form.setInitialValues(values)

    notifications.show({
      title: 'Information',
      message: `Successfully saved ${values.name} product`
    })

    navigate(product ? `/product/${values.id}/info` : '/product')
  }

  return (
    <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
      <Stack>
        <TextInput
          key={form.key('name')}
          label="Product Name"
          placeholder="Product Name"
          {...form.getInputProps('name')}
        />

        <NumberInput
          key={form.key('period')}
          label="Period"
          placeholder="Period"
          min={1}
          disabled={!!product && !!product.period}
          {...form.getInputProps('period')}
        />

        <NumberInput
          key={form.key('lowestLevel')}
          label="Lowest Level"
          placeholder="Lowest Level"
          min={1}
          max={5}
          disabled={!!product && !!product.lowestLevel}
          {...form.getInputProps('lowestLevel')}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" disabled={!form.isDirty()}>
            {product ? 'Save Changes' : 'Submit'}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
