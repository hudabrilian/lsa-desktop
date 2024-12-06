import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useProductContext } from '../../context/ProductContext'

export default function SetProduct(): JSX.Element {
  const { id } = useParams()
  const { product, setProductData, setIsLoading } = useProductContext()

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!product || product.id !== id) {
        try {
          const fetchedProduct = await window.api.products.get(id!)

          if (fetchedProduct) {
            setProductData(fetchedProduct)
          }
        } catch (error) {
          console.error('Error fetching product:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [id, product])

  return <></>
}
