import {
  Button,
  Group,
  Loader,
  Modal,
  NumberFormatter,
  Paper,
  Stack,
  Stepper,
  Table,
  Tabs,
  Text,
  Title
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import MRPDetail from '@renderer/components/part/MRPDetails'
import MRPTable from '@renderer/components/part/MRPTable'
import { useProductContext } from '@renderer/context/ProductContext'
import { MRPTableData } from '@renderer/types'
import { WWA } from '@renderer/utils/mrp'
import { useEffect, useState } from 'react'
import { Part } from 'src/preload/types'

export default function WWATable({ part }: { part: Part }): React.JSX.Element {
  const { product } = useProductContext()
  const [data, setData] = useState<
    MRPTableData & {
      zTable: number[][]
      fTable: number[][]
    }
  >()
  const [opened, { open, close }] = useDisclosure(false)
  const [stepsOpened, { open: openSteps, close: closeSteps }] = useDisclosure(false)
  const [activeStep, setActiveStep] = useState(0)

  if (!product) return <Text>Product not found</Text>

  useEffect(() => {
    const calculateData = (): void => {
      const dataMrp = WWA({ product, part })
      setData(dataMrp)
    }

    if (!data) {
      calculateData()
    }
  }, [product, part, data])

  if (!data) {
    return (
      <Stack align="center" justify="center" h={300}>
        <Title order={3}>Proses menghitung...</Title>
        <Loader color="blue" />
      </Stack>
    )
  }

  const totalSteps = 8

  const handleOpenSteps = (): void => {
    setActiveStep(0)
    openSteps()
  }

  return (
    <Stack py={10}>
      <Title order={3} style={{ textAlign: 'center' }}>
        Wagner Whitin Algorithm
      </Title>
      <MRPTable data={data} />

      <Group justify="end" py="sm">
        <Button onClick={handleOpenSteps}>Step by step</Button>
        <Button onClick={open}>Z and F Table</Button>
      </Group>
      <MRPDetail part={part} data={data} />

      <Modal opened={opened} onClose={close} centered title="WWA Table" size="100%">
        <Tabs defaultValue="z">
          <Tabs.List>
            <Tabs.Tab value="z">Z Table</Tabs.Tab>
            <Tabs.Tab value="f">F Table</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="z">
            <Stack>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Z(c,e)</Table.Th>
                    {Array(product.period)
                      .fill(0)
                      .map((_, index) => (
                        <Table.Th key={`z-${index}`}>{index + 1}</Table.Th>
                      ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.zTable.map((row, index) => (
                    <Table.Tr key={`z-${index}`}>
                      {row.map((value, index) => (
                        <Table.Td key={`z-${index}`}>
                          {value > 0 ? <NumberFormatter value={value} thousandSeparator /> : ''}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Stack>
                <Text>
                  Z(c,e) is the total cost of ordering items in period c to meet the needs from
                  period c to period e
                </Text>
                <Text>
                  For example, if period c = 1 and period e = 2, then Z(1,2) is the total cost of
                  ordering items in period 1 to meet the needs from period 1 to period 2
                </Text>
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="f">
            <Stack>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>F(c,e)</Table.Th>
                    {Array(product.period)
                      .fill(0)
                      .map((_, index) => (
                        <Table.Th key={`f-${index}`}>{index + 1}</Table.Th>
                      ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.fTable.map((row, index) => (
                    <Table.Tr key={`f-${index}`}>
                      {row.map((value, index) => (
                        <Table.Td key={`f-${index}`}>
                          {value > 0 ? <NumberFormatter value={value} thousandSeparator /> : ''}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Stack>
                <Text>
                  F(c,e) is the total cost of ordering items in period c to meet the needs from
                  period c to period e
                </Text>
                <Text>
                  For example, if period c = 1 and period e = 2, then F(1,2) is the total cost of
                  ordering items in period 1 to meet the needs from period 1 to period 2
                </Text>
              </Stack>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Modal>

      <Modal
        opened={stepsOpened}
        onClose={closeSteps}
        centered
        title="WWA — Step by Step"
        size="100%"
      >
        <Stepper active={activeStep} onStepClick={setActiveStep}>
          <Stepper.Step label="Parameter" description="Input parameters">
            <Stack>
              <Title order={4}>Input Parameters</Title>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td fw={700}>Order Cost (S)</Table.Td>
                    <Table.Td>{part.inventoryRecord.orderCost}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={700}>Holding Cost (H)</Table.Td>
                    <Table.Td>{part.inventoryRecord.holdingCost}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={700}>Lead Time (LT)</Table.Td>
                    <Table.Td>{part.inventoryRecord.leadTime}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={700}>Initial Inventory</Table.Td>
                    <Table.Td>{part.inventoryRecord.onHand}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={700}>Number of Periods</Table.Td>
                    <Table.Td>{product.period}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={700}>Amount per Part</Table.Td>
                    <Table.Td>{part.amount}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Title order={5} mt="md">
                Master Production Schedule (MPS)
              </Title>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    {Array.from({ length: product.period }, (_, i) => (
                      <Table.Th key={i}>Period {i + 1}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    {product.mps.map((val, i) => (
                      <Table.Td key={i}>{val}</Table.Td>
                    ))}
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="GR & SR" description="Gross Requirements & Scheduled Receipts">
            <Stack>
              <Title order={4}>Gross Requirements (GR)</Title>
              <Text>
                GR<sub>t</sub> = MPS<sub>t</sub> × Amount per Part
              </Text>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    {Array.from({ length: product.period }, (_, i) => (
                      <Table.Th key={i}>Period {i + 1}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    {data.gr.slice(1).map((val, i) => (
                      <Table.Td key={i}>{val}</Table.Td>
                    ))}
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Title order={4} mt="md">
                Scheduled Receipts (SR)
              </Title>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    {Array.from({ length: product.period }, (_, i) => (
                      <Table.Th key={i}>Period {i + 1}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    {data.sr.slice(1).map((val, i) => (
                      <Table.Td key={i}>{val}</Table.Td>
                    ))}
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="NR" description="Net Requirements">
            <Stack>
              <Title order={4}>Net Requirements (NR)</Title>
              <Text>
                NR<sub>t</sub> = GR<sub>t</sub> &minus; SR<sub>t</sub> &minus; POH<sub>t&minus;1</sub>
              </Text>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Period</Table.Th>
                    <Table.Th>GR</Table.Th>
                    <Table.Th>SR</Table.Th>
                    <Table.Th>POH&minus;1</Table.Th>
                    <Table.Th>NR</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Array.from({ length: product.period }, (_, i) => i + 1).map(
                    (period) => {
                      const pohPrev =
                        period === 1
                          ? part.inventoryRecord.onHand
                          : data.poh[period - 1]

                      return (
                        <Table.Tr key={period}>
                          <Table.Td fw={700}>{period}</Table.Td>
                          <Table.Td>{data.gr[period]}</Table.Td>
                          <Table.Td>{data.sr[period]}</Table.Td>
                          <Table.Td>{pohPrev}</Table.Td>
                          <Table.Td>{data.nr[period]}</Table.Td>
                        </Table.Tr>
                      )
                    }
                  )}
                </Table.Tbody>
              </Table>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Z Table" description="Z(c,e) cost matrix">
            <Stack>
              <Title order={4}>Z Table — Cost Matrix</Title>
              <Text>
                Z(c,e) is the total cost of ordering in period c to cover
                periods c through e.
              </Text>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Z(c,e)</Table.Th>
                    {Array(product.period)
                      .fill(0)
                      .map((_, index) => (
                        <Table.Th key={`z-${index}`}>{index + 1}</Table.Th>
                      ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.zTable.map((row, index) => (
                    <Table.Tr key={`z-${index}`}>
                      {row.map((value, index) => (
                        <Table.Td key={`z-${index}`}>
                          {value > 0 ? (
                            <NumberFormatter value={value} thousandSeparator />
                          ) : (
                            ''
                          )}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Paper p="sm" withBorder>
                <Text size="sm">
                  Z(c,c) = S = {part.inventoryRecord.orderCost}
                </Text>
                <Text size="sm">
                  Z(c,e) = (e &minus; c) × NR<sub>e</sub> × H + Z(c, e &minus;
                  1)
                </Text>
              </Paper>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="F Table" description="F(c,e) and Fmin">
            <Stack>
              <Title order={4}>F Table — Minimum Cost</Title>
              <Text>
                F(c,e) = Z(c,e) + Fmin(c &minus; 1). The smallest F(c,e) for
                each column e becomes Fmin(e) with R(e) = c.
              </Text>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>F(c,e)</Table.Th>
                    {Array(product.period)
                      .fill(0)
                      .map((_, index) => (
                        <Table.Th key={`f-${index}`}>{index + 1}</Table.Th>
                      ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.fTable.map((row, index) => (
                    <Table.Tr key={`f-${index}`}>
                      {row.map((value, index) => (
                        <Table.Td key={`f-${index}`}>
                          {value > 0 ? (
                            <NumberFormatter value={value} thousandSeparator />
                          ) : (
                            ''
                          )}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Paper p="sm" withBorder>
                <Text size="sm">
                  F(c,e) = Z(c,e) + Fmin(c &minus; 1)
                </Text>
                <Text size="sm">
                  Fmin(e) = min F(c,e) across all c for column e
                </Text>
              </Paper>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Backtrack" description="Order placement">
            <Stack>
              <Title order={4}>Backtrack — Determining Order Periods</Title>
              <Text>
                Starting from the last period, use R(e) to find where each order
                is placed. R(e) gives the period c where an order covers up to
                period e.
              </Text>
              <Paper p="sm" withBorder>
                <Text size="sm">
                  POP<sub>R(e)</sub> = &Sigma;NR from R(e) to e
                </Text>
                <Text size="sm">
                  Then set e = R(e) &minus; 1 and repeat until e &lt; 1.
                </Text>
              </Paper>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="MRP & Offset" description="MRP explosion and POR">
            <Stack>
              <Title order={4}>MRP Explosion &amp; Lead Time Offset</Title>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Period</Table.Th>
                    <Table.Th>POP</Table.Th>
                    <Table.Th>POH</Table.Th>
                    <Table.Th>POR</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Array.from({ length: product.period }, (_, i) => i + 1).map(
                    (period) => (
                      <Table.Tr key={period}>
                        <Table.Td fw={700}>{period}</Table.Td>
                        <Table.Td>{data.pop[period]}</Table.Td>
                        <Table.Td>{data.poh[period]}</Table.Td>
                        <Table.Td>{data.por[period]}</Table.Td>
                      </Table.Tr>
                    )
                  )}
                </Table.Tbody>
              </Table>

              <Paper p="sm" withBorder>
                <Text size="sm">
                  POH = POH<sub>prev</sub> + SR + POP &minus; GR
                </Text>
                <Text size="sm">
                  POR<sub>t</sub> = POP<sub>t + LT</sub>
                </Text>
                <Text size="sm">LT = {part.inventoryRecord.leadTime}</Text>
              </Paper>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Summary" description="Final summary">
            <Stack>
              <Title order={4}>Summary</Title>
              <Paper p="sm" withBorder>
                <Table highlightOnHover withColumnBorders withTableBorder>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td fw={700}>Order Frequency</Table.Td>
                      <Table.Td>{data.frequency}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={700}>Total Inventory (POH)</Table.Td>
                      <Table.Td>
                        {data.poh.reduce((a, b) => a + b, 0)}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Paper>
            </Stack>
          </Stepper.Step>
        </Stepper>

        <Group justify="center" mt="xl">
          <Button
            variant="default"
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setActiveStep((prev) => Math.min(totalSteps - 1, prev + 1))
            }
            disabled={activeStep === totalSteps - 1}
          >
            Next
          </Button>
        </Group>
      </Modal>
    </Stack>
  )
}
