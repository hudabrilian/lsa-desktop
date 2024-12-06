import { Button, Group, NativeSelect, NumberInput, Stack, Tabs, TextInput } from '@mantine/core'
import { hasLength, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useProductContext } from '@renderer/context/ProductContext'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { Part, Product } from 'src/preload/types'

export default function PartForm({ product }: { product: Product }): JSX.Element {
  const [activeTab, setActiveTab] = useState<string | null>('0')
  const { setProductData } = useProductContext()

  const initialParts: Part[] = product.parts
  const formParts: Part[] = initialParts.concat(
    Array(product.lowestLevel)
      .fill(0)
      .map((_, index) => ({
        id: nanoid(),
        name: '',
        amount: 1,
        level: index + 1,
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
      }))
  )

  const form = useForm<{
    parts: Part[]
  }>({
    name: 'part-form',
    mode: 'controlled',
    initialValues: {
      parts: initialParts.length < 2 ? formParts : initialParts
    },
    validate: {
      parts: {
        name: hasLength({ min: 2, max: 25 }, 'Name must be at least 2 characters long'),
        amount: (value) => (value < 1 ? 'Part amount must be greater than 1' : null)
      }
    }
  })

  const submitHandler = async (values: { parts: Part[] }): Promise<void> => {
    product.parts = values.parts

    await window.api.products.update(product.id, {
      ...product,
      updatedAt: new Date()
    })
    form.setInitialValues(form.values)
    form.resetDirty()

    notifications.show({
      title: 'Information',
      message: `Product updated successfully`
    })

    setProductData(product)
  }

  return (
    <Tabs defaultValue="0" onChange={setActiveTab}>
      <Tabs.List>
        {Array(product!.lowestLevel + 1)
          .fill(0)
          .map((_, index) => (
            <Tabs.Tab key={`tab-${index}`} value={`${index}`}>
              Level {index}
            </Tabs.Tab>
          ))}
      </Tabs.List>

      <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
        <Stack>
          {Array(product!.lowestLevel + 1)
            .fill(0)
            .map((_, index) => (
              <Tabs.Panel key={`panel-${index}`} value={`${index}`}>
                <Stack mt="sm">
                  {form.values.parts
                    .filter((p) => p.level === index)
                    .map((part, index2) => {
                      const id = form.values.parts.findIndex((p) => p.id === part.id)

                      return (
                        <Group
                          grow
                          preventGrowOverflow={false}
                          key={`part-${index}-${part.id}-group`}
                          align="start"
                        >
                          <TextInput
                            key={`part-${index}-${part.id}-name`}
                            label={`Nama Part ${index2 + 1}`}
                            placeholder={`Part ke-${index2 + 1} Level ${index}`}
                            disabled={index === 0}
                            {...form.getInputProps(`parts.${id}.name`)}
                          />

                          {part.level !== 0 && (
                            <NativeSelect
                              key={`part-${index}-${part.id}-parent`}
                              label={`Parent Part ${index2 + 1}`}
                              disabled={index === 0}
                              {...form.getInputProps(`parts.${id}.parent`)}
                            >
                              <option value="" disabled>
                                Parent
                              </option>
                              {form.values.parts
                                .filter((p) => p.name)
                                .filter((p) => p.id !== part.id)
                                .filter((p) => p.level === part.level - 1)
                                .map((part) => (
                                  <option key={part.id} value={part.id}>
                                    {part.name}
                                  </option>
                                ))}
                            </NativeSelect>
                          )}

                          <NumberInput
                            maw={200}
                            key={`part-${index}-${part.id}-amount`}
                            label={`Amount Part ${index2 + 1}`}
                            placeholder={`Part ke-${index2 + 1} Level ${index + 1}`}
                            disabled={index === 0}
                            {...form.getInputProps(`parts.${id}.amount`)}
                          />

                          <Button
                            size="compact-xs"
                            variant="outline"
                            maw={30}
                            onClick={() => {
                              form.removeListItem(`parts`, id)
                            }}
                            disabled={index2 === 0}
                            mt="xl"
                          >
                            X
                          </Button>
                        </Group>
                      )
                    })}
                </Stack>
              </Tabs.Panel>
            ))}

          <Stack gap={0}>
            {parseInt(activeTab!) > 0 && (
              <Group justify="center">
                <Button
                  disabled={parseInt(activeTab!) < 1}
                  hidden={parseInt(activeTab!) < 1}
                  variant="light"
                  fullWidth
                  onClick={() => {
                    form.insertListItem('parts', {
                      id: nanoid(),
                      name: '',
                      amount: 1,
                      level: parseInt(activeTab!),
                      parent: ''
                      //   inventoryRecord: {
                      //     onHand: 0,
                      //     leadTime: 0,
                      //     biayaPesan: 0,
                      //     biayaSimpan: 0,
                      //     orderQuantity: 100,
                      //     periodeOrder: 1,
                      //     scheduleReceipt: []
                      //   }
                    })
                  }}
                >
                  Add part
                </Button>
              </Group>
            )}
            <Group justify="center" mt="md">
              <Button type="submit" fullWidth disabled={!form.isDirty()}>
                Save Changes
              </Button>
            </Group>

            {/* <Code mt="lg" block>
              {JSON.stringify(form.values.parts, null, 2)}
            </Code> */}
          </Stack>
        </Stack>
      </form>
    </Tabs>
  )
}
