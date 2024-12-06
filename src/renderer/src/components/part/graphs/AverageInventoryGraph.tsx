import { BarChart } from '@mantine/charts'
import { Card, Text } from '@mantine/core'

export default function AverageInventoryGraph({
  data
}: {
  data: {
    method: string
    Unit: number
  }[]
}): JSX.Element {
  const minimumCost = data.filter((d) => d.Unit === Math.min(...data.map((item) => item.Unit)))

  return (
    <Card p="xl">
      <Card.Section>
        <Text fw="bold" size="lg" mb="md" ta="center">
          Rata-rata Inventori
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
          Berdasarkan grafik perbandingan biaya, total biaya terkecil sebesar{' '}
          {new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 0
          }).format(minimumCost[0].Unit)}
        </Text>
      </Card.Section>
    </Card>
  )
}
