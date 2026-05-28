import {
  Button,
  Center,
  Group,
  NumberFormatter,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title
} from '@mantine/core'
import BOMGraph from '@renderer/components/product/BOMGraph'
import ProductSkeleton from '@renderer/components/ProductSkeleton'
import { useProductContext } from '@renderer/context/ProductContext'
import { Link } from 'react-router-dom'

export default function SummaryProductTab(): React.JSX.Element {
  const { product, isLoading } = useProductContext()

  if (isLoading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  function InfoSection(): React.JSX.Element {
    if (!product) {
      return <></>
    }

    return (
      <Paper shadow="xs" p="md" withBorder>
        <Group align="start" grow>
          <Stack>
            <Title order={3}>Product Info</Title>
            <SimpleGrid cols={2} spacing="xs" verticalSpacing={4}>
              <Text fw={600}>ID</Text>
              <Text>{product.id}</Text>
              <Text fw={600}>Name</Text>
              <Text>{product.name}</Text>
              <Text fw={600}>Period</Text>
              <Text>{product.period}</Text>
              <Text fw={600}>Lowest Level</Text>
              <Text>{product.lowestLevel}</Text>
              <Text fw={600}>Created At</Text>
              <Text>{new Date(product.createdAt).toLocaleString()}</Text>
              <Text fw={600}>Updated At</Text>
              <Text>{new Date(product.updatedAt).toLocaleString()}</Text>
            </SimpleGrid>
          </Stack>
          <MPSSection />
        </Group>
      </Paper>
    )
  }

  function BOMSection(): React.JSX.Element {
    if (!product) {
      return <></>
    }

    return (
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={3}>Bill of Materials</Title>
          <ScrollArea mah={400}>
            <BOMGraph product={product} />
          </ScrollArea>
        </Stack>
      </Paper>
    )
  }

  function MPSSection(): React.JSX.Element {
    if (!product) {
      return <></>
    }

    return (
      <Stack>
        <Title order={3}>Master Production Schedule</Title>
        {product.mps.length < 1 ? (
          <Center>
            <Stack>
              <Text>No MPS data found</Text>
              <Button variant="gradient" component={Link} to={`/product/${product.id}/mps`}>
                Add MPS
              </Button>
            </Stack>
          </Center>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th fw={600}>Period</Table.Th>
                <Table.Th fw={600}>Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {product.mps.map((data, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>
                    <NumberFormatter value={data} thousandSeparator />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>
    )
  }

  function IRSection(): React.JSX.Element {
    if (!product) {
      return <></>
    }

    if (product.parts.length < 2) {
      return (
        <Paper shadow="xs" p="md" withBorder>
          <Center>
            <Stack>
              <Text>No inventory record data found</Text>
              <Button variant="gradient" component={Link} to={`/product/${product.id}/parts`}>
                Add Parts
              </Button>
            </Stack>
          </Center>
        </Paper>
      )
    }

    return (
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={3}>Inventory Record</Title>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th fw={600}>Part</Table.Th>
                <Table.Th fw={600}>On Hand</Table.Th>
                <Table.Th fw={600}>Lead Time</Table.Th>
                <Table.Th fw={600}>Order Cost</Table.Th>
                <Table.Th fw={600}>Holding Cost</Table.Th>
                <Table.Th fw={600}>Order Quantity (FOQ)</Table.Th>
                <Table.Th fw={600}>Order Period (FPR)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {product.parts.map((part) => (
                <Table.Tr key={part.id}>
                  <Table.Td>{part.name}</Table.Td>
                  <Table.Td>
                    <NumberFormatter value={part.inventoryRecord.onHand} thousandSeparator />
                  </Table.Td>
                  <Table.Td>{part.inventoryRecord.leadTime}</Table.Td>
                  <Table.Td>
                    <NumberFormatter
                      value={part.inventoryRecord.orderCost}
                      prefix="Rp"
                      thousandSeparator
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberFormatter
                      value={part.inventoryRecord.holdingCost}
                      prefix="Rp"
                      thousandSeparator
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberFormatter value={part.inventoryRecord.orderQuantity} thousandSeparator />
                  </Table.Td>
                  <Table.Td>{part.inventoryRecord.orderPeriod}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Paper>
    )
  }

  function SRSection(): React.JSX.Element {
    if (!product || product.parts.length < 2) {
      return <></>
    }

    if (product.parts[0].inventoryRecord.scheduleReceipt.length < 1) {
      return (
        <Paper shadow="xs" p="md" withBorder>
          <Center>
            <Stack>
              <Text>No schedule receipt data found</Text>
            </Stack>
          </Center>
        </Paper>
      )
    }

    return (
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={3}>Schedule Receipt</Title>
          <Table.ScrollContainer minWidth={500}>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fw={600}>Part</Table.Th>
                  <Table.Th align="center" fw={600}>
                    Period
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {product.parts.map((part) => {
                  if (part.inventoryRecord.scheduleReceipt.length < 1) {
                    return <></>
                  }

                  return (
                    <Table.Tr key={part.id}>
                      <Table.Td miw={100}>{part.name}</Table.Td>
                      <Table.Td>
                        <SimpleGrid cols={{ base: 4, sm: 6, md: 8, lg: 12 }} my={10}>
                          {part.inventoryRecord.scheduleReceipt.map((data, index) => (
                            <Paper withBorder key={index} p="sm" shadow="md">
                              <Stack justify="center" align="center" gap="xs">
                                <Text>{index + 1}</Text>
                                <Text>
                                  <NumberFormatter value={data.amount} thousandSeparator />
                                </Text>
                              </Stack>
                            </Paper>
                          ))}
                        </SimpleGrid>
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Stack>
      </Paper>
    )
  }

  return (
    <Stack>
      <Title order={2}>Summary {product.name}</Title>
      <Stack gap="xl">
        <InfoSection />
        <BOMSection />
        <IRSection />
        <SRSection />
      </Stack>
    </Stack>
  )
}
