import {
  Box,
  Button,
  Center,
  Group,
  NumberFormatter,
  NumberInput,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
  Tooltip
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { Link } from 'react-router-dom'
import { Part, Product } from 'src/preload/types'

export default function InventoryRecordForm({ product }: { product: Product }): JSX.Element {
  if (product.parts.length < 2) {
    return (
      <Center>
        <Stack align="center">
          <Text>No parts found</Text>
          <Button component={Link} to={`/product/${product.id}/parts`}>
            Add product parts
          </Button>
        </Stack>
      </Center>
    )
  }

  const form = useForm<{
    data: Part[]
  }>({
    mode: 'controlled',
    initialValues: {
      data: product.parts.map((part) => ({
        ...part,
        inventoryRecord: part.inventoryRecord
          ? {
              ...part.inventoryRecord,
              scheduleReceipt:
                part.inventoryRecord.scheduleReceipt &&
                part.inventoryRecord.scheduleReceipt.length > 0
                  ? part.inventoryRecord.scheduleReceipt
                  : Array(product.period)
                      .fill(0)
                      .map((_, index) => ({
                        period: index + 1,
                        amount: 0
                      }))
            }
          : {
              orderCost: 0,
              holdingCost: 0,
              leadTime: 0,
              onHand: 0,
              orderQuantity: 100,
              orderPeriod: 1,
              scheduleReceipt: Array(product.period)
                .fill(0)
                .map((_, index) => ({
                  period: index + 1,
                  amount: 0
                }))
            }
      }))
    }
  })

  const inventoryRecordFields = (level: number): JSX.Element[] => {
    return form
      .getValues()
      .data.filter((part) => part.level === level)
      .map((part) => {
        const id = form.getValues().data.findIndex((p) => p.id === part.id)

        return (
          <Table.Tr key={part.id} style={{ verticalAlign: 'bottom' }}>
            <Table.Td style={{ verticalAlign: 'middle' }}>{part.name}</Table.Td>
            <Table.Td align="center">
              <Tooltip
                label={
                  <NumberFormatter
                    value={form.getValues().data[id].inventoryRecord.onHand || 0}
                    thousandSeparator
                  />
                }
              >
                <NumberInput
                  allowNegative={false}
                  thousandSeparator=","
                  maw={80}
                  hideControls
                  key={form.key(`data.${id}.inventoryRecord.onHand`)}
                  {...form.getInputProps(`data.${id}.inventoryRecord.onHand`)}
                />
              </Tooltip>
            </Table.Td>
            <Table.Td align="center">
              <Tooltip
                label={
                  <NumberFormatter
                    value={form.getValues().data[id].inventoryRecord.leadTime || 0}
                    thousandSeparator
                  />
                }
              >
                <NumberInput
                  allowNegative={false}
                  thousandSeparator=","
                  maw={80}
                  hideControls
                  key={form.key(`data.${id}.inventoryRecord.leadTime`)}
                  {...form.getInputProps(`data.${id}.inventoryRecord.leadTime`)}
                />
              </Tooltip>
            </Table.Td>
            <Table.Td align="center">
              <Tooltip
                label={
                  <NumberFormatter
                    value={form.getValues().data[id].inventoryRecord.orderCost || 0}
                    prefix="Rp"
                    thousandSeparator
                  />
                }
              >
                <NumberInput
                  allowNegative={false}
                  thousandSeparator=","
                  maw={80}
                  hideControls
                  key={form.key(`data.${id}.inventoryRecord.orderCost`)}
                  {...form.getInputProps(`data.${id}.inventoryRecord.orderCost`)}
                />
              </Tooltip>
            </Table.Td>
            <Table.Td align="center">
              <Tooltip
                label={
                  <NumberFormatter
                    value={form.getValues().data[id].inventoryRecord.holdingCost || 0}
                    prefix="Rp"
                    thousandSeparator
                  />
                }
              >
                <NumberInput
                  allowNegative={false}
                  thousandSeparator=","
                  maw={80}
                  hideControls
                  key={form.key(`data.${id}.inventoryRecord.holdingCost`)}
                  {...form.getInputProps(`data.${id}.inventoryRecord.holdingCost`)}
                />
              </Tooltip>
            </Table.Td>
            <Table.Td align="center">
              <Tooltip
                label={
                  <NumberFormatter
                    value={form.getValues().data[id].inventoryRecord.orderQuantity || 0}
                    thousandSeparator
                  />
                }
              >
                <NumberInput
                  allowNegative={false}
                  thousandSeparator=","
                  maw={80}
                  hideControls
                  min={1}
                  defaultValue={100}
                  description="Default 100"
                  key={form.key(`data.${id}.inventoryRecord.orderQuantity`)}
                  {...form.getInputProps(`data.${id}.inventoryRecord.orderQuantity`)}
                />
              </Tooltip>
            </Table.Td>
            <Table.Td align="center">
              <Tooltip
                label={
                  <NumberFormatter
                    value={form.getValues().data[id].inventoryRecord.orderPeriod || 0}
                    thousandSeparator
                  />
                }
              >
                <NumberInput
                  allowNegative={false}
                  thousandSeparator=","
                  maw={80}
                  hideControls
                  min={1}
                  defaultValue={1}
                  description="Default 1"
                  key={form.key(`data.${id}.inventoryRecord.orderPeriod`)}
                  {...form.getInputProps(`data.${id}.inventoryRecord.orderPeriod`)}
                />
              </Tooltip>
            </Table.Td>
          </Table.Tr>
        )
      })
  }

  const scheduleReceiptFields = (level: number): JSX.Element[] => {
    return form
      .getValues()
      .data.filter((part) => part.level === level)
      .map((part, index) => (
        <Table.Tr key={part.id} style={{ verticalAlign: 'middle' }}>
          <Table.Td colSpan={2}>{part.name}</Table.Td>
          <Table.Td>
            <SimpleGrid cols={12} my={10}>
              {part.inventoryRecord.scheduleReceipt.map((_, index2) => {
                const partIndex = form.getValues().data.findIndex((p) => p.id === part.id)

                const period = form
                  .getValues()
                  .data[
                    index
                  ].inventoryRecord.scheduleReceipt.findIndex((s) => s.period === index2 + 1)

                return (
                  <Tooltip
                    key={`${part.id}-${index2}`}
                    label={
                      <NumberFormatter
                        thousandSeparator
                        value={
                          form.getValues().data[partIndex].inventoryRecord.scheduleReceipt[period]
                            .amount || 0
                        }
                      />
                    }
                  >
                    <NumberInput
                      allowNegative={false}
                      thousandSeparator=","
                      maw={80}
                      hideControls
                      label={index2 + 1}
                      key={form.key(
                        `data.${partIndex}.inventoryRecord.scheduleReceipt.${period}.amount`
                      )}
                      {...form.getInputProps(
                        `data.${partIndex}.inventoryRecord.scheduleReceipt.${period}.amount`
                      )}
                    />
                  </Tooltip>
                )
              })}
            </SimpleGrid>
          </Table.Td>
        </Table.Tr>
      ))
  }

  const submitHandler = async (values: { data: Part[] }): Promise<void> => {
    product.parts = values.data

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
  }

  return (
    <Tabs defaultValue="0">
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
              <Tabs.Panel value={index.toString()} key={index}>
                <Stack>
                  <Stack>
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Part</Table.Th>
                          <Table.Th style={{ textAlign: 'center' }}>On Hand</Table.Th>
                          <Table.Th style={{ textAlign: 'center' }}>Lead Time</Table.Th>
                          <Table.Th style={{ textAlign: 'center' }}>Order Cost</Table.Th>
                          <Table.Th style={{ textAlign: 'center' }}>Holding Cost</Table.Th>
                          <Table.Th style={{ textAlign: 'center' }}>Order Quantity (FOQ)</Table.Th>
                          <Table.Th style={{ textAlign: 'center' }}>Order Period (FPR)</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{inventoryRecordFields(index)}</Table.Tbody>
                    </Table>
                  </Stack>
                  <Stack>
                    <Box>
                      <Title order={2}>Schedule Receipt</Title>
                      <Table highlightOnHover>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th colSpan={2} maw={200} miw={100}>
                              Part
                            </Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>Periode</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{scheduleReceiptFields(index)}</Table.Tbody>
                      </Table>
                    </Box>
                  </Stack>
                </Stack>
              </Tabs.Panel>
            ))}

          <Group justify="center" mt="md">
            <Button type="submit" fullWidth disabled={!form.isDirty()}>
              Save Changes
            </Button>
          </Group>
          {/* <Code block>{JSON.stringify(form.getValues(), null, 2)}</Code> */}
        </Stack>
      </form>
    </Tabs>
  )
}
