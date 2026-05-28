import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'
import { modals } from '@mantine/modals'

export function useUnsavedChanges(when: boolean): void {
  const blocker = useBlocker(when)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      modals.openConfirmModal({
        title: 'Unsaved Changes',
        children:
          'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.',
        labels: { confirm: 'Leave', cancel: 'Stay' },
        confirmProps: { color: 'red' },
        onConfirm: () => blocker.proceed(),
        onCancel: () => blocker.reset()
      })
    }
  }, [blocker.state])

  useEffect(() => {
    if (!when) return

    const handler = (e: BeforeUnloadEvent): void => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [when])
}
