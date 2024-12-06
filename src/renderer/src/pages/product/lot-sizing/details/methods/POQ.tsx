import { Button, Group, Loader, Stack, Text, Title } from '@mantine/core'
import MRPDetail from '@renderer/components/part/MRPDetails'
import MRPTable from '@renderer/components/part/MRPTable'
import { useProductContext } from '@renderer/context/ProductContext'
import { MRPTableData } from '@renderer/types'
import { POQ } from '@renderer/utils/mrp'
import { useEffect, useState } from 'react'
import Latex from 'react-latex-next'
import { Part } from 'src/preload/types'

export default function POQTable({ part }: { part: Part }): JSX.Element {
  const { product } = useProductContext()
  const [data, setData] = useState<MRPTableData & { demand: number; poqValue: number }>()

  if (!product) return <Text>Product not found</Text>

  useEffect(() => {
    const calculateData = (): void => {
      const dataMrp = POQ({ product, part })
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

  const poqKatex = `POQ = $\\sqrt{\\frac{2\\times S}{D\\times H}}$ = $\\sqrt{\\frac{2 \\times ${part.inventoryRecord.orderCost}}{${data.demand / product.period} \\times ${part.inventoryRecord.holdingCost}}}$ = ${data.poqValue}`

  return (
    <Stack py={10}>
      <Title order={3} style={{ textAlign: 'center' }}>
        Period Order Quantity
      </Title>
      <MRPTable data={data} />

      <Group justify="space-between" py="sm">
        <Latex strict>{poqKatex}</Latex>
        <Button>Step by step</Button>
      </Group>

      <MRPDetail part={part} data={data} />
    </Stack>
  )
}
