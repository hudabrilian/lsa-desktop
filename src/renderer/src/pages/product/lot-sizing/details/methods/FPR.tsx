import { Loader, Stack, Text, Title } from '@mantine/core'
import MRPDetail from '@renderer/components/part/MRPDetails'
import MRPTable from '@renderer/components/part/MRPTable'
import { useProductContext } from '@renderer/context/ProductContext'
import { MRPTableData } from '@renderer/types'
import { FPR } from '@renderer/utils/mrp'
import { useEffect, useState } from 'react'
import { Part } from 'src/preload/types'

export default function FPRTable({ part }: { part: Part }): JSX.Element {
  const { product } = useProductContext()
  const [data, setData] = useState<MRPTableData>()

  if (!product) return <Text>Product not found</Text>

  useEffect(() => {
    const calculateData = (): void => {
      const dataMrp = FPR({ product, part })
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
        Fixed Period Replenishment
      </Title>
      <MRPTable data={data} />
      <MRPDetail part={part} data={data} />
    </Stack>
  )
}
