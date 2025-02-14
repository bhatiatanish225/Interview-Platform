import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';

function Instructions() {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={10}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center">Interview Instructions</Heading>
          
          <Text fontSize="lg">
            Welcome to the video interview platform. Please read the following instructions carefully
            before proceeding.
          </Text>

          <Box>
            <Heading size="md" mb={4}>Process Overview</Heading>
            <List spacing={3}>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" />
                You will be presented with interview questions one at a time
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" />
                For each question, you will get 1 minute to prepare your answer
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" />
                After preparation time, you will have 2 minutes to record your response
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" />
                You have 2 attempts for each question if needed
              </ListItem>
            </List>
          </Box>

          <Box>
            <Heading size="md" mb={4}>Important Notes</Heading>
            <List spacing={3}>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" />
                Ensure your camera and microphone are working properly
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" />
                Find a quiet place with good lighting
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" />
                Your responses will be automatically saved and submitted
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={MdCheckCircle} color="green.500" />
                You cannot pause or resume the recording once started
              </ListItem>
            </List>
          </Box>

          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate('/interview')}
            mt={4}
          >
            Start Interview
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default Instructions;