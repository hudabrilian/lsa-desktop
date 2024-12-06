import { createContext, ReactNode, useContext, useState } from 'react'
import { Product } from 'src/preload/types'

interface ProductContextProps {
  product: Product | null
  setProductData: (newProduct: Product) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const ProductContext = createContext<ProductContextProps | null>(null)

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children
}: {
  children: ReactNode
}) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setProductData = (newProduct: Product): void => {
    setProduct(newProduct)
  }

  const contextValue: ProductContextProps = {
    product,
    setProductData,
    isLoading,
    setIsLoading
  }

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>
}

export const useProductContext = (): ProductContextProps => {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider')
  }

  return context
}
