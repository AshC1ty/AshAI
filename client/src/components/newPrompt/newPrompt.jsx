import Upload from '../upload/upload'
import './newPrompt.css'
import { useRef, useEffect } from 'react'
import { useState } from 'react'
import { IKImage } from 'imagekitio-react'
import model from '../../lib/gemini'
import Markdown from 'react-markdown'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Voice from '../voice/voice'

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false) // State to track if the question was given as a recording

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {}
  })

  const chat = model.startChat({
    history: data?.history
      ?.filter(entry => entry !== undefined)
      .map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0]?.text }],
      })) || [],
    generationConfig: {
    },
  });

  const endRef = useRef(null)
  const formRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, langy,isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      mutation.mutate();

      // Translate and generate audio only if the question was given as a recording
      if (isRecording) {
        const targetLanguage = langy; // Use the stored language code
        await translateAndGenerateAudio(accumulatedText, targetLanguage);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const translateAndGenerateAudio = async (text, targetLanguage) => {
    const translateApiUrl = 'https://api.sarvam.ai/translate';
    const ttsApiUrl = 'https://api.sarvam.ai/text-to-speech';
    const apiKey = '8fafb6db-5872-41ff-93e3-c700ffd2d684'; // Replace with your actual API key

    // Step 1: Translate the text
    const translateOptions = {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        enable_preprocessing: false,
        input: text,
        source_language_code: 'en-IN',
        target_language_code: targetLanguage
      })
    };

    try {
      const translateResponse = await fetch(translateApiUrl, translateOptions);
      const translateData = await translateResponse.json();

      if (!translateData.translated_text) {
        console.error('Translation failed:', translateData);
        return;
      }

      const translatedText = translateData.translated_text;

      // Step 2: Convert translated text to speech
      const ttsOptions = {
        method: 'POST',
        headers: {
          'api-subscription-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          speaker: 'pavithra',
          loudness: 1,
          speech_sample_rate: 22050,
          enable_preprocessing: false,
          override_triplets: {},
          target_language_code: targetLanguage,
          inputs: [translatedText]
        })
      };

      const ttsResponse = await fetch(ttsApiUrl, ttsOptions);
      const ttsData = await ttsResponse.json();

      if (ttsData.audios && ttsData.audios.length > 0) {
        const audioSrc = `data:audio/wav;base64,${ttsData.audios[0]}`;
        const audio = new Audio(audioSrc);
        audio.play();
      } else {
        console.error('No audio data received');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const text = e.target.text.value

    if (!text) { return }

    setIsRecording(false); // Set isRecording to false when submitting text
    add(text, false)
  }

  const handleTranscription = (transcribedText) => {
    setInputText(transcribedText.transcript);
    let languagecode = transcribedText.language_code;
    console.log("The language you are speaking is", languagecode)
    setIsRecording(true); // Set isRecording to true when handling transcription

    // If you want the transcribe to be added automatically
    if (transcribedText.transcript.trim()) {
      // Call add function directly with the transcribed text
      add(transcribedText.transcript, languagecode,false);
    }
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="280"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className='message user'>{question}</div>}
      {answer && <div className='message'><Markdown>{answer}</Markdown></div>}
      <div className='endChat' ref={endRef}></div>
      <form autoComplete='off' className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <Voice onTranscriptionComplete={handleTranscription} />
        <input type="text"
          name="text"
          placeholder="How can I help you today.....?"
        />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  )
}

export default NewPrompt;