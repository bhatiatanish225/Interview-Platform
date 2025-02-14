import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';
import type { Question, Response, Profile } from '../types';

function AdminDashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<(Response & { profiles: Profile, questions: Question })[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newQuestion, setNewQuestion] = useState({ title: '', description: '' });
  const toast = useToast();

  useEffect(() => {
    fetchQuestions();
    fetchResponses();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching questions',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            full_name
          ),
          questions:question_id (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching responses',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddQuestion = async () => {
    try {
      const { error } = await supabase.from('questions').insert([
        {
          title: newQuestion.title,
          description: newQuestion.description,
          active: true,
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Question added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setNewQuestion({ title: '', description: '' });
      fetchQuestions();
    } catch (error: any) {
      toast({
        title: 'Error adding question',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>Questions</Heading>
          <Button colorScheme="blue" onClick={onOpen} mb={4}>
            Add New Question
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Created At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {questions.map((question) => (
                <Tr key={question.id}>
                  <Td>{question.title}</Td>
                  <Td>{question.description}</Td>
                  <Td>{question.active ? 'Active' : 'Inactive'}</Td>
                  <Td>{question.created_at ? new Date(question.created_at).toLocaleDateString() : 'N/A'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box>
          <Heading size="lg" mb={4}>Responses</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Candidate</Th>
                <Th>Question</Th>
                <Th>Attempt</Th>
                <Th>Video</Th>
                <Th>Submitted At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {responses.map((response) => (
                <Tr key={response.id}>
                  <Td>{response.profiles.full_name || response.profiles.email}</Td>
                  <Td>{response.questions.title}</Td>
                  <Td>{response.attempt_number}</Td>
                  <Td>
                    <Button
                      as="a"
                      href={response.video_url}
                      target="_blank"
                      size="sm"
                    >
                      View
                    </Button>
                  </Td>
                  <Td>{new Date(response.created_at).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
                placeholder="Enter question title"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={newQuestion.description}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, description: e.target.value })
                }
                placeholder="Enter question description"
              />
            </FormControl>

            <Button
              colorScheme="blue"
              mr={3}
              mt={4}
              onClick={handleAddQuestion}
            >
              Save
            </Button>
            <Button mt={4} onClick={onClose}>Cancel</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;