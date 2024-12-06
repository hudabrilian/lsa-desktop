import { Button, Group, Loader, Modal, SimpleGrid, Stack, Table, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import MRPDetail from '@renderer/components/part/MRPDetails'
import MRPTable from '@renderer/components/part/MRPTable'
import { useProductContext } from '@renderer/context/ProductContext'
import { MRPTableData, type LTCTable } from '@renderer/types'
import { LTC } from '@renderer/utils/mrp'
import { useEffect, useState } from 'react'
import { Part } from 'src/preload/types'

export default function LTCTable({ part }: { part: Part }): JSX.Element {
  const { product } = useProductContext()
  const [data, setData] = useState<
    MRPTableData & {
      ltcTable: LTCTable
    }
  >()
  const [opened, { open, close }] = useDisclosure(false)

  if (!product) return <Text>Product not found</Text>

  useEffect(() => {
    const calculateData = (): void => {
      const dataMrp = LTC({ product, part })
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

  return (
    <Stack py={10}>
      <Title order={3} style={{ textAlign: 'center' }}>
        Least Total Cost
      </Title>
      <MRPTable data={data} />

      <Group justify="end" py="sm">
        <Button>Step by step</Button>
        <Button onClick={open}>LTC Table</Button>
      </Group>
      <MRPDetail part={part} data={data} />

      <Modal opened={opened} onClose={close} centered title="LTC Table" size="100%">
        <Stack>
          <Table highlightOnHover withColumnBorders withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>n</Table.Th>
                <Table.Th>T</Table.Th>
                <Table.Th>D</Table.Th>
                <Table.Th>Cum. D</Table.Th>
                <Table.Th>Inc. HC</Table.Th>
                <Table.Th>Cum. HC</Table.Th>
                <Table.Th>TCP</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.ltcTable.n.map((n, index) => {
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
                    <Table.Td>{data.ltcTable.t[index]}</Table.Td>
                    <Table.Td>{data.ltcTable.demand[index]}</Table.Td>
                    <Table.Td>{data.ltcTable.cumulativeDemand[index]}</Table.Td>
                    <Table.Td>{data.ltcTable.totalHoldingCost[index]}</Table.Td>
                    <Table.Td>{data.ltcTable.cumulativeHoldingCost[index]}</Table.Td>
                    <Table.Td>{data.ltcTable.totalCostPeriod[index]}</Table.Td>
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
            <Text>Inc. HC = Total Holding Cost [(T-1) * D * Holding cost per unit per period]</Text>
            <Text>Cum. HC = Cumulative HC</Text>
            <Text>TCP = Total Cost Per Period [(Order Cost + Cum. HC) / T]</Text>
          </SimpleGrid>
        </Stack>
      </Modal>
    </Stack>
  )
}
