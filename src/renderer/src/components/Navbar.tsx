import { NavLink } from '@mantine/core'
import { Book, CalendarClock, Home, Info, List } from 'lucide-react'
import { ReactNode } from 'react'
import { NavLink as NavLinkRouter, useLocation } from 'react-router-dom'

const navList: {
  href: string
  label: string
  icon: ReactNode
  disabled: boolean
}[] = [
  {
    href: '/',
    label: 'Home',
    icon: <Home size="1.3rem" strokeWidth={1.5} />,
    disabled: false
  },
  {
    href: '/about',
    label: 'About',
    icon: <Info size="1.3rem" strokeWidth={1.5} />,
    disabled: true
  },
  {
    href: '/guide',
    label: 'Guide',
    icon: <Book size="1.3rem" strokeWidth={1.5} />,
    disabled: true
  },
  {
    href: '/product',
    label: 'Products',
    icon: <List size="1.3rem" strokeWidth={1.5} />,
    disabled: false
  },
  {
    href: '/history',
    label: 'History',
    icon: <CalendarClock size="1.3rem" strokeWidth={1.5} />,
    disabled: true
  }
]

export default function Navbar(): JSX.Element {
  const location = useLocation()

  return (
    <>
      {navList.map((nav, index) => (
        <NavLink
          key={index}
          component={NavLinkRouter}
          to={nav.href}
          label={nav.label}
          leftSection={nav.icon}
          active={location.pathname === nav.href}
          disabled={nav.disabled}
        />
      ))}
    </>
  )
}
