import { Button, Group, Stack, Tabs, Title } from '@mantine/core'
import { useProductContext } from '@renderer/context/ProductContext'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CostRecapTab from './CostRecap'
import ExplodingTab from './Exploding'
import GraphRecapTab from './GraphRecap'
import EOQTable from './methods/EOQ'
import FOQTable from './methods/FOQ'
import FPRTable from './methods/FPR'
import LFLTab from './methods/LFL'
import LTCTable from './methods/LTC'
import LUCTable from './methods/LUC'
import POQTable from './methods/POQ'
import PPBTable from './methods/PPB'
import WWATable from './methods/WWA'
import SelectedPORTab from './SelectedPOR'

export default function ProductLotSizingDetailPage(): JSX.Element {
  const { id, partId, tab2Value } = useParams()
  const navigate = useNavigate()
  const { product } = useProductContext()

  if (!product) {
    return <div>Product not found</div>
  }

  const part = product.parts.find((part) => part.id === partId)

  if (!part) {
    return <div>Part not found</div>
  }

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={2}>{part.name}</Title>
        <Button component={Link} to={`/product/${id}/lot-sizing`}>
          Change part
        </Button>
      </Group>
      <Tabs
        value={tab2Value}
        onChange={(value) => navigate(`/product/${id}/lot-sizing/${partId}/${value}`)}
        keepMounted={false}
      >
        <Tabs.List>
          <Tabs.Tab value="exploding" disabled={part.level === 0}>
            Exploding
          </Tabs.Tab>
          <Tabs.Tab value="lfl">LFL</Tabs.Tab>
          <Tabs.Tab value="eoq" disabled={part.inventoryRecord.orderCost === 0}>
            EOQ
          </Tabs.Tab>
          <Tabs.Tab value="poq" disabled={part.inventoryRecord.orderCost === 0}>
            POQ
          </Tabs.Tab>
          <Tabs.Tab value="foq">FOQ</Tabs.Tab>
          <Tabs.Tab value="fpr">FPR</Tabs.Tab>
          <Tabs.Tab value="luc">LUC</Tabs.Tab>
          <Tabs.Tab value="ltc">LTC</Tabs.Tab>
          <Tabs.Tab value="ppb">PPB</Tabs.Tab>
          <Tabs.Tab value="wwa">WWA</Tabs.Tab>
          <Tabs.Tab value="cost">Recap Cost</Tabs.Tab>
          <Tabs.Tab value="graph">Graphic</Tabs.Tab>
          <Tabs.Tab value="por">Selected POR</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="exploding">
          <ExplodingTab part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="lfl">
          <LFLTab part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="eoq">
          <EOQTable part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="poq">
          <POQTable part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="foq">
          <FOQTable part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="fpr">
          <FPRTable part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="luc">
          <LUCTable part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="ltc">
          <LTCTable part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="ppb">
          <PPBTable part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="wwa">
          <WWATable part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="cost">
          <CostRecapTab part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="graph">
          <GraphRecapTab part={part} />
        </Tabs.Panel>
        <Tabs.Panel value="por">
          <SelectedPORTab part={part} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
