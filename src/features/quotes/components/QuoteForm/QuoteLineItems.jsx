// features/quotes/components/QuoteForm/QuoteLineItems.jsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Typography, Button, IconButton, Paper, Grid, TextField, LinearProgress, InputAdornment, Tooltip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, AutoAwesome, EditNote, Search, DocumentScanner, Hardware, Engineering, TaskAlt, Mic, MicOff } from '@mui/icons-material';
import DebouncedTextField from '../../../../components/common/form/DebouncedTextField';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import httpClient from '../../../../services/api/httpClient';

const QuoteLineItems = ({ formik, defaultTaxRate = 0 }) => {
    const { values, setFieldValue, errors, touched, setFieldTouched } = formik;
    const [mode, setMode] = useState('manual'); // 'manual' | 'ai'
    const [jobDescription, setJobDescription] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [aiProgress, setAiProgress] = useState(0);
    const [aiStatusIdx, setAiStatusIdx] = useState(0);

    // Speech-to-Text State
    const [isListeningAI, setIsListeningAI] = useState(false);
    const [interimResult, setInterimResult] = useState('');
    const recognitionRef = useRef(null);
    const descriptionRef = useRef(jobDescription);

    useEffect(() => {
        descriptionRef.current = jobDescription;
    }, [jobDescription]);

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
                
                // Save final block config
                if (finalTranscript) {
                    const currentDesc = descriptionRef.current;
                    const newDesc = currentDesc.length > 0 && !currentDesc.endsWith(' ') && !currentDesc.endsWith('\n')
                        ? currentDesc + ' ' + finalTranscript 
                        : currentDesc + finalTranscript;
                        
                    setJobDescription(newDesc);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                if (event.error !== 'no-speech') {
                    setIsListeningAI(false);
                    setInterimResult('');
                }
            };

            recognitionRef.current.onend = () => {
                setIsListeningAI(false);
                setInterimResult('');
            };
        }
        
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListeningAI = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
            return;
        }
        
        if (isListeningAI) {
            recognitionRef.current.stop();
            setIsListeningAI(false);
            setInterimResult('');
        } else {
            try {
                recognitionRef.current.start();
                setIsListeningAI(true);
                setInterimResult('');
            } catch (e) {
                console.error(e);
                setIsListeningAI(false);
            }
        }
    };

    const statuses = [
        { text: 'Analyzing job description...', icon: <Search sx={{ fontSize: 20 }} /> },
        { text: 'Extracting key requirements...', icon: <DocumentScanner sx={{ fontSize: 20 }} /> },
        { text: 'Estimating material costs...', icon: <Hardware sx={{ fontSize: 20 }} /> },
        { text: 'Calculating labor estimates...', icon: <Engineering sx={{ fontSize: 20 }} /> },
        { text: 'Finalizing formatting...', icon: <TaskAlt sx={{ fontSize: 20 }} /> },
    ];

    const handleAddLineItem = () => {
        const newItem = {
            item_name: '', description: '', quantity: 1,
            unit_price: 1, tax_rate: defaultTaxRate, package_id: null,
        };
        const newItems = [...values.line_items, newItem];
        setFieldValue('line_items', newItems);
        setTimeout(() => {
            setFieldTouched(`line_items[${newItems.length - 1}].item_name`, true, false);
            setFieldTouched(`line_items[${newItems.length - 1}].quantity`, true, false);
            setFieldTouched(`line_items[${newItems.length - 1}].unit_price`, true, false);
        }, 100);
    };

    const handleRemoveLineItem = (index) => {
        const updatedItems = values.line_items.filter((_, i) => i !== index);
        setFieldValue('line_items', updatedItems);
    };

    const handleNumberKeyDown = (e) => {
        if (e.key === '-' || e.key === 'e') e.preventDefault();
    };

    const handleNumberBlur = (index, field, currentValue) => {
        let finalValue = currentValue;
        if (field === 'quantity') {
            if (currentValue === '' || currentValue === null || currentValue < 1) finalValue = 1;
        } else if (field === 'unit_price') {
            if (currentValue === '' || currentValue === null || currentValue < 0) finalValue = 0;
        } else if (field === 'tax_rate') {
            if (currentValue === '' || currentValue === null || currentValue < 0) finalValue = 0;
            else if (currentValue > 100) finalValue = 100;
        }
        if (finalValue !== currentValue) {
            const updatedItems = [...values.line_items];
            updatedItems[index][field] = finalValue;
            setFieldValue('line_items', updatedItems);
        }
        setFieldTouched(`line_items[${index}].${field}`, true, false);
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...values.line_items];
        if (field === 'item_name' || field === 'description') {
            updatedItems[index][field] = value || '';
        } else {
            if (value === '') {
                updatedItems[index][field] = '';
            } else {
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) updatedItems[index][field] = numValue;
            }
        }
        setFieldValue('line_items', updatedItems);
    };

    const handleGenerateWithAI = async () => {
        if (!jobDescription.trim()) return;
        setAiLoading(true);
        setAiError('');
        setAiProgress(0);
        setAiStatusIdx(0);

        let progressInterval;
        let statusInterval;

        try {
            // Fake progress loading UX
            progressInterval = setInterval(() => {
                setAiProgress(prev => {
                    if (prev >= 95) return 95;
                    return prev + Math.floor(Math.random() * 15) + 5;
                });
            }, 600);

            statusInterval = setInterval(() => {
                setAiStatusIdx(prev => Math.min(prev + 1, statuses.length - 1));
            }, 900);

            const res = await httpClient.post('/api/v1/ai/generate-line-items', {
                job_description: jobDescription,
                client_id: formik.values.client_id || null,
            });
            const data = res.data.data || res.data;
            if (data.line_items?.length > 0) {
                const items = data.line_items.map(item => ({
                    item_name: item.item_name || '',
                    description: item.description || '',
                    quantity: item.quantity || 1,
                    unit_price: item.unit_price || 0,
                    tax_rate: item.tax_rate || defaultTaxRate,
                    package_id: null,
                }));
                clearInterval(progressInterval);
                clearInterval(statusInterval);
                setAiProgress(100);
                setTimeout(() => {
                    setFieldValue('line_items', items);
                    setMode('manual');
                    setJobDescription('');
                }, 500);
            } else {
                setAiError('AI could not generate items. Try a more detailed description.');
            }
        } catch (err) {
            setAiError(err.response?.data?.message || 'Failed to generate items. Please try again.');
        } finally {
            clearInterval(progressInterval);
            clearInterval(statusInterval);
            setTimeout(() => setAiLoading(false), 500);
        }
    };

    const calculateItemTotal = (item) => {
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        const unitPrice = typeof item.unit_price === 'number' ? item.unit_price : 0;
        const taxRate = typeof item.tax_rate === 'number' ? item.tax_rate : 0;
        const subtotal = quantity * unitPrice;
        return subtotal + subtotal * (taxRate / 100);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: values.currency || 'USD',
        }).format(amount);
    };

    const getItemError = (index, field) => {
        return errors.line_items?.[index]?.[field] && touched.line_items?.[index]?.[field]
            ? errors.line_items[index][field] : null;
    };

    const allItemsValid = values.line_items.every(item =>
        item.item_name && item.item_name.trim().length > 0 &&
        typeof item.quantity === 'number' && item.quantity > 0 &&
        typeof item.unit_price === 'number' && item.unit_price > 0
    );

    useEffect(() => {
        values.line_items.forEach((_, index) => {
            setFieldTouched(`line_items[${index}].item_name`, true, false);
            setFieldTouched(`line_items[${index}].quantity`, true, false);
            setFieldTouched(`line_items[${index}].unit_price`, true, false);
        });
    }, []);

    return (
        <Box sx={{ mt: 3 }}>
            <SectionHeader number="2" title="Line Items & Packages" />

            {/* AI Mode Button */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: 1 }}>
                <Button
                    variant={mode === 'ai' ? 'contained' : 'outlined'}
                    startIcon={<AutoAwesome />}
                    onClick={() => setMode('ai')}
                    size="small"
                    sx={{
                        textTransform: 'none', borderRadius: '8px',
                        fontWeight: 600,
                        ...(mode === 'ai' ? {
                            background: 'linear-gradient(135deg, #1976D2, #1565C0)',
                            color: '#fff',
                            boxShadow: '0 4px 10px rgba(25,118,210,0.3)',
                            '&:hover': { background: 'linear-gradient(135deg, #1565C0, #0D47A1)' }
                        } : {
                            borderColor: '#1976D2', color: '#1976D2',
                            '&:hover': { borderColor: '#1565C0', bgcolor: 'rgba(25,118,210,0.05)' }
                        })
                    }}
                >
                    Generate with AI
                </Button>
            </Box>


            {/* AI Mode */}
            <AnimatePresence>
            {mode === 'ai' && (
                <Paper 
                    component={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                        opacity: 1, 
                        y: 0,
                        boxShadow: aiLoading 
                            ? ['0 0 0px rgba(25,118,210,0)', '0 0 20px rgba(25,118,210,0.4)', '0 0 0px rgba(25,118,210,0)']
                            : '0 0 0px rgba(0,0,0,0)'
                    }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ 
                        boxShadow: { repeat: Infinity, duration: 2 },
                        duration: 0.3
                    }}
                    variant="outlined" 
                    sx={{
                        p: 2.5, mb: 3, borderRadius: '12px',
                        position: 'relative', overflow: 'hidden',
                        borderColor: aiLoading ? '#1976D2' : 'rgba(25,118,210,0.3)',
                        background: 'rgba(25,118,210,0.02)',
                        transition: 'border-color 0.3s ease'
                    }}
                >
                    {/* Live Progress Bar indicator */}
                    {aiLoading && (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                            <LinearProgress variant="determinate" value={aiProgress} sx={{ height: 4, backgroundColor: 'rgba(25,118,210,0.2)', '& .MuiLinearProgress-bar': { backgroundColor: '#1976D2' } }} />
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {aiLoading ? statuses[aiStatusIdx].icon : <AutoAwesome sx={{ color: '#1976D2', fontSize: 20 }} />}
                            <Typography variant="body2" sx={{ color: '#333', fontWeight: 600 }}>
                                {aiLoading ? statuses[aiStatusIdx].text : 'Describe the job and AI will generate line items for you'}
                            </Typography>
                            {aiLoading && (
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    style={{ color: '#1976D2', fontSize: '14px', fontWeight: 'bold' }}
                                >
                                    ...
                                </motion.span>
                            )}
                        </Box>
                        {aiLoading && (
                            <Typography variant="caption" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                                {aiProgress}%
                            </Typography>
                        )}
                    </Box>

                    {isListeningAI && (
                        <Typography variant="body2" sx={{ color: '#1976D2', mb: 1, display: 'flex', alignItems: 'center' }}>
                            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#d32f2f', animation: 'livePulse 1s infinite', marginRight: 6 }} />
                            <strong>Live:&nbsp;</strong> {interimResult || "Listening... Start speaking."}
                        </Typography>
                    )}

                    <TextField
                        fullWidth multiline rows={3}
                        placeholder="e.g. Build a 5-page website with contact form, mobile responsive, SEO optimized..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        size="small"
                        disabled={aiLoading}
                        sx={{
                            mb: 2, bgcolor: 'white',
                            '& .MuiOutlinedInput-root': { borderRadius: '10px' }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" sx={{ alignSelf: 'flex-end', mb: 1, mr: 1 }}>
                                    <Tooltip title={isListeningAI ? "Stop dictating" : "Dictate your job description"}>
                                        <IconButton 
                                            onClick={toggleListeningAI}
                                            color={isListeningAI ? "error" : "primary"}
                                            sx={{ 
                                                animation: isListeningAI ? 'glowPulse 2s infinite' : 'none',
                                                bgcolor: isListeningAI ? 'rgba(211, 47, 47, 0.1)' : 'transparent'
                                            }}
                                        >
                                            {isListeningAI ? <Mic /> : <MicOff />}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                    />
                    {aiError && (
                        <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mb: 1 }}>
                            {aiError}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            onClick={handleGenerateWithAI}
                            disabled={!jobDescription.trim() || aiLoading}
                            sx={{
                                textTransform: 'none', borderRadius: '8px',
                                fontWeight: 600, letterSpacing: '0.5px',
                                background: 'linear-gradient(135deg, #1976D2, #1565C0)',
                                color: '#fff',
                                '&:hover': { background: 'linear-gradient(135deg, #1565C0, #0D47A1)' },
                                '&.Mui-disabled': {
                                    background: 'rgba(25,118,210,0.5)',
                                    color: '#fff',
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                {aiLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <AutoAwesome sx={{ fontSize: 20 }} />
                                    </motion.div>
                                ) : (
                                    <AutoAwesome sx={{ fontSize: 20 }} />
                                )}
                                {aiLoading ? 'Processing...' : 'Generate Items'}
                            </Box>
                        </Button>
                        <Button
                            variant="outlined" size="small"
                            onClick={() => { setMode('manual'); setJobDescription(''); setAiError(''); }}
                            disabled={aiLoading}
                            sx={{
                                textTransform: 'none', borderRadius: '8px',
                                borderColor: '#e0e0e0', color: '#666',
                                '&:hover': { borderColor: '#999', bgcolor: 'rgba(0,0,0,0.05)' }
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            )}
            </AnimatePresence>

            {/* Line Items */}
            <Typography variant="subtitle1" gutterBottom sx={{ color: '#666', mb: 2 }}>
                Add in Items/Packages <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>

            <Paper variant="outlined" sx={{
                mb: 3, p: 2,
                borderColor: '#e0e0e0'
            }}>
                {values.line_items.map((item, index) => (
                    <Box key={index} sx={{ mb: index < values.line_items.length - 1 ? 3 : 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Item {index + 1}
                            </Typography>
                            <IconButton
                                onClick={() => handleRemoveLineItem(index)}
                                size="small" disabled={values.line_items.length <= 1}
                                sx={{ ml: 1 }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Grid container spacing={1}>
                            <Grid item xs={12} md={3}>
                                <DebouncedTextField
                                    name={`line_items[${index}].item_name`}
                                    label="Item Name" value={item.item_name || ''}
                                    onChange={(value) => handleItemChange(index, 'item_name', value)}
                                    onBlur={() => setFieldTouched(`line_items[${index}].item_name`, true)}
                                    placeholder="Enter item name" size="small" fullWidth required
                                    error={getItemError(index, 'item_name')}
                                    helperText={getItemError(index, 'item_name')}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DebouncedTextField
                                    name={`line_items[${index}].description`}
                                    label="Description" value={item.description || ''}
                                    onChange={(value) => handleItemChange(index, 'description', value)}
                                    onBlur={() => setFieldTouched(`line_items[${index}].description`, true)}
                                    placeholder="Optional description" size="small" fullWidth
                                />
                            </Grid>
                            <Grid item xs={6} md={1.8}>
                                <DebouncedTextField
                                    name={`line_items[${index}].quantity`}
                                    label="Qty" type="number" value={item.quantity}
                                    onChange={(value) => handleItemChange(index, 'quantity', value)}
                                    onBlur={() => handleNumberBlur(index, 'quantity', item.quantity)}
                                    onKeyDown={handleNumberKeyDown}
                                    size="small" fullWidth required
                                    error={getItemError(index, 'quantity')}
                                    helperText={getItemError(index, 'quantity')}
                                    inputProps={{ min: 1, step: 1 }}
                                />
                            </Grid>
                            <Grid item xs={6} md={2.2}>
                                <DebouncedTextField
                                    name={`line_items[${index}].unit_price`}
                                    label="Unit Price" type="number" value={item.unit_price}
                                    onChange={(value) => handleItemChange(index, 'unit_price', value)}
                                    onBlur={() => handleNumberBlur(index, 'unit_price', item.unit_price)}
                                    onKeyDown={handleNumberKeyDown}
                                    size="small" fullWidth required
                                    error={getItemError(index, 'unit_price')}
                                    helperText={getItemError(index, 'unit_price')}
                                    InputProps={{
                                        startAdornment: (
                                            <span style={{ marginRight: 4 }}>
                                                {values.currency === 'USD' ? '$' : values.currency === 'EUR' ? '€' :
                                                 values.currency === 'GBP' ? '£' : values.currency === 'JPY' ? '¥' :
                                                 values.currency === 'CAD' ? 'C$' : values.currency === 'AUD' ? 'A$' : '$'}
                                            </span>
                                        ),
                                    }}
                                    inputProps={{ min: 0, step: 0.01 }}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <DebouncedTextField
                                    name={`line_items[${index}].tax_rate`}
                                    label="Tax" type="number" value={item.tax_rate}
                                    onChange={(value) => handleItemChange(index, 'tax_rate', value)}
                                    onBlur={() => handleNumberBlur(index, 'tax_rate', item.tax_rate)}
                                    onKeyDown={handleNumberKeyDown}
                                    size="small" fullWidth
                                    error={getItemError(index, 'tax_rate')}
                                    helperText={getItemError(index, 'tax_rate')}
                                    InputProps={{ endAdornment: <span style={{ marginLeft: 4 }}>%</span> }}
                                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pl: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {formatCurrency(calculateItemTotal(item))}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                ))}

                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="outlined" startIcon={<AddIcon />}
                        onClick={handleAddLineItem} size="small"
                    >
                        Add Another Item
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default QuoteLineItems;
