import { Button, Container, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import classes from '@renderer/assets/home.module.css'
import { Dots } from '@renderer/components/Dots'

export default function HomePage(): JSX.Element {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <Stack className={classes.inner} mt="xl">
        <Title className={classes.title}>Lot Sizing Application</Title>

        <Container p={0} size="md">
          <Text size="lg" c="dimmed" className={classes.description}>
            Desktop application specifically developed to practicing in determining the most
            efficient lot size for material orders. The application supports various lot sizing
            methods commonly used in Material Requirement Planning (MRP)
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            component={Link}
            to="/product/create"
            className={classes.control}
            size="lg"
            variant="gradient"
          >
            Get Started
          </Button>
        </div>
      </Stack>
    </Container>
  )
}
