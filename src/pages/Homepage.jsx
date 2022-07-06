import {
  Badge,
  Heading,
  ListItem,
  OrderedList,
} from '@chakra-ui/react'
import React from 'react'
import { Layout } from '../components/Layout'

export default function Homepage() {
  return (
    <Layout>
      <Heading>
        PWA Powerpoint Project
        <Badge
          fontWeight="black"
          fontSize="4xl"
          mx={2}
          px={2}
          colorScheme="green"
        >
          With Firebase
        </Badge>
      </Heading>
      <OrderedList fontSize="3xl" my={4}>
        <ListItem>Auth Firebase and Google</ListItem>
        <ListItem>Listing existing presentations</ListItem>
        <ListItem>Creating a new presentation</ListItem>
        <ListItem>Adding one or more slides to the presentation</ListItem>
        <ListItem>Implement a WYSIWYG (HTML or Markdown)</ListItem>
        <ListItem>Collaborative editing (in WYSIWYG)</ListItem>
        <ListItem>
          Proposing a presentation mode using
          <Badge
            fontSize="inherit"
            colorScheme="teal"
            mx={2}
            textTransform="capitalize"
            borderRadius="md"
          >
            Reveal.js
          </Badge>
        </ListItem>
        <ListItem>
          Synchronization of changes made offline when back online{' '}
        </ListItem>
        <ListItem>Real-time collaborator cursor display</ListItem>
        <ListItem>Chat with collaborators</ListItem>
        <ListItem>Image upload</ListItem>
      </OrderedList>
    </Layout>
  )
}
