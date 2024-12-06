import { Stack, Tabs } from '@mantine/core'
import { useProductContext } from '@renderer/context/ProductContext'
import { useNavigate, useParams } from 'react-router-dom'
import PartsProductTab from './tabs/Parts'
import PORProductTab from './tabs/POR'
import CostProductTab from './tabs/Cost'
import BOMProductTab from './tabs/BOM'

export default function ProductLotSizingPage(): JSX.Element {
  const { id, tabValue } = useParams()
  const navigate = useNavigate()
  const { product } = useProductContext()

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <Stack>
      <Tabs
        value={tabValue}
        onChange={(value) => navigate(`/product/${id}/lot-sizing/${value}`)}
        keepMounted={false}
        defaultValue="parts"
      >
        <Tabs.List>
          <Tabs.Tab value="parts">Parts</Tabs.Tab>
          <Tabs.Tab value="por">Recap POR</Tabs.Tab>
          <Tabs.Tab value="cost">Recap Cost</Tabs.Tab>
          <Tabs.Tab value="bom">Bill Of Material</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="parts">
          <PartsProductTab />
        </Tabs.Panel>
        <Tabs.Panel value="por">
          <PORProductTab />
        </Tabs.Panel>
        <Tabs.Panel value="cost">
          <CostProductTab />
        </Tabs.Panel>
        <Tabs.Panel value="bom">
          <BOMProductTab />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
