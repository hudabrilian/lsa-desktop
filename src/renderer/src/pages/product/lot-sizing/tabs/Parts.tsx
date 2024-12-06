import { Box, Button, Center, SimpleGrid, Stack, Tabs, Text } from '@mantine/core'
import ProductSkeleton from '@renderer/components/ProductSkeleton'
import { useProductContext } from '@renderer/context/ProductContext'
import { Link } from 'react-router-dom'

export default function PartsProductTab(): JSX.Element {
  const { product, isLoading } = useProductContext()

  if (isLoading) {
    return <ProductSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  if (product.parts.length < 2) {
    return (
      <Center my="md">
        <Stack align="center">
          <Text>No parts found</Text>
          <Button component={Link} to={`/product/${product.id}/parts`}>
            Add product parts
          </Button>
        </Stack>
      </Center>
    )
  }

  return (
    <Tabs defaultValue="level-0" orientation="vertical">
      <Tabs.List>
        {Array(product.lowestLevel + 1)
          .fill(0)
          .map((_, index) => (
            <Tabs.Tab key={index} value={`level-${index}`}>
              Level {index}
            </Tabs.Tab>
          ))}
      </Tabs.List>

      {Array(product.lowestLevel + 1)
        .fill(0)
        .map((_, index) => (
          <Tabs.Panel key={index} value={`level-${index}`}>
            <Box p={10}>
              <SimpleGrid cols={6}>
                {product.parts
                  .filter((part) => part.level === index)
                  .map((part) => (
                    <Button
                      key={part.id}
                      component={Link}
                      to={`/product/${product.id}/lot-sizing/${part.id}/lfl`}
                    >
                      {part.name}
                    </Button>
                  ))}
              </SimpleGrid>
            </Box>
          </Tabs.Panel>
        ))}
    </Tabs>
  )
}
