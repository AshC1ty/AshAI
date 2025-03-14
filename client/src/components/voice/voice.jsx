import { useState, useRef } from 'react';
import './voice.css';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Voice = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [processingAudio, setProcessingAudio] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleStop;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Error accessing your microphone. Please make sure you have granted permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setProcessingAudio(true);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleStop = async () => {
    try {
      // Create a Blob from the audio chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      
      // Create and prepare FormData
      const formData = new FormData();
      formData.append("with_diarization", "false");
      formData.append("model", "saaras:v1");
      formData.append('file', audioBlob, 'audio.wav');

      console.log("Sending audio to API...");
      
      // Send the audio to the sarvam endpoint
      const response = await fetch('https://api.sarvam.ai/speech-to-text-translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': `${import.meta.env.VITE_SARVAM_API}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to transcribe audio: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
      
      // Check for transcript (matching the key used in the demo.html)
      if (result.transcript) {
        console.log('Speech-to-Text Result:', result);
        onTranscriptionComplete(result);
      } else {
        console.error("No transcription returned in response:", result);
      }
    } catch (err) {
      console.error("Error processing audio:", err);
    } finally {
      // Clear the audio chunks reference after processing
      audioChunksRef.current = [];
      setProcessingAudio(false);
    }
  };

  return (
    <div className="voice-recorder">
      <button
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={processingAudio}
      >
        {processingAudio ? (
          <AiOutlineLoading3Quarters className="processing-icon" />
        ) : isRecording ? (
          <FaStop />
        ) : (
          <FaMicrophone />
        )}
      </button>
    </div>
  );
};

export default Voice;