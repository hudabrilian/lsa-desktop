import { Container, List, Text, ThemeIcon, Title } from '@mantine/core'
import { Check, CircleDot, Cpu } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AboutPage(): React.JSX.Element {
  const [version, setVersion] = useState<string>('')

  useEffect(() => {
    const fetchVersion = async (): Promise<void> => {
      const version = await window.api.getVersion()
      setVersion(version)
    }

    fetchVersion()
  }, [])

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xs">
        About Lot Sizing Application
      </Title>
      <Text c="dimmed" mb="lg">
        Version {version}
      </Text>

      <Text mb="md">
        <strong>Lot Sizing Application (LSA)</strong> is a desktop application specifically
        developed to assist in determining the most efficient lot size for material orders in the
        context of <strong>Material Requirement Planning (MRP)</strong>. The application supports
        various lot sizing methods commonly used in manufacturing and production planning.
      </Text>

      <Title order={3} mt="xl" mb="sm">
        Features
      </Title>

      <List
        spacing="sm"
        icon={
          <ThemeIcon color="blue" size={20} radius="xl">
            <Check size={12} />
          </ThemeIcon>
        }
      >
        <List.Item>
          <strong>Product Management</strong> &mdash; Create, manage, and organize products with BOM
          (Bill of Materials) and parts data.
        </List.Item>
        <List.Item>
          <strong>Master Production Schedule (MPS)</strong> &mdash; Define production schedules for
          finished products.
        </List.Item>
        <List.Item>
          <strong>Inventory Management</strong> &mdash; Track on-hand inventory, scheduled receipts,
          and lead times for each part.
        </List.Item>
        <List.Item>
          <strong>Lot Sizing Methods</strong> &mdash; Choose from multiple lot sizing techniques:
        </List.Item>
      </List>

      <List
        withPadding
        spacing="sm"
        mt="xs"
        mb="lg"
        icon={
          <ThemeIcon color="gray" size={16} radius="xl" variant="light">
            <CircleDot size={8} />
          </ThemeIcon>
        }
      >
        <List.Item>
          <strong>LFL</strong> (Lot-for-Lot)
        </List.Item>
        <List.Item>
          <strong>EOQ</strong> (Economic Order Quantity)
        </List.Item>
        <List.Item>
          <strong>POQ</strong> (Periodic Order Quantity)
        </List.Item>
        <List.Item>
          <strong>LTC</strong> (Least Total Cost)
        </List.Item>
        <List.Item>
          <strong>LUC</strong> (Least Unit Cost)
        </List.Item>
        <List.Item>
          <strong>PPB</strong> (Part Period Balancing)
        </List.Item>
        <List.Item>
          <strong>WWA</strong> (Wagner-Whitin Algorithm)
        </List.Item>
        <List.Item>
          <strong>FPR</strong> (Fixed Period Requirements)
        </List.Item>
        <List.Item>
          <strong>FOQ</strong> (Fixed Order Quantity)
        </List.Item>
      </List>

      <List
        spacing="sm"
        icon={
          <ThemeIcon color="blue" size={20} radius="xl">
            <Check size={12} />
          </ThemeIcon>
        }
      >
        <List.Item>
          <strong>Cost Comparison</strong> &mdash; Compare the total cost of each lot sizing method
          side by side.
        </List.Item>
        <List.Item>
          <strong>Graphical Visualization</strong> &mdash; View cost trends and inventory movements
          through interactive charts.
        </List.Item>
        <List.Item>
          <strong>Material Explosion</strong> &mdash; Automatically explode dependent demand from
          MPS through the BOM tree.
        </List.Item>
        <List.Item>
          <strong>Planned Order Report (POR)</strong> &mdash; Generate detailed planned order
          reports for each part.
        </List.Item>
      </List>

      <Title order={3} mt="xl" mb="sm">
        Technology Stack
      </Title>

      <List
        spacing="sm"
        icon={
          <ThemeIcon color="teal" size={20} radius="xl">
            <Cpu size={12} />
          </ThemeIcon>
        }
      >
        <List.Item>
          <strong>Electron</strong> &mdash; Cross-platform desktop framework
        </List.Item>
        <List.Item>
          <strong>React 19</strong> &mdash; User interface library
        </List.Item>
        <List.Item>
          <strong>TypeScript</strong> &mdash; Type-safe development
        </List.Item>
        <List.Item>
          <strong>Mantine UI</strong> &mdash; Component library and design system
        </List.Item>
        <List.Item>
          <strong>Recharts</strong> &mdash; Data visualization and charts
        </List.Item>
        <List.Item>
          <strong>Zustand</strong> &mdash; State management
        </List.Item>
      </List>

      <Text c="dimmed" mt="xl" size="sm">
        This application is developed for educational and practical purposes in production planning
        and inventory management.
      </Text>
    </Container>
  )
}
