import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Footer from '@renderer/components/Footer'
import Header from '@renderer/components/Header'
import Navbar from '@renderer/components/Navbar'
import { Outlet } from 'react-router-dom'

export default function AppLayout(): JSX.Element {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 50 }}
      navbar={{
        width: 180,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Header opened={opened} toggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer p="sm">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  )
}
