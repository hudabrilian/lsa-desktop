import { Button, Dialog, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'

export default function UpdateNotification(): JSX.Element {
  const [autoUpdateErrorMessage, setAutoUpdateErrorMessage] = useState<string | null>(null)
  const [showUpdateIsInstalling, setShowUpdateIsInstalling] = useState<boolean>(false)
  const [showUpdateIsDownloaded, setShowUpdateIsDownloaded] = useState<boolean>(false)
  const [opened, { open, close }] = useDisclosure(false)

  useEffect(() => {
    window.api.updates.onUpdateAvailable(() => {
      if (!opened) open()
    })
    window.api.updates.onAutoUpdaterError(async (error) => {
      setAutoUpdateErrorMessage(
        error ?? 'An error occurred checking for updates. Please try again later.'
      )
    })
    window.api.updates.onUpdateDownloaded(() => {
      setShowUpdateIsDownloaded(true)
    })
    window.api.updates.updateAutoUpdater()
  }, [])

  useEffect(() => {
    notifications.hide('updateIsInstalling')
    if (showUpdateIsInstalling) {
      notifications.show({
        id: 'updateIsInstalling',
        title: 'LSA APP is updating',
        message: 'App is updating to the latest version. Please wait...',
        color: 'blue',
        autoClose: false
      })
    }
  }, [showUpdateIsInstalling])

  useEffect(() => {
    notifications.hide('updateError')
    if (autoUpdateErrorMessage) {
      notifications.show({
        id: 'updateError',
        title: 'Update error',
        message: autoUpdateErrorMessage,
        color: 'red',
        autoClose: false
      })
    }
  }, [autoUpdateErrorMessage])

  useEffect(() => {
    notifications.hide('updateIsDownloaded')
    if (showUpdateIsDownloaded) {
      notifications.show({
        id: 'updateIsDownloaded',
        title: 'Update downloaded',
        message: 'LSA APP has downloaded the latest version. Please restart the app to update.',
        color: 'blue',
        autoClose: false
      })
    }
  }, [showUpdateIsDownloaded])

  const triggerUpdate = (): void => {
    setShowUpdateIsInstalling(true)
    window.api.updates.triggerUpdate()
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
