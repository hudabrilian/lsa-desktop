import { Group, Burger, Text } from '@mantine/core'
import ModeToggle from './ModeToggle'

export default function Header({
  opened,
  toggle
}: {
  opened: boolean | undefined
  toggle: React.MouseEventHandler<HTMLButtonElement> | undefined
}): JSX.Element {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />

        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 'x-large'
          }}
        >
          Lot Sizing Application
        </Text>
      </Group>
      <ModeToggle />
    </Group>
  )
}
