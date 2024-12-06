import { BarChart } from '@mantine/charts'
import { Card, Text } from '@mantine/core'

export default function HoldingCostGraph({
  data
}: {
  data: {
    method: string
    Cost: number
  }[]
}): JSX.Element {
  const minimumCost = data.filter((d) => d.Cost === Math.min(...data.map((item) => item.Cost)))

  return (
    <Card p="xl">
      <Card.Section>
        <Text fw="bold" size="lg" mb="md" ta="center">
          Biaya Simpan
        </Text>
        <BarChart
          h={200}
          data={data}
          dataKey="method"
          series={[{ name: 'Cost', color: 'violet.6' }]}
          valueFormatter={(value) =>
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              compactDisplay: 'short',
              notation: 'compact',
              maximumFractionDigits: 0
            }).format(value)
          }
          tickLine="y"
          referenceLines={[
            {
              y: minimumCost[0].Cost,
              color: 'white',
              label: 'Minimum',
              labelPosition: 'insideTop'
            }
          ]}
        />
        <Text mt={6} ta="center">
          Berdasarkan grafik perbandingan biaya, total biaya terkecil sebesar{' '}
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
          }).format(minimumCost[0].Cost)}
        </Text>
      </Card.Section>
    </Card>
  )
}
