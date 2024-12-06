import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { Moon, Sun } from 'lucide-react'

export default function ModeToggle(): JSX.Element {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <ActionIcon
      variant="outline"
      color={isDark ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {isDark ? (
        <Sun style={{ width: 18, height: 18 }} />
      ) : (
        <Moon style={{ width: 18, height: 18 }} />
      )}
    </ActionIcon>
  )
}
