import { Button, Center, Stack, Text } from '@mantine/core'
import { useProductContext } from '@renderer/context/ProductContext'
import { DataTransform } from '@renderer/types'
import { Tree, TreeNode } from 'react-organizational-chart'
import { Link } from 'react-router-dom'
import { Part, Product } from 'src/preload/types'

export default function BOMGraph({ product }: { product: Product }): JSX.Element {
  if (product.parts.length < 2) {
    return (
      <Center>
        <Stack align="center">
          <Text>No parts found</Text>
          <Button component={Link} to={`/product/${product.id}/parts`}>
            Add product parts
          </Button>
        </Stack>
      </Center>
    )
  }

  const productData = {
    ...product,
    parts: product.parts
      .filter((part) => part.level > 0)
      .map((part) => ({
        ...part,
        level: part.level - 1
      }))
  }

  const transformedData = transformData(productData)

  return (
    <Tree
      label={
        <PartBlock
          id={product.parts[0].id}
          name={transformedData.name}
          amount={transformedData.amount}
        />
      }
      lineWidth="2px"
      lineColor="royalblue"
    >
      {transformedData.children?.map((child) => <PartNode key={child.name} part={child} />)}
    </Tree>
  )
}

function PartNode({ part }: { part: DataTransform | undefined }): JSX.Element {
  if (!part) {
    return <></>
  }

  return (
    <TreeNode
      key={part.name}
      label={<PartBlock id={part.id} name={part.name} amount={part.amount} />}
    >
      {part.children &&
        part.children.length > 0 &&
        part.children.map((child) => <PartNode key={child.name} part={child} />)}
    </TreeNode>
  )
}

const PartBlock = ({
  id,
  name,
  amount = 0
}: {
  id: string
  name: string
  amount?: number
}): JSX.Element => {
  const product = useProductContext().product

  if (!product) return <></>

  return (
    <Button
      h="auto"
      variant="gradient"
      size="compact-lg"
      miw={100}
      component={Link}
      to={`/product/${product.id}/lot-sizing/${id}/lfl`}
    >
      <Stack gap={0} py="sm">
        <Text c="white">{name}</Text>
        {amount > 0 && <Text c="white">({amount})</Text>}
      </Stack>
    </Button>
  )
}

const transformData = (originalData: Product): DataTransform => {
  const { name, parts } = originalData

  const transformPart = (originalPart: Part): DataTransform => {
    const { name, amount, id } = originalPart
    const children = parts.filter((part) => part.parent === id).map(transformPart)

    return {
      id,
      name,
      amount,
      children: children.length > 0 ? children : undefined
    }
  }

  const transformedParts: DataTransform[] = parts
    .filter((part) => part.level === 0) // Select only root parts
    .map(transformPart)

  return {
    id: transformedParts[0].id,
    name,
    children: transformedParts
  }
}
