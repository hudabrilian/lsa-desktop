import { BarChart } from '@mantine/charts'
import { Card, Text } from '@mantine/core'

export default function AverageInventoryGraph({
  data
}: {
  data: {
    method: string
    Unit: number
  }[]
}): React.JSX.Element {
  const minimumCost = data.filter((d) => d.Unit === Math.min(...data.map((item) => item.Unit)))

  return (
    <Card p="xl">
      <Card.Section>
        <Text fw="bold" size="lg" mb="md" ta="center">
          Average Inventory
        </Text>
        <BarChart
          h={200}
          data={data}
          dataKey="method"
          series={[{ name: 'Unit', color: 'violet.6' }]}
          valueFormatter={(value) =>
            new Intl.NumberFormat('id-ID', {
              maximumFractionDigits: 0
            }).format(value)
          }
          tickLine="y"
          referenceLines={[
            {
              y: minimumCost[0].Unit,
              color: 'white',
              label: 'Minimum',
              labelPosition: 'insideTop'
            }
          ]}
        />
        <Text mt={6} ta="center">
          Based on the cost comparison chart, the smallest total cost is{' '}
          {new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 0
          }).format(minimumCost[0].Unit)}
        </Text>
      </Card.Section>
    </Card>
  )
}
