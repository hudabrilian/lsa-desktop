import {
  Button,
  Group,
  Loader,
  Modal,
  NumberFormatter,
  Stack,
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

export default function WWATable({ part }: { part: Part }): JSX.Element {
  const { product } = useProductContext()
  const [data, setData] = useState<
    MRPTableData & {
      zTable: number[][]
      fTable: number[][]
    }
  >()
  const [opened, { open, close }] = useDisclosure(false)

  if (!product) return <Text>Product not found</Text>

  useEffect(() => {
    const calculateData = (): void => {
      const dataMrp = WWA({ product, part })
      setData(dataMrp)
    }

    if (!data) {
      calculateData()
    }

    console.log(data?.zTable)
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
        Wagner Whitin Algorithm
      </Title>
      <MRPTable data={data} />

      <Group justify="end" py="sm">
        <Button>Step by step</Button>
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

              {/* //! Change the text below */}
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
    </Stack>
  )
}
