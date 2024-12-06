import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { NavigationProgress } from '@mantine/nprogress'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import ProductDetailLayout from './layouts/ProductDetailLayout'
import ProductLayout from './layouts/ProductLayout'
import AboutPage from './pages/About'
import GuidePage from './pages/Guide'
import HistoryPage from './pages/History'
import HomePage from './pages/Home'
import CreateProductPage from './pages/product/Create'
import ProductInfoPage from './pages/product/Info'
import ListProductsPage from './pages/product/List'
import ProductLotSizingPage from './pages/product/lot-sizing/Index'
import ProductLotSizingDetailPage from './pages/product/lot-sizing/details/Detail'
import UpdateNotification from './components/UpdateNotification'

export default function App(): JSX.Element {
  const router = createHashRouter(
    [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <HomePage />
          },
          {
            path: '/about',
            element: <AboutPage />
          },
          {
            path: '/guide',
            element: <GuidePage />
          },
          {
            path: '/history',
            element: <HistoryPage />
          },
          {
            path: '/product',
            element: <ProductLayout />,
            children: [
              {
                path: '',
                element: <ListProductsPage />
              },
              {
                path: 'create',
                element: <CreateProductPage />
              },
              {
                path: ':id',
                element: <ProductDetailLayout />,
                children: [
                  {
                    path: 'lot-sizing',
                    children: [
                      {
                        path: '',
                        element: <ProductLotSizingPage />
                      },
                      {
                        path: ':tabValue',
                        element: <ProductLotSizingPage />
                      },
                      {
                        path: ':partId/:tab2Value',
                        element: <ProductLotSizingDetailPage />
                      }
                    ]
                  },
                  {
                    path: ':tabValue',
                    element: <ProductInfoPage />
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    {
      basename: '/'
    }
  )

  return (
    <>
      <MantineProvider defaultColorScheme="auto">
        <UpdateNotification />
        <ModalsProvider>
          <NavigationProgress />
          <Notifications />
          <UpdateNotification />
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </>
  )
}
