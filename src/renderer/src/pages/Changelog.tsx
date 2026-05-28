import { Container, List, Text, ThemeIcon, Timeline, Title } from '@mantine/core'
import { CircleDot, GitCommitHorizontal } from 'lucide-react'

const changelogData: {
  version: string
  date: string
  items: string[]
  color: string
}[] = [
  {
    version: 'v0.0.5',
    date: '2026-05-29',
    color: 'blue',
    items: [
      'feat: add About page with app description and enable sidebar link',
      'chore: bump version to 0.0.5 and migrate from react-latex-next to @matejmazur/react-katex',
      'chore: upgrade deps and fix React/Electron compatibility regressions',
      'fix: update default JSON formatter and add missing path in settings; enhance product form with inventory record; improve product summary validation'
    ]
  },
  {
    version: 'v0.0.4',
    date: '2024-12-07',
    color: 'teal',
    items: [
      'chore: bump version to 0.0.4 in package.json',
      'fix: close UpdateNotification before triggering update installation',
      'fix: change initial state of UpdateNotification to closed and update dependencies'
    ]
  },
  {
    version: 'v0.0.3',
    date: '2024-12-06',
    color: 'violet',
    items: ['feat: update auto-updater functionality and add notifications for update events']
  },
  {
    version: 'v0.0.2',
    date: '2024-12-06',
    color: 'grape',
    items: [
      'chore: bump version to 0.0.2 in package.json',
      'feat: add disabled state to Navbar items',
      'feat: add open directory functionality to product management'
    ]
  },
  {
    version: 'v0.0.1',
    date: '2024-12-06',
    color: 'gray',
    items: ['Initial commit']
  }
]

export default function ChangelogPage(): React.JSX.Element {
  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xs">
        Changelog
      </Title>
      <Text c="dimmed" mb="lg">
        Track the evolution of Lot Sizing Application across versions.
      </Text>

      <Timeline active={changelogData.length - 1} bulletSize={32} lineWidth={3}>
        {changelogData.map((entry) => (
          <Timeline.Item
            key={entry.version}
            title={
              <Text fw={700} size="lg">
                {entry.version}
                <Text component="span" c="dimmed" size="sm" ml="sm">
                  {entry.date}
                </Text>
              </Text>
            }
            bullet={<GitCommitHorizontal size={16} />}
            color={entry.color}
          >
            <List
              spacing="xs"
              size="sm"
              icon={
                <ThemeIcon color={entry.color} size={16} radius="xl" variant="light">
                  <CircleDot size={8} />
                </ThemeIcon>
              }
            >
              {entry.items.map((item, i) => (
                <List.Item key={i}>{item}</List.Item>
              ))}
            </List>
          </Timeline.Item>
        ))}
      </Timeline>
    </Container>
  )
}
