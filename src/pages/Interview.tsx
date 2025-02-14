import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  Progress,
  Button,
} from '@chakra-ui/react';
import Webcam from 'react-webcam';
import Countdown from 'react-countdown';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Question } from '../types';

// Add this type to store user info
interface InterviewUser {
  id: string;
  role: 'user' | 'admin';
}

function Interview() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPreparationPhase, setIsPreparationPhase] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const toast = useToast();
  const { role } = useAuthStore();
  const userId = role === 'user' ? 'user-1' : 'admin-1';

  useEffect(() => {
    const dummyQuestions: Question[] = [
      {
        id: '1',
        title: 'Tell us about yourself',
        description: 'Give a brief introduction about your background, skills, and what motivates you.',
        active: true,
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Why do you want to join our company?',
        description: 'Explain what attracts you to our organization and how you can contribute to our mission.',
        active: true,
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    setQuestions(dummyQuestions);
  }, []);

  const handleDataAvailable = ({ data }: BlobEvent) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => [...prev, data]);
    }
  };

  const startRecording = () => {
    setRecordedChunks([]);
    if (webcamRef.current?.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm',
      });
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadVideo = async (blob: Blob) => {
    const fileName = `${userId}/${questions[currentQuestionIndex].id}/${Date.now()}.webm`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('interview-responses')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('interview-responses')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      throw new Error(`Error uploading video: ${error.message}`);
    }
  };

  const handleSubmitRecording = async () => {
    try {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoUrl = await uploadVideo(blob);

      toast({
        title: 'Recording submitted',
        status: 'success',
        duration: 2000,
      });

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsPreparationPhase(true);
        setRecordingComplete(false);
        setAttempts(0);
      } else {
        toast({
          title: 'Interview completed',
          description: 'Thank you for your responses!',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error submitting recording',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleReRecord = () => {
    if (attempts >= 1) {
      toast({
        title: 'Maximum attempts reached',
        description: 'Please submit your current recording',
        status: 'warning',
        duration: 3000,
      });
      return;
    }
    setAttempts(attempts + 1);
    setIsRecording(true);
    setRecordingComplete(false);
    startRecording();
  };

  const handleSubmitEarly = async () => {
    stopRecording();
    setIsRecording(false);
    setRecordingComplete(true);
    await handleSubmitRecording();
  };

  if (questions.length === 0) {
    return (
      <Container maxW="container.md" py={10}>
        <Text>Loading questions...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        <Heading size="lg">Question {currentQuestionIndex + 1}</Heading>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="md" w="100%">
          <Text fontSize="xl" mb={4}>
            {questions[currentQuestionIndex].title}
          </Text>
          <Text>{questions[currentQuestionIndex].description}</Text>
        </Box>

        <Box w="100%" position="relative">
          <Webcam
            ref={webcamRef}
            audio={true}
            width="100%"
            height="auto"
            style={{ borderRadius: '8px' }}
          />
        </Box>

        {isPreparationPhase ? (
          <Box textAlign="center" w="100%">
            <Heading size="md" mb={4}>Preparation Time</Heading>
            <Countdown
              date={Date.now() + 60000}
              onComplete={() => {
                setIsPreparationPhase(false);
                setIsRecording(true);
                startRecording();
              }}
              renderer={({ seconds }) => (
                <VStack spacing={4}>
                  <Text fontSize="2xl">{seconds} seconds</Text>
                  <Progress value={seconds} max={60} w="100%" colorScheme="blue" />
                </VStack>
              )}
            />
          </Box>
        ) : isRecording ? (
          <Box textAlign="center" w="100%">
            <Heading size="md" mb={4}>Recording</Heading>
            <Countdown
              date={Date.now() + 120000}
              onComplete={() => {
                stopRecording();
                setIsRecording(false);
                setRecordingComplete(true);
              }}
              renderer={({ minutes, seconds }) => (
                <VStack spacing={4}>
                  <Text fontSize="2xl">
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </Text>
                  <Progress
                    value={minutes * 60 + seconds}
                    max={120}
                    w="100%"
                    colorScheme="red"
                  />
                </VStack>
              )}
            />
            <Button onClick={handleSubmitEarly} colorScheme="blue" mt={4}>
              Submit Early
            </Button>
          </Box>
        ) : recordingComplete ? (
          <VStack spacing={4} w="100%">
            <Text>Recording completed! ({attempts + 1}/2 attempts used)</Text>
            <Button
              onClick={handleReRecord}
              isDisabled={attempts >= 1}
              colorScheme="orange"
              mr={3}
            >
              Re-record Response
            </Button>
            <Button onClick={handleSubmitRecording} colorScheme="green">
              Submit Recording
            </Button>
          </VStack>
        ) : null}
      </VStack>
    </Container>
  );
}

export default Interview;