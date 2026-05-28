import {
  Button,
  Group,
  Loader,
  Modal,
  Paper,
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
import { MRPTableData } from '@renderer/types'
import { EOQ } from '@renderer/utils/mrp'
import { useEffect, useState } from 'react'
import { Part } from 'src/preload/types'
import TeX from '@matejmazur/react-katex'

export default function EOQTable({ part }: { part: Part }): React.JSX.Element {
  const { product } = useProductContext()
  const [data, setData] = useState<
    MRPTableData & { inventory: number; demand: number; eoqValue: number }
  >()
  const [opened, { open, close }] = useDisclosure(false)
  const [activeStep, setActiveStep] = useState(0)

  if (!product) return <Text>Product not found</Text>

  useEffect(() => {
    const calculateData = (): void => {
      const dataMrp = EOQ({ product, part })
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
  const avgDemand = data.demand / product.period

  const eoqKatex = String.raw`
EOQ = \sqrt{\frac{2 \times S \times D}{H}}
=
\sqrt{\frac{
2 \times ${part.inventoryRecord.orderCost}
\times ${avgDemand}
}{
${part.inventoryRecord.holdingCost}
}}
=
${data.eoqValue}
`

  const handleOpen = (): void => {
    setActiveStep(0)
    open()
  }

  return (
    <Stack py={10}>
      <Title order={3} style={{ textAlign: 'center' }}>
        Economic Order Quantity
      </Title>
      <MRPTable data={data} />

      <Group justify="space-between" py="sm">
        <TeX block math={eoqKatex} />
        <Button onClick={handleOpen}>Step by step</Button>
      </Group>
      <MRPDetail part={part} data={data} />

      <Modal opened={opened} onClose={close} centered title="EOQ — Step by Step" size="100%">
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

          <Stepper.Step label="GR" description="Gross Requirements">
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
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="SR" description="Scheduled Receipts">
            <Stack>
              <Title order={4}>Scheduled Receipts (SR)</Title>
              <Text>Scheduled receipts from inventory record.</Text>

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

          <Stepper.Step label="Demand" description="Net demand">
            <Stack>
              <Title order={4}>Net Demand Calculation</Title>

              <Paper p="sm" withBorder>
                <Text>Total Demand = &Sigma;GR &minus; &Sigma;SR</Text>
                <Text fw={700}>Total Demand = {data.demand}</Text>
                <Text mt="sm">Average Demand (D) = Total Demand &divide; Periods</Text>
                <Text fw={700}>
                  D = {data.demand} &divide; {product.period} = {avgDemand}
                </Text>
              </Paper>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="EOQ" description="EOQ formula">
            <Stack>
              <Title order={4}>Economic Order Quantity</Title>

              <Paper p="sm" withBorder>
                <TeX block math={String.raw`EOQ = \sqrt{\frac{2 \times S \times D}{H}}`} />
                <TeX
                  block
                  math={String.raw`
= \sqrt{\frac{
2 \times ${part.inventoryRecord.orderCost}
\times ${avgDemand}
}{
${part.inventoryRecord.holdingCost}
}}
`}
                />
                <TeX block math={String.raw`= ${data.eoqValue}`} />
              </Paper>

              <Stack gap="xs">
                <Text size="sm">S = Order Cost = {part.inventoryRecord.orderCost}</Text>
                <Text size="sm">D = Average Demand = {avgDemand}</Text>
                <Text size="sm">H = Holding Cost = {part.inventoryRecord.holdingCost}</Text>
              </Stack>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="MRP" description="MRP explosion">
            <Stack>
              <Title order={4}>MRP Explosion</Title>

              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Period</Table.Th>
                    <Table.Th>GR</Table.Th>
                    <Table.Th>SR</Table.Th>
                    <Table.Th>POH&minus;1</Table.Th>
                    <Table.Th>NR</Table.Th>
                    <Table.Th>POP</Table.Th>
                    <Table.Th>POH</Table.Th>
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
                        <Table.Td>{data.pop[period]}</Table.Td>
                        <Table.Td>{data.poh[period]}</Table.Td>
                      </Table.Tr>
                    )
                  })}
                </Table.Tbody>
              </Table>

              <Paper p="sm" withBorder>
                <Text size="sm">
                  NR = max(0, GR &minus; SR &minus; POH<sub>prev</sub>)
                </Text>
                <Text size="sm">
                  POP = smallest multiple of EOQ ({data.eoqValue}) &ge; NR (or 0 if NR &le; 0)
                </Text>
                <Text size="sm">
                  POH = POH<sub>prev</sub> + SR + POP &minus; GR
                </Text>
              </Paper>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Offset" description="Lead time offset">
            <Stack>
              <Title order={4}>Lead Time Offset</Title>
              <Text>
                POR<sub>t</sub> = POP<sub>t + LT</sub>
              </Text>
              <Text>LT = {part.inventoryRecord.leadTime}</Text>

              <Table highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Period</Table.Th>
                    <Table.Th>POP</Table.Th>
                    <Table.Th>POR</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Array.from({ length: product.period }, (_, i) => i + 1).map((period) => (
                    <Table.Tr key={period}>
                      <Table.Td>{period}</Table.Td>
                      <Table.Td>{data.pop[period]}</Table.Td>
                      <Table.Td>{data.por[period]}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Summary" description="Final summary">
            <Stack>
              <Title order={4}>Summary</Title>

              <Paper p="sm" withBorder>
                <Table highlightOnHover withColumnBorders withTableBorder>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td fw={700}>EOQ Value</Table.Td>
                      <Table.Td>{data.eoqValue}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={700}>Order Frequency</Table.Td>
                      <Table.Td>{data.frequency}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={700}>Total Demand</Table.Td>
                      <Table.Td>{data.demand}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={700}>Total Inventory (POH)</Table.Td>
                      <Table.Td>{data.inventory}</Table.Td>
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
