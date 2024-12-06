import { Button, Group, Loader, Stack, Text, Title } from '@mantine/core'
import MRPDetail from '@renderer/components/part/MRPDetails'
import MRPTable from '@renderer/components/part/MRPTable'
import { useProductContext } from '@renderer/context/ProductContext'
import { MRPTableData } from '@renderer/types'
import { EOQ } from '@renderer/utils/mrp'
import { useEffect, useState } from 'react'
import Latex from 'react-latex-next'
import { Part } from 'src/preload/types'

export default function EOQTable({ part }: { part: Part }): JSX.Element {
  const { product } = useProductContext()
  const [data, setData] = useState<MRPTableData & { demand: number; eoqValue: number }>()

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
        <Title order={3}>Proses menghitung...</Title>
        <Loader color="blue" />
      </Stack>
    )
  }

  const eoqKatex = `EOQ = $\\sqrt{\\frac{2 \\times S \\times D}{H}}$ = $\\sqrt{\\frac{2 \\times ${part.inventoryRecord.orderCost} \\times ${data.demand / product.period}}{${part.inventoryRecord.holdingCost}}}$ = ${data.eoqValue}`

  return (
    <Stack py={10}>
      <Title order={3} style={{ textAlign: 'center' }}>
        Economic Order Quantity
      </Title>
      <MRPTable data={data} />

      <Group justify="space-between" py="sm">
        <Latex strict>{eoqKatex}</Latex>
        <Button>Step by step</Button>
      </Group>
      <MRPDetail part={part} data={data} />
    </Stack>
  )
}
