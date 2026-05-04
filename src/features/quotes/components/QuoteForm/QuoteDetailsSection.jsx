// features/quotes/components/QuoteForm/QuoteDetailsSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Chip,
  Button,
  Skeleton,
  TextField,
  LinearProgress,
  InputAdornment,
  Tooltip,
  IconButton
} from '@mui/material';
import { Person, Business, AutoAwesome, Send as SendIcon, Mic, MicOff } from '@mui/icons-material';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import DebouncedTextField from '../../../../components/common/form/DebouncedTextField';
import DebouncedSelect from '../../../../components/common/form/DebouncedSelect';
import CustomDatePicker from '../../../../components/common/CustomDatePicker';
import { QUOTE_STATUS_OPTIONS, CURRENCIES } from '../../constants/quoteConstants';
import { useToast } from '../../../../components/common/ToastProvider';
import httpClient from '../../../../services/api/httpClient';

const aiStyles = `
  @keyframes slideFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes typingDot {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-8px); opacity: 1; }
  }
  @keyframes bubbleFadeIn {
    from { opacity: 0; transform: translateY(10px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmerSweep {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 4px 15px rgba(102,126,234,0.4); }
    50% { box-shadow: 0 4px 25px rgba(102,126,234,0.7); }
  }
  @keyframes checkmarkPop {
    0% { transform: scale(0) rotate(-45deg); opacity: 0; }
    70% { transform: scale(1.2) rotate(5deg); }
    100% { transform: scale(1) rotate(0); opacity: 1; }
  }
  @keyframes iconSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes livePulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .chat-container {
    max-height: 450px;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 20px;
    background: rgba(248, 249, 255, 0.5);
    border-radius: 12px;
  }
  .chat-container::-webkit-scrollbar { width: 5px; }
  .chat-container::-webkit-scrollbar-track { background: transparent; }
  .chat-container::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #667eea, #764ba2);
    border-radius: 10px;
  }
  .ai-bubble {
    background: linear-gradient(135deg, #f0f4ff, #e8f0fe);
    border-left: 3px solid #667eea;
    border-radius: 0 16px 16px 16px;
    animation: bubbleFadeIn 0.3s ease-out, slideInLeft 0.3s ease-out;
    max-width: 85%;
    padding: 12px 16px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #1a1a2e;
    line-height: 1.6;
    box-shadow: 0 2px 12px rgba(102,126,234,0.08);
    position: relative;
  }
  .user-bubble {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 16px 0 16px 16px;
    animation: bubbleFadeIn 0.3s ease-out, slideInRight 0.3s ease-out;
    max-width: 85%;
    margin-left: auto;
    padding: 12px 16px;
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 1.6;
    box-shadow: 0 4px 16px rgba(102,126,234,0.35);
    position: relative;
  }
  .typing-indicator {
    display: flex; gap: 5px; padding: 8px 0; align-items: center;
  }
  .typing-indicator span {
    width: 10px; height: 10px; border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: inline-block;
    animation: typingDot 1.2s infinite;
  }
  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
  .confidence-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 18px; border-radius: 24px;
    font-size: 13px; font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    backdrop-filter: blur(4px);
  }
  .ai-start-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white !important; border-radius: 12px !important;
    box-shadow: 0 4px 15px rgba(102,126,234,0.4) !important;
    animation: glowPulse 2s infinite;
    text-transform: none !important; font-weight: 600 !important;
    padding: 12px 28px !important; height: 48px !important;
    transition: all 0.3s ease; font-size: 15px !important;
    letter-spacing: 0.3px;
  }
  .ai-start-btn:hover {
    box-shadow: 0 6px 30px rgba(102,126,234,0.6) !important;
    transform: translateY(-2px);
  }
  .ai-start-btn:hover .btn-icon {
    animation: iconSpin 0.6s ease-in-out;
  }
  .ai-start-btn:disabled {
    background: #ccc !important;
    box-shadow: none !important;
    animation: none !important;
    cursor: not-allowed !important;
  }
`;

const ConfidenceBadge = ({ score, dataSource }) => {
  const config = score > 0.7
    ? { color: '#2e7d32', label: 'High Confidence', icon: '🟢', bg: 'linear-gradient(135deg, #e8f5e9, #f1f8f1)', border: '1px solid rgba(76,175,80,0.25)' }
    : score > 0.4
    ? { color: '#e65100', label: 'Medium Confidence', icon: '🟡', bg: 'linear-gradient(135deg, #fff3e0, #fff8f0)', border: '1px solid rgba(255,152,0,0.25)' }
    : { color: '#c62828', label: 'Market Rates Used', icon: '🔴', bg: 'linear-gradient(135deg, #ffebee, #fff0f0)', border: '1px solid rgba(244,67,54,0.25)' };
  const sourceLabel = dataSource === 'past_data' ? 'From your history' : dataSource === 'mixed' ? 'Mixed sources' : 'Market rates';
  return (
    <Box className="confidence-badge" sx={{ background: config.bg, color: config.color, mt: 1, border: config.border }}>
      <span style={{ fontSize: 16 }}>{config.icon}</span>
      <span>{config.label}</span>
      <span style={{ opacity: 0.7, fontWeight: 400 }}>— {sourceLabel}</span>
    </Box>
  );
};

const TypingIndicator = () => (
  <div className="ai-bubble" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div className="typing-indicator"><span /><span /><span /></div>
    <span style={{ fontSize: 12, color: '#667eea', fontStyle: 'italic', opacity: 0.8 }}>AI is thinking...</span>
  </div>
);

// Helper function to get client display name based on client type
const getClientDisplayName = (client) => {
  if (!client) return '';
  if (client.client_type === 'commercial') {
    return client.business_name || 'Unnamed Business';
  } else {
    const firstName = client.first_name || '';
    const lastName = client.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Unnamed Client';
  }
};

const QuoteDetailsSection = ({ formik, clients = [], loadingClients = false }) => {
  const [selectedClient, setSelectedClient] = useState(formik.values.client_id || '');
  const { showToast } = useToast();

  // Conversational AI states
  const [chatState, setChatState] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionData, setSessionData] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [genStatusIdx, setGenStatusIdx] = useState(0);
  const chatContainerRef = useRef(null);

  // Speech-to-Text State for Notes
  const [isListeningNotes, setIsListeningNotes] = useState(false);
  const [interimResult, setInterimResult] = useState('');
  const recognitionRef = useRef(null);
  const notesRef = useRef(formik.values.notes || '');

  // Keep ref up to date to avoid stale closure state in speech events
  useEffect(() => {
    notesRef.current = formik.values.notes || '';
  }, [formik.values.notes]);

  // Setup Web Speech API for highly accurate Dictation
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Setting false means it AUTOMATICALLY stops listening when you stop speaking!
      recognitionRef.current.interimResults = true;
      // Use the user's OS/Browser default language natively (Supports Marathi, Hindi, English, etc.)
      recognitionRef.current.lang = window.navigator.language || 'en-US'; 

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Show live text
        if (interimTranscript) {
          setInterimResult(interimTranscript);
        } else {
          setInterimResult('');
        }
        
        // Save final block to the actual input
        if (finalTranscript) {
          const currentNotes = notesRef.current;
          const newNotes = currentNotes.length > 0 && !currentNotes.endsWith(' ') && !currentNotes.endsWith('\n')
            ? currentNotes + ' ' + finalTranscript 
            : currentNotes + finalTranscript;
            
          formik.setFieldValue('notes', newNotes);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
          setIsListeningNotes(false);
          setInterimResult('');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListeningNotes(false);
        setInterimResult('');
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListeningNotes = () => {
    if (!recognitionRef.current) {
      showToast("Speech recognition is not supported in this browser. Please use Chrome/Edge.", "error");
      return;
    }
    
    if (isListeningNotes) {
      recognitionRef.current.stop();
      setIsListeningNotes(false);
      setInterimResult('');
    } else {
      try {
        recognitionRef.current.start();
        setIsListeningNotes(true);
        setInterimResult('');
        showToast("Mic activated. Speak now to dictate...", "info");
      } catch (e) {
        console.error(e);
        setIsListeningNotes(false);
      }
    }
  };


  const genStatusMessages = [
    "Analyzing past quotes...",
    "Calculating pricing...",
    "Applying client preferences...",
    "Finalizing..."
  ];

  // Auto-scroll chat to bottom (only inside the chat container, not the page)
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, chatState]);

  // Generation status cycling
  useEffect(() => {
    let interval;
    if (chatState === 'generating') {
      interval = setInterval(() => setGenStatusIdx(p => (p + 1) % genStatusMessages.length), 1200);
    } else {
      setGenStatusIdx(0);
    }
    return () => clearInterval(interval);
  }, [chatState]);

  // Generation progress bar
  useEffect(() => {
    let interval;
    if (chatState === 'generating') {
      setGeneratingProgress(0);
      interval = setInterval(() => {
        setGeneratingProgress(p => Math.min(p + 2, 95));
      }, 60);
    }
    return () => clearInterval(interval);
  }, [chatState]);

  const addMessage = (type, text) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), type, text, timestamp: new Date() }]);
  };

  const addAiMessageDelayed = (text, delayMs = 600) => {
    return new Promise(resolve => {
      setTimeout(() => { addMessage('ai', text); resolve(); }, delayMs);
    });
  };

  const animateField = (name) => {
    const el = document.querySelector(`[name="${name}"]`);
    if (el) {
      const wrapper = el.closest('.MuiFormControl-root') || el.closest('.MuiInputBase-root') || el;
      wrapper.style.animation = 'none';
      void wrapper.offsetWidth;
      wrapper.style.animation = 'slideFadeIn 0.5s ease-out forwards';
    }
  };

  const applyQuoteToForm = (data) => {
    formik.setFieldValue('title', data.title);
    setTimeout(() => animateField('title'), 50);
    let delay = 150;
    let currentItems = [];
    if (data.line_items?.length > 0) {
      data.line_items.forEach((item, index) => {
        setTimeout(() => {
          currentItems = [...currentItems, {
            item_name: item.item_name || '', description: item.description || '',
            quantity: item.quantity || 1, unit_price: item.unit_price || 0, tax_rate: item.tax_rate || 0,
          }];
          formik.setFieldValue('line_items', currentItems);
          setTimeout(() => {
            animateField(`line_items[${index}].item_name`);
            animateField(`line_items[${index}].description`);
            animateField(`line_items[${index}].quantity`);
            animateField(`line_items[${index}].unit_price`);
          }, 50);
        }, delay);
        delay += 150;
      });
    }
    setTimeout(() => {
      formik.setFieldValue('notes', data.notes);
      setTimeout(() => animateField('notes'), 50);
    }, delay);
  };

  // ── Step 1: Start → Analyze Intent ──
  const handleStartAI = async () => {
    if (!selectedClient || !jobDescription.trim()) return;
    setChatState('analyzing');
    setMessages([]);
    setAnswers({});
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setConfidenceScore(null);
    setDataSource(null);

    addMessage('user', jobDescription);
    await addAiMessageDelayed("Analyzing your job description...", 400);

    try {
      const res = await httpClient.post('/api/v1/ai/analyze-intent', {
        job_description: jobDescription,
        client_id: formik.values.client_id || null,
      });
      const d = res.data.data || res.data;
      setSessionData(d);

      const serviceLabel = (d.service_type || 'general').replace(/_/g, ' ');
      await addAiMessageDelayed(`I see you need **${serviceLabel}** work. Let me ask a few quick questions to generate an accurate quote.`, 800);

      if (d.questions?.length > 0) {
        setQuestions(d.questions);
        setCurrentQuestionIndex(0);
        setChatState('questioning');
        await addAiMessageDelayed(d.questions[0].text, 600);
      } else {
        // No questions needed — go straight to generate
        await handleGenerate(d, {});
      }
    } catch {
      setChatState('error');
      addMessage('ai', '❌ Something went wrong analyzing your request. Try again?');
    }
  };

  // ── Step 2: Answer Questions ──
  const handleAnswer = async (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    addMessage('user', answer);

    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < questions.length) {
      setCurrentQuestionIndex(nextIdx);
      await addAiMessageDelayed(questions[nextIdx].text, 500);
    } else {
      // All questions answered → generate
      const answersArray = Object.entries(newAnswers).map(([id, ans]) => ({ id, answer: ans }));
      await handleGenerate(sessionData, answersArray);
    }
  };

  const handleTextAnswer = () => {
    if (!userInput.trim()) return;
    const q = questions[currentQuestionIndex];
    handleAnswer(q.id, userInput.trim());
    setUserInput('');
  };

  // ── Step 3: Generate Quote ──
  const handleGenerate = async (session, answersArray) => {
    setChatState('generating');
    await addAiMessageDelayed("Perfect! Generating your quote now...", 400);

    try {
      const res = await httpClient.post('/api/v1/ai/generate-quote-conversational', {
        session_id: session?.session_id || null,
        client_id: formik.values.client_id || null,
        job_description: jobDescription,
        answers: Array.isArray(answersArray) ? answersArray : Object.entries(answersArray).map(([id, answer]) => ({ id, answer })),
        service_type: session?.service_type || 'general',
        urgency: session?.urgency || 'normal',
        scope_hints: session?.scope_hints || [],
      });

      const data = res.data.data || res.data;
      setGeneratingProgress(100);
      setConfidenceScore(data.confidence_score ?? null);
      setDataSource(data.data_source ?? null);

      setChatState('done');
      addMessage('ai', '✅ Your quote is ready!');
      showToast("✨ AI Quote Generated Successfully!", "success");
      applyQuoteToForm(data);
    } catch {
      setChatState('error');
      addMessage('ai', '❌ Failed to generate quote. Please try again.');
    }
  };

  // ── Reset ──
  const handleReset = () => {
    setChatState('idle');
    setMessages([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSessionData(null);
    setConfidenceScore(null);
    setDataSource(null);
    setJobDescription('');
    setUserInput('');
  };
  
  // Check if we have a pre-selected client and it exists in the clients list
  // Use String() to handle type mismatch (client.id is number, formik value is string)
  const hasPreSelectedClient = formik.values.client_id && 
    clients.some(client => String(client.id) === String(formik.values.client_id));

  const handleClientChange = (event) => {
    const clientId = event.target.value;
    setSelectedClient(clientId);

    // Use String() to handle type mismatch (c.id is number, clientId from event is string)
    const client = clients.find(c => String(c.id) === String(clientId));

    if (client) {
      const displayName = getClientDisplayName(client);

      formik.setFieldValue('client_id', clientId);
      formik.setFieldValue('client_name', displayName);
      formik.setFieldValue('client_email', client.email || '');
      formik.setFieldTouched('client_id', true, false);
    } else {
      formik.setFieldValue('client_id', '');
      formik.setFieldValue('client_name', '');
      formik.setFieldValue('client_email', '');
    }
  };

  useEffect(() => {
    if (formik.values.client_id && formik.values.client_id !== selectedClient) {
      setSelectedClient(formik.values.client_id);
    }
  }, [formik.values.client_id]);

  // Determine if select should be disabled
  // Only disable if loading AND we don't have the pre-selected client yet
  const shouldDisableSelect = loadingClients && !hasPreSelectedClient;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        mb: 4,
        borderRadius: 2,
        backgroundColor: '#fff'
      }}
    >
      <style>{aiStyles}</style>
      <SectionHeader number="1" title="Quote Details" />

      <Grid container spacing={3}>
        {/* Row 1: Quote Title and Quote Due Date */}
        <Grid item xs={12} md={6}>
          <DebouncedTextField
            name="title"
            label="Quote Title"
            value={formik.values.title}
            onChange={(value) => formik.setFieldValue('title', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomDatePicker
            name="quote_due_date"
            label="Quote Due Date"
            placeholder="DD/MM/YYYY"
            value={formik.values.quote_due_date || ''}
            onChange={(value) => formik.setFieldValue('quote_due_date', value)}
            onBlur={() => formik.setFieldTouched('quote_due_date', true, true)}
            error={formik.touched.quote_due_date && Boolean(formik.errors.quote_due_date)}
            helperText={formik.touched.quote_due_date && formik.errors.quote_due_date}
          />
        </Grid>

        {/* Row 2: Client Selection and Quote Status */}
        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={formik.touched.client_id && Boolean(formik.errors.client_id)}
            required
          >
            <InputLabel id="client-select-label">Select Client</InputLabel>
            <Select
              labelId="client-select-label"
              id="client-select"
              value={selectedClient}
              label="Select Client"
              onChange={handleClientChange}
              onBlur={() => formik.setFieldTouched('client_id', true)}
              disabled={shouldDisableSelect}
              renderValue={(selected) => {
                if (loadingClients && !hasPreSelectedClient) {
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} sx={{ color: '#3574BB' }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading clients...
                      </Typography>
                    </Box>
                  );
                }
                
                if (!selected) return <em>Select a client</em>;
                // Use String() to handle type mismatch
                const client = clients.find(c => String(c.id) === String(selected));
                if (!client) return <em>Select a client</em>;

                const displayName = getClientDisplayName(client);
                const clientType = client.client_type === 'commercial' ? 'Commercial' : 'Residential';

                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: client.client_type === 'commercial' ? 'primary.main' : 'warning.main',
                        color: 'white'
                      }}
                    >
                      {client.client_type === 'commercial' ? <Business fontSize="small" /> : <Person fontSize="small" />}
                    </Avatar>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                          {displayName}
                        </Typography>
                        <Chip
                          label={client.client_type === 'commercial' ? 'Commercial' : 'Residential'}
                          size="small"
                          color={client.client_type === 'commercial' ? 'primary' : 'warning'}
                          sx={{
                            height: 18,
                            '& .MuiChip-label': {
                              fontSize: '0.7rem',
                              px: 1,
                              lineHeight: 1,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              }}
            >
              {loadingClients && !hasPreSelectedClient ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: '#3574BB' }} />
                    <Typography variant="body2">Loading clients...</Typography>
                  </Box>
                </MenuItem>
              ) : (
                clients.map((client) => {
                  const displayName = getClientDisplayName(client);
                  const isCommercial = client.client_type === 'commercial';
                  const clientType = isCommercial ? 'Commercial' : 'Residential';

                  return (
                    <MenuItem key={client.id} value={client.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: isCommercial ? 'primary.main' : 'warning.main',
                            color: 'white'
                          }}
                        >
                          {isCommercial ? <Business fontSize="small" /> : <Person fontSize="small" />}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {displayName}
                            </Typography>
                            <Chip
                              label={clientType}
                              size="small"
                              color={isCommercial ? 'primary' : 'warning'}
                              sx={{
                                height: 20,
                                '& .MuiChip-label': {
                                  fontSize: '0.7rem',
                                  px: 1,
                                  lineHeight: 1,
                                },
                              }}
                            />
                          </Box>
                          {client.email && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              {client.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </MenuItem>
                  );
                })
              )}
            </Select>
            {formik.touched.client_id && formik.errors.client_id && (
              <FormHelperText error>{formik.errors.client_id}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <DebouncedSelect
            name="status"
            label="Quote Status"
            value={formik.values.status}
            onChange={(value) => formik.setFieldValue('status', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
            options={QUOTE_STATUS_OPTIONS}
            fullWidth
          />
        </Grid>

        {/* Hidden fields for client data */}
        <input type="hidden" name="client_name" value={formik.values.client_name} />
        <input type="hidden" name="client_email" value={formik.values.client_email} />

        {/* Row 3: Currency only (full width) */}
        <Grid item xs={6}>
          <DebouncedSelect
            name="currency"
            label="Currency"
            value={formik.values.currency}
            onChange={(value) => formik.setFieldValue('currency', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.currency && Boolean(formik.errors.currency)}
            helperText={formik.touched.currency && formik.errors.currency}
            options={CURRENCIES}
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <DebouncedTextField
              name="notes"
              label="Notes / Terms"
              InputLabelProps={{ shrink: true }}
              multiline
              rows={4}
              fullWidth
              value={formik.values.notes || ''}
              onChange={(val) => formik.setFieldValue('notes', val)}
              onBlur={formik.handleBlur}
              helperText={
                isListeningNotes 
                  ? <span style={{ color: '#1976D2', display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#d32f2f', animation: 'livePulse 1s infinite', marginRight: 6 }} />
                      <strong>Live:&nbsp;</strong> {interimResult || "Listening... Start speaking."}
                    </span>
                  : undefined
              }
            />
            <Box sx={{ position: 'absolute', bottom: isListeningNotes ? 32 : 12, right: 12, zIndex: 2 }}>
              <Tooltip title={isListeningNotes ? "Stop dictating" : "Dictate with highly accurate AI"}>
                <IconButton 
                  onClick={toggleListeningNotes}
                  color={isListeningNotes ? "error" : "primary"}
                  sx={{ 
                    animation: isListeningNotes ? 'glowPulse 2s infinite' : 'none',
                    bgcolor: isListeningNotes ? 'rgba(211, 47, 47, 0.1)' : 'transparent',
                    boxShadow: isListeningNotes ? '0 0 10px rgba(211, 47, 47, 0.2)' : 'none'
                  }}
                >
                  {isListeningNotes ? <Mic /> : <MicOff />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuoteDetailsSection;