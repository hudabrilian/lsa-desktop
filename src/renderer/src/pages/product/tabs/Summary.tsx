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

export default function SummaryProductTab(): JSX.Element {
  const { product, isLoading } = useProductContext()

  if (isLoading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  function InfoSection(): JSX.Element {
    if (!product) {
      return <></>
    }

    return (
      <Paper shadow="xs" p="md" withBorder>
        <Group align="start" grow>
          <Stack>
            <Title order={3}>Product Info</Title>
            <Table>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Id</Table.Td>
                  <Table.Td>{product.id}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Name</Table.Td>
                  <Table.Td>{product.name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Period</Table.Td>
                  <Table.Td>{product.period}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Lowest Level</Table.Td>
                  <Table.Td>{product.lowestLevel}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Created At</Table.Td>
                  <Table.Td>{new Date(product.createdAt).toLocaleString()}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Updated At</Table.Td>
                  <Table.Td>{new Date(product.updatedAt).toLocaleString()}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Stack>
          <MPSSection />
        </Group>
      </Paper>
    )
  }

  function BOMSection(): JSX.Element {
    if (!product) {
      return <></>
    }

    return (
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={3}>Bill of Materials</Title>
          <ScrollArea>
            <BOMGraph product={product} />
          </ScrollArea>
        </Stack>
      </Paper>
    )
  }

  function MPSSection(): JSX.Element {
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
              <Button component={Link} to={`/product/${product.id}/mps`}>
                Add MPS
              </Button>
            </Stack>
          </Center>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Title order={4}>Period</Title>
                </Table.Th>
                <Table.Th>
                  <Title order={4}>Amount</Title>
                </Table.Th>
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

  function IRSection(): JSX.Element {
    if (!product || product.parts.length < 2) {
      return <></>
    }

    return (
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={3}>Inventory Record</Title>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Title order={5}>Part</Title>
                </Table.Th>
                <Table.Th>
                  <Title order={5}>On Hand</Title>
                </Table.Th>
                <Table.Th>
                  <Title order={5}>Lead Time</Title>
                </Table.Th>
                <Table.Th>
                  <Title order={5}>Order Cost</Title>
                </Table.Th>
                <Table.Th>
                  <Title order={5}>Holding Cost</Title>
                </Table.Th>
                <Table.Th>
                  <Title order={5}>Order Quantity (FOQ)</Title>
                </Table.Th>
                <Table.Th>
                  <Title order={5}>Order Period (FPR)</Title>
                </Table.Th>
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

  function SRSection(): JSX.Element {
    if (!product || product.parts.length < 2) {
      return <></>
    }

    return (
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={3}>Schedule Receipt</Title>
          <Table.ScrollContainer minWidth={500}>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Title order={4}>Part</Title>
                  </Table.Th>
                  <Table.Th align="center">
                    <Title order={4}>Period</Title>
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
                        <SimpleGrid cols={12} my={10}>
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
