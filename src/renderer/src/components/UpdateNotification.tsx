import { Button, Dialog, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'

export default function UpdateNotification(): JSX.Element {
  const [autoUpdateErrorMessage, setAutoUpdateErrorMessage] = useState<string | null>(null)
  const [showUpdateIsInstalling, setShowUpdateIsInstalling] = useState<boolean>(false)
  const [opened, { toggle, close }] = useDisclosure(false)

  useEffect(() => {
    window.api.updates.onUpdateAvailable(() => {
      if (!opened) toggle()
    })
    window.api.updates.onAutoUpdaterError(async (error) => {
      setAutoUpdateErrorMessage(
        error ?? 'An error occurred checking for updates. Please try again later.'
      )
    })
    window.api.updates.updateAutoUpdater()
  }, [])

  const triggerUpdate = (): void => {
    setShowUpdateIsInstalling(true)
    window.api.updates.triggerUpdate()
  }

  if (showUpdateIsInstalling) {
    notifications.show({
      title: 'Update is installing',
      message: 'LSA APP is updating to the latest version. Please wait...',
      color: 'blue',
      autoClose: false
    })
  }

  if (autoUpdateErrorMessage) {
    notifications.show({
      title: 'Update error',
      message: autoUpdateErrorMessage,
      color: 'red',
      autoClose: false
    })
  }

  return (
    <>
      <Dialog opened={opened} withCloseButton onClose={close} size="lg" radius="md">
        <>
          <Text size="sm" mb="xs" fw={500}>
            Update Available
          </Text>

          <Text size="sm" mb="xs">
            A new version of the app is available. Click the button below to update.
          </Text>

          <Group align="flex-end">
            <Button onClick={close} color="blue" variant="outline">
              Update later
            </Button>
            <Button onClick={triggerUpdate} color="blue" variant="gradient">
              Update
            </Button>
          </Group>
        </>
      </Dialog>
    </>
  )
}
