import { Box, Tabs } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import DetailProductTab from './tabs/Detail'
import PartsProductPage from './tabs/Parts'
import BOMProductPage from './tabs/BOM'
import MPSProductTab from './tabs/MPS'
import InventoryRecordProductPage from './tabs/IR'
import SummaryProductTab from './tabs/Summary'

export default function ProductInfoPage(): JSX.Element {
  const { id, tabValue } = useParams()
  const navigate = useNavigate()

  return (
    <Tabs
      value={tabValue}
      onChange={(value) => navigate(`/product/${id}/${value}`)}
      keepMounted={false}
    >
      <Tabs.List>
        <Tabs.Tab value="info">Information</Tabs.Tab>
        <Tabs.Tab value="parts">Parts</Tabs.Tab>
        <Tabs.Tab value="bom">Bill Of Materials</Tabs.Tab>
        <Tabs.Tab value="mps">Master Production Schedule</Tabs.Tab>
        <Tabs.Tab value="ir">Inventory Record</Tabs.Tab>
        <Tabs.Tab value="summary">Summary</Tabs.Tab>
      </Tabs.List>

      <Box py="md">
        <Tabs.Panel value="info">
          <DetailProductTab />
        </Tabs.Panel>
        <Tabs.Panel value="parts">
          <PartsProductPage />
        </Tabs.Panel>
        <Tabs.Panel value="bom">
          <BOMProductPage />
        </Tabs.Panel>
        <Tabs.Panel value="mps">
          <MPSProductTab />
        </Tabs.Panel>
        <Tabs.Panel value="ir">
          <InventoryRecordProductPage />
        </Tabs.Panel>
        <Tabs.Panel value="summary">
          <SummaryProductTab />
        </Tabs.Panel>
      </Box>
    </Tabs>
  )
}
