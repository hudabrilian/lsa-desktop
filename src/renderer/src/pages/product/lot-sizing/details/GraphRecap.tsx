import { Grid, Text } from '@mantine/core'
import AverageInventoryGraph from '@renderer/components/part/graphs/AverageInventoryGraph'
import HoldingCostGraph from '@renderer/components/part/graphs/HoldingCostGraph'
import OrderGraph from '@renderer/components/part/graphs/OrderGraph'
import TotalCostGraph from '@renderer/components/part/graphs/TotalCostGraph'
import { useProductContext } from '@renderer/context/ProductContext'
import { recapData } from '@renderer/utils/mrp'
import { Part } from 'src/preload/types'

export default function GraphRecapTab({ part }: { part: Part }): JSX.Element {
  const { product } = useProductContext()

  if (!product) {
    return <Text>Product not found</Text>
  }

  const data = recapData({ product, part })

  const orderData = data.map((d) => ({
    method: d.method,
    Cost: d.orderCost
  }))

  const holdingCostData = data.map((d) => ({
    method: d.method,
    Cost: d.holdingCost
  }))

  const totalData = data.map((d) => ({
    method: d.method,
    Cost: d.totalCost
  }))

  const avgInvData = data.map((d) => ({
    method: d.method,
    Unit: d.inventory
  }))

  return (
    <Grid grow py="lg">
      <Grid.Col span={6}>
        <OrderGraph data={orderData} />
      </Grid.Col>
      <Grid.Col span={6}>
        <HoldingCostGraph data={holdingCostData} />
      </Grid.Col>
      <Grid.Col span={6}>
        <TotalCostGraph data={totalData} />
      </Grid.Col>
      <Grid.Col span={6}>
        <AverageInventoryGraph data={avgInvData} />
      </Grid.Col>
    </Grid>
  )
}
