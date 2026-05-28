import { Paper, Skeleton, Stack } from '@mantine/core'

export default function ProductSkeleton(): React.JSX.Element {
  return (
    <Stack>
      <Skeleton height={32} width={250} radius="md" mb="md" />
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Skeleton height={20} width={120} radius="md" mb="sm" />
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} height={36} radius="sm" />
          ))}
        </Stack>
      </Paper>
      <Paper shadow="xs" p="md" withBorder>
        <Skeleton height={20} width={160} radius="md" mb="sm" />
        <Skeleton height={200} radius="sm" />
      </Paper>
    </Stack>
  )
}
