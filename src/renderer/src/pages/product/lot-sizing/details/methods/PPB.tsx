import {
  Button,
  Group,
  Loader,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Stepper,
  Table,
  Text,
  Title
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import MRPDetail from '@renderer/components/part/MRPDetails'
import MRPTable from '@renderer/components/part/MRPTable'
import { useProductContext } from '@renderer/context/ProductContext'
import { MRPTableData, type PPBTable } from '@renderer/types'
import { PPB } from '@renderer/utils/mrp'
import { useEffect, useState } from 'react'
import { Part } from 'src/preload/types'

export default function PPBTable({ part }: { part: Part }): React.JSX.Element {
  const { product } = useProductContext()
  const [data, setData] = useState<
    MRPTableData & {
      epp: number
      ppbTable: PPBTable
    }
  >()
  const [opened, { open, close }] = useDisclosure(false)
  const [stepsOpened, { open: openSteps, close: closeSteps }] = useDisclosure(false)
  const [activeStep, setActiveStep] = useState(0)

  if (!product) return <Text>Product not found</Text>

  useEffect(() => {
    const calculateData = (): void => {
      const dataMrp = PPB({ product, part })
      setData(dataMrp)
    }

    if (!data) {
      calculateData()
    }
  }, [product, part, data])

  if (!data) {
    return (
      <Stack align="center" justify="center" h={300}>
        <Title order={3}>Calculating...</Title>
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
        Part Period Balancing
      </Title>
      <MRPTable data={data} />

      <Group justify="end" py="sm">
        <Button onClick={handleOpenSteps}>Step by step</Button>
        <Button onClick={open}>PPB Table</Button>
      </Group>
      <MRPDetail part={part} data={data} />

      <Modal opened={opened} onClose={close} centered title="PPB Table" size="100%">
        <Stack>
          <Table highlightOnHover withColumnBorders withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>n</Table.Th>
                <Table.Th>T</Table.Th>
                <Table.Th>D</Table.Th>
                <Table.Th>Cum. D</Table.Th>
                <Table.Th>PP</Table.Th>
                <Table.Th>APP</Table.Th>
                <Table.Th>Note</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.ppbTable.n.map((n, index) => {
                if (n === 0) {
                  return (
                    <Table.Tr key={index}>
                      <Table.Td colSpan={7}></Table.Td>
                    </Table.Tr>
                  )
                }

                return (
                  <Table.Tr key={index}>
                    <Table.Td>{n}</Table.Td>
                    <Table.Td>{data.ppbTable.t[index]}</Table.Td>
                    <Table.Td>{data.ppbTable.demand[index]}</Table.Td>
                    <Table.Td>{data.ppbTable.cumulativeDemand[index]}</Table.Td>
                    <Table.Td>{data.ppbTable.pp[index]}</Table.Td>
                    <Table.Td>{data.ppbTable.app[index]}</Table.Td>
                    <Table.Td>
                      {data.ppbTable.app[index]} {data.ppbTable.app[index] <= data.epp ? '<=' : '>'}{' '}
                      {data.epp}
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>

          <SimpleGrid cols={4} my={10}>
            <Text>n = Period</Text>
            <Text>T = Tentative Period</Text>
            <Text>D = NR value n periode</Text>
            <Text>Cum. D = Cumulative D</Text>
            <Text>PP = (T-1) * D</Text>
            <Text>APP = PP + PPB</Text>
            <Text>EPP = Order Cost / Holding Cost</Text>
          </SimpleGrid>
        </Stack>
      </Modal>

      <Modal
        opened={stepsOpened}
        onClose={closeSteps}
        centered
        title="PPB — Step by Step"
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
                NR<sub>t</sub> = GR<sub>t</sub> &minus; SR<sub>t</sub> &minus; POH
                <sub>t&minus;1</sub>
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
                  {Array.from({ length: product.period }, (_, i) => i + 1).map((period) => {
                    const pohPrev =
                      period === 1 ? part.inventoryRecord.onHand : data.poh[period - 1]

                    return (
                      <Table.Tr key={period}>
                        <Table.Td fw={700}>{period}</Table.Td>
                        <Table.Td>{data.gr[period]}</Table.Td>
                        <Table.Td>{data.sr[period]}</Table.Td>
                        <Table.Td>{pohPrev}</Table.Td>
                        <Table.Td>{data.nr[period]}</Table.Td>
                      </Table.Tr>
                    )
                  })}
                </Table.Tbody>
              </Table>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="EPP" description="Economic Part Period">
            <Stack>
              <Title order={4}>Economic Part Period (EPP)</Title>
              <Paper p="sm" withBorder>
                <Text>EPP = S / H</Text>
                <Text>
                  EPP = {part.inventoryRecord.orderCost} / {part.inventoryRecord.holdingCost} ={' '}
                  {data.epp}
                </Text>
              </Paper>
              <Text size="sm" c="dimmed">
                EPP is the target value. The algorithm tries to make the cumulative part periods
                (APP) as close to EPP as possible.
              </Text>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="PPB Table" description="Trial period calculations">
            <Stack>
              <Title order={4}>PPB Trial Periods</Title>
              <Text>For each trial, PP and APP are computed, then compared to EPP.</Text>
              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>n</Table.Th>
                    <Table.Th>T</Table.Th>
                    <Table.Th>D</Table.Th>
                    <Table.Th>Cum. D</Table.Th>
                    <Table.Th>PP</Table.Th>
                    <Table.Th>APP</Table.Th>
                    <Table.Th>Note</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.ppbTable.n.map((n, index) => {
                    if (n === 0) {
                      return (
                        <Table.Tr key={index}>
                          <Table.Td colSpan={7}></Table.Td>
                        </Table.Tr>
                      )
                    }
                    return (
                      <Table.Tr key={index}>
                        <Table.Td>{n}</Table.Td>
                        <Table.Td>{data.ppbTable.t[index]}</Table.Td>
                        <Table.Td>{data.ppbTable.demand[index]}</Table.Td>
                        <Table.Td>{data.ppbTable.cumulativeDemand[index]}</Table.Td>
                        <Table.Td>{data.ppbTable.pp[index]}</Table.Td>
                        <Table.Td>{data.ppbTable.app[index]}</Table.Td>
                        <Table.Td>
                          {data.ppbTable.app[index]}{' '}
                          {data.ppbTable.app[index] <= data.epp ? '<=' : '>'} {data.epp}
                        </Table.Td>
                      </Table.Tr>
                    )
                  })}
                </Table.Tbody>
              </Table>

              <SimpleGrid cols={2} my={10}>
                <Text size="sm">D = NR at period n + T &minus; 1</Text>
                <Text size="sm">PP = (T &minus; 1) × D</Text>
                <Text size="sm">APP = &Sigma;PP</Text>
                <Text size="sm">EPP = S / H = {data.epp}</Text>
              </SimpleGrid>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Decision" description="Order decision">
            <Stack>
              <Title order={4}>Order Decision Rule</Title>
              <Text>
                Place an order when APP &gt; EPP, using the cumulative demand up to T &minus; 1 (or
                T if T = 1).
              </Text>
              <Paper p="sm" withBorder>
                <Text>EPP = {data.epp}</Text>
                <Text>
                  POP = Cum. D when APP first exceeds EPP (or at the end of planning horizon)
                </Text>
              </Paper>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="MRP & Offset" description="MRP explosion and lead time offset">
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
                  {Array.from({ length: product.period }, (_, i) => i + 1).map((period) => (
                    <Table.Tr key={period}>
                      <Table.Td fw={700}>{period}</Table.Td>
                      <Table.Td>{data.pop[period]}</Table.Td>
                      <Table.Td>{data.poh[period]}</Table.Td>
                      <Table.Td>{data.por[period]}</Table.Td>
                    </Table.Tr>
                  ))}
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
                      <Table.Td fw={700}>EPP</Table.Td>
                      <Table.Td>{data.epp}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={700}>Order Frequency</Table.Td>
                      <Table.Td>{data.frequency}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={700}>Total Inventory (POH)</Table.Td>
                      <Table.Td>{data.poh.reduce((a, b) => a + b, 0)}</Table.Td>
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
            onClick={() => setActiveStep((prev) => Math.min(totalSteps - 1, prev + 1))}
            disabled={activeStep === totalSteps - 1}
          >
            Next
          </Button>
        </Group>
      </Modal>
    </Stack>
  )
}
