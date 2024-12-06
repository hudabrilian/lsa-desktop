import { Group, Text } from '@mantine/core'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Footer(): JSX.Element {
  const [version, setVersion] = useState<string>('')

  useEffect(() => {
    const fetchVersion = async (): Promise<void> => {
      const version = await window.api.getVersion()
      setVersion(version)
    }

    fetchVersion()
  }, [])

  return (
    <Group align="center" justify="space-between" w="100%">
      <Group display="inline-flex" fw="lighter" fz="sm">
        &copy; {new Date().getFullYear()} LSA. All rights reserved. Crafted with
        <Heart size="1rem" strokeWidth="1px" style={{ margin: '-10px' }} />
        by Brilian.
      </Group>
      <Text fw="lighter" fz="sm">
        Version: {version}
      </Text>
    </Group>
  )
}
