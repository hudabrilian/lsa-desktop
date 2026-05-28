import { Container } from '@mantine/core'
import { Outlet } from 'react-router-dom'

export default function ProductLayout(): React.JSX.Element {
  return (
    <>
      <Container size="xl">
        <Outlet />
      </Container>
    </>
  )
}
