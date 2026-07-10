/**
 * useConversationEngine.js
 *
 * The rule-based conversation engine for TrakJobs chatbot.
 *
 * Handles all screen transitions, booking flow steps, browse flow,
 * FAQ flow, and support flow. Consumes and dispatches to useChat().
 *
 * Architecture note: adding AI in the future means replacing the
 * `handleUserText` function body with an LLM call while keeping
 * the same dispatch/state contract.
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  fetchServiceCategories,
  fetchSubCategories,
  fetchMatchingVendors,
  submitPublicBooking,
} from '../services/chatbotApi';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateDate,
  validateTime,
  validateLocation,
} from '../utils/chatbotValidation';
import FAQS from '../data/chatbotFaqs';
import { WELCOME_OPTIONS } from './useChat';

// ─── Booking Steps ─────────────────────────────────────────────────────────────

const BOOKING_STEPS = [
  'category',
  'subcategory',
  'location',
  'date',
  'time',
  'name',
  'email',
  'phone',
  'notes',
  'review',
  'confirm',
];

// ─── Time Slots ───────────────────────────────────────────────────────────────

const TIME_SLOTS = [
  { label: '9:00 AM',  value: '09:00 AM' },
  { label: '10:00 AM', value: '10:00 AM' },
  { label: '11:00 AM', value: '11:00 AM' },
  { label: '12:00 PM', value: '12:00 PM' },
  { label: '1:00 PM',  value: '01:00 PM' },
  { label: '2:00 PM',  value: '02:00 PM' },
  { label: '3:00 PM',  value: '03:00 PM' },
  { label: '4:00 PM',  value: '04:00 PM' },
  { label: '5:00 PM',  value: '05:00 PM' },
];

// ─── Support Items ─────────────────────────────────────────────────────────────

const SUPPORT_ITEMS = [
  {
    label: 'Call Us',
    sub: '+1 (800) TRAKJOBS',
    href: 'tel:+18008725562',
    icon: '📞',
    bgColor: '#dbeafe',
    external: false,
  },
  {
    label: 'WhatsApp',
    sub: 'Chat with us now',
    href: 'https://wa.me/18008725562',
    icon: '💬',
    bgColor: '#dcfce7',
    external: true,
  },
  {
    label: 'Email Support',
    sub: 'support@trakjobs.com',
    href: 'mailto:support@trakjobs.com',
    icon: '✉️',
    bgColor: '#fef9c3',
    external: false,
  },
  {
    label: 'Request Callback',
    sub: "We'll call you within 1 hour",
    href: 'mailto:support@trakjobs.com?subject=Callback Request',
    icon: '🔔',
    bgColor: '#fce7f3',
    external: false,
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useConversationEngine(chatHook) {
  const {
    state,
    addMessage,
    botReply,
    userSay,
    setScreen,
    setBookingStep,
    updateBookingData,
    setLoading,
    setError,
    reset,
  } = chatHook;

  // Cache for API data to avoid redundant calls
  const categoryCacheRef = useRef(null);
  const subCategoryCacheRef = useRef({}); // keyed by category id

  // ── Bootstrap: show welcome if no messages ──────────────────────────────────
  useEffect(() => {
    if (state.messages.length === 0) {
      addMessage({
        type: 'bot',
        text: "Hi 👋 Welcome to TrakJobs!\n\nI'm your digital assistant. I can help you book a service, browse what we offer, or answer your questions.",
        options: WELCOME_OPTIONS,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Main entry: handle quick-action button presses ─────────────────────────
  const handleQuickAction = useCallback(
    async (value, label) => {
      // User tapped a button — record it as their message
      if (label) userSay(label);

      switch (value) {
        // ── Welcome screen options ──────────────────────────────────────────
        case 'BOOK_SERVICE':
        case 'GET_QUOTE':
          setScreen('booking');
          setBookingStep('category');
          await startBookingFlow();
          break;

        case 'BROWSE_SERVICES':
          setScreen('browse');
          await startBrowseFlow();
          break;

        case 'FAQS':
          setScreen('faq');
          startFaqFlow();
          break;

        case 'CONTACT_SUPPORT':
          setScreen('support');
          startSupportFlow();
          break;

        // ── Booking steps ────────────────────────────────────────────────────
        default:
          if (state.screen === 'booking') {
            await handleBookingAction(value, label);
          } else if (state.screen === 'browse') {
            await handleBrowseAction(value, label);
          } else if (state.screen === 'faq') {
            handleFaqAction(value, label);
          }
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.screen, state.bookingStep, state.bookingData],
  );

  // ── Handle free-text input ─────────────────────────────────────────────────
  const handleUserText = useCallback(
    async (text) => {
      userSay(text);

      if (state.screen === 'booking') {
        await handleBookingText(text);
        return;
      }

      if (state.screen === 'welcome' || state.screen === 'faq') {
        // Simple keyword FAQ matching
        const lower = text.toLowerCase();
        const match = FAQS.find((faq) =>
          faq.question.toLowerCase().split(' ').some((word) => word.length > 3 && lower.includes(word)),
        );
        if (match) {
          botReply({ text: match.answer, options: [{ label: '← Back to Menu', value: 'BACK_TO_MENU' }] });
        } else {
          botReply({
            text: "I'm not sure about that, but I can help you with our services. What would you like to do?",
            options: WELCOME_OPTIONS,
          });
        }
        return;
      }

      // Fallback
      botReply({
        text: "I didn't quite catch that. Please use the options below or type your question.",
        options: WELCOME_OPTIONS,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.screen, state.bookingStep, state.bookingData],
  );

  // ── Back navigation ────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (state.screen === 'welcome') return;

    if (state.screen === 'booking') {
      const currentIndex = BOOKING_STEPS.indexOf(state.bookingStep);
      if (currentIndex > 0) {
        const prevStep = BOOKING_STEPS[currentIndex - 1];
        setBookingStep(prevStep);
        promptBookingStep(prevStep);
      } else {
        goToWelcome();
      }
      return;
    }

    goToWelcome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.screen, state.bookingStep]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function goToWelcome() {
    setScreen('welcome');
    setBookingStep(null);
    botReply({ text: 'Back to the main menu. How can I help you?', options: WELCOME_OPTIONS });
  }

  // ── Booking Flow ───────────────────────────────────────────────────────────

  async function startBookingFlow() {
    setBookingStep('category');

    // Load categories
    let categories = categoryCacheRef.current;
    if (!categories) {
      setLoading(true);
      botReply({ text: 'Let me fetch our available service categories…' }, 300);
      try {
        categories = await fetchServiceCategories();
        categoryCacheRef.current = categories;
      } catch (_) {
        categories = [];
      } finally {
        setLoading(false);
      }
    }

    if (categories.length === 0) {
      botReply({
        text: "I'm having trouble loading categories. Please try again or contact support.",
        options: [
          { label: '🔄 Retry', value: 'BOOK_SERVICE' },
          { label: '📞 Contact Support', value: 'CONTACT_SUPPORT' },
        ],
      });
      return;
    }

    const items = categories.map((c) => ({
      id: c.id,
      label: c.name,
      value: `CAT:${c.id}:${c.slug}:${c.name}`,
      sub: c.description || null,
      icon: getCategoryEmoji(c.name),
    }));

    botReply({
      text: 'Great! Let\'s get you booked. What type of service do you need?',
      meta: { type: 'cards', items },
    });
  }

  async function handleBookingAction(value, label) {
    // Category selected
    if (value.startsWith('CAT:')) {
      const [, idStr, slug, name] = value.split(':');
      updateBookingData({ categoryId: parseInt(idStr), categorySlug: slug, categoryName: name });
      setBookingStep('subcategory');
      await promptSubcategory(parseInt(idStr), name);
      return;
    }

    // Sub-category selected
    if (value.startsWith('SUB:')) {
      const [, idStr, slug, name] = value.split(':');
      updateBookingData({ subCategoryId: parseInt(idStr), subCategorySlug: slug, subCategoryName: name });
      setBookingStep('location');
      botReply({ text: `Excellent! ${name} it is. 📍\n\nWhat is your service location or address?` });
      return;
    }

    // Time slot selected
    if (value.startsWith('TIME:')) {
      const time = value.replace('TIME:', '');
      const err = validateTime(time);
      if (err) { botReply({ text: err }); return; }
      updateBookingData({ time });
      setBookingStep('name');
      botReply({ text: `${time} — perfect! 🕐\n\nWhat is your full name?` });
      return;
    }

    // Review: confirm
    if (value === 'CONFIRM_BOOKING') {
      await submitBooking();
      return;
    }

    // Review: edit restart
    if (value === 'EDIT_BOOKING') {
      setBookingStep('category');
      botReply({ text: "No problem! Let's start over from the top.", options: WELCOME_OPTIONS });
      return;
    }

    if (value === 'BACK_TO_MENU') {
      goToWelcome();
      return;
    }
  }

  async function handleBookingText(text) {
    const step = state.bookingStep;

    if (step === 'location') {
      const err = validateLocation(text);
      if (err) { botReply({ text: err }); return; }
      updateBookingData({ location: text });
      setBookingStep('date');
      botReply({
        text: `Got it! 📍 ${text}\n\nWhat date would you prefer? (Enter as YYYY-MM-DD, e.g. ${getTomorrowDate()})`,
      });
      return;
    }

    if (step === 'date') {
      const err = validateDate(text);
      if (err) { botReply({ text: err }); return; }
      updateBookingData({ date: text });
      setBookingStep('time');
      botReply({
        text: '📅 Date noted! What time works best for you?',
        meta: {
          type: 'cards',
          items: TIME_SLOTS.map((t) => ({
            id: t.value,
            label: t.label,
            value: `TIME:${t.value}`,
          })),
        },
      });
      return;
    }

    if (step === 'name') {
      const err = validateName(text);
      if (err) { botReply({ text: err }); return; }
      updateBookingData({ name: text });
      setBookingStep('email');
      botReply({ text: `Nice to meet you, ${text.split(' ')[0]}! 👋\n\nWhat is your email address?` });
      return;
    }

    if (step === 'email') {
      const err = validateEmail(text);
      if (err) { botReply({ text: err }); return; }
      updateBookingData({ email: text });
      setBookingStep('phone');
      botReply({ text: "Perfect! What's the best phone number to reach you?" });
      return;
    }

    if (step === 'phone') {
      const err = validatePhone(text);
      if (err) { botReply({ text: err }); return; }
      updateBookingData({ phone: text });
      setBookingStep('notes');
      botReply({
        text: 'Almost there! 🎉\n\nAny additional notes or special instructions? (Type "skip" to skip)',
      });
      return;
    }

    if (step === 'notes') {
      const notes = text.toLowerCase() === 'skip' ? '' : text;
      updateBookingData({ notes });
      setBookingStep('review');
      await showBookingReview({ ...state.bookingData, notes });
      return;
    }

    if (step === 'review') {
      const lower = text.toLowerCase();
      if (['yes', 'confirm', 'ok', 'book', 'proceed'].some((w) => lower.includes(w))) {
        await submitBooking();
      } else if (['no', 'edit', 'change', 'back'].some((w) => lower.includes(w))) {
        setBookingStep('category');
        botReply({ text: "No problem! Let's update your booking. Please start from the category selection.", options: WELCOME_OPTIONS });
      } else {
        botReply({
          text: "Please confirm by typing 'Yes' or 'Confirm', or type 'Edit' to make changes.",
          options: [
            { label: '✅ Confirm Booking', value: 'CONFIRM_BOOKING', primary: true },
            { label: '✏️ Edit Details', value: 'EDIT_BOOKING' },
          ],
        });
      }
      return;
    }

    // Generic fallback within booking flow
    botReply({ text: 'Please answer the question above, or type "menu" to go back.' });
  }

  async function promptSubcategory(categoryId, categoryName) {
    let subs = subCategoryCacheRef.current[categoryId];
    if (!subs) {
      setLoading(true);
      botReply({ text: `Loading ${categoryName} services…` }, 300);
      try {
        subs = await fetchSubCategories(categoryId);
        subCategoryCacheRef.current[categoryId] = subs;
      } catch (_) {
        subs = [];
      } finally {
        setLoading(false);
      }
    }

    if (subs.length === 0) {
      botReply({ text: `Sorry, no services found under ${categoryName}. Please choose another category.` });
      setBookingStep('category');
      return;
    }

    const items = subs.map((s) => ({
      id: s.id,
      label: s.name,
      value: `SUB:${s.id}:${s.slug}:${s.name}`,
      sub: s.description || null,
    }));

    botReply({
      text: `Which ${categoryName} service do you need?`,
      meta: { type: 'cards', items },
    });
  }

  function promptBookingStep(step) {
    const promptMap = {
      category: () => startBookingFlow(),
      location: () => botReply({ text: 'What is your service location or address?' }),
      date: () =>
        botReply({ text: `What date would you prefer? (YYYY-MM-DD, e.g. ${getTomorrowDate()})` }),
      time: () =>
        botReply({
          text: 'What time works best for you?',
          meta: {
            type: 'cards',
            items: TIME_SLOTS.map((t) => ({
              id: t.value,
              label: t.label,
              value: `TIME:${t.value}`,
            })),
          },
        }),
      name: () => botReply({ text: 'What is your full name?' }),
      email: () => botReply({ text: 'What is your email address?' }),
      phone: () => botReply({ text: "What's your phone number?" }),
      notes: () =>
        botReply({ text: 'Any additional notes? (Type "skip" to skip)' }),
    };
    const fn = promptMap[step];
    if (fn) fn();
  }

  async function showBookingReview(data) {
    // Build summary using current + new data
    const fullData = { ...state.bookingData, ...data };

    addMessage({
      type: 'bot',
      text: "Here's your booking summary. Please review and confirm:",
      meta: { type: 'summary', data: fullData },
      timestamp: new Date().toISOString(),
    });

    // Brief delay, then add confirm buttons
    setTimeout(() => {
      addMessage({
        type: 'bot',
        text: 'Shall I confirm this booking?',
        options: [
          { label: '✅ Confirm Booking', value: 'CONFIRM_BOOKING', primary: true },
          { label: '✏️ Edit Details', value: 'EDIT_BOOKING' },
        ],
        timestamp: new Date().toISOString(),
      });
    }, 400);
  }

  async function submitBooking() {
    setLoading(true);
    botReply({ text: 'Submitting your booking request… ⏳' }, 200);

    const d = state.bookingData;

    // Build public booking payload (matches POST /api/public/bookings)
    const payload = {
      name: d.name,
      email: d.email,
      phone: d.phone,
      location: d.location,
      service_category: d.categorySlug || d.categoryName || '',
      service_sub_category: d.subCategorySlug || d.subCategoryName || '',
      date: d.date || null,
      time: d.time || null,
      notes: d.notes || null,
    };

    // Optionally pre-select matching vendors
    try {
      if (d.categorySlug && d.subCategorySlug) {
        const vendors = await fetchMatchingVendors(d.categorySlug, d.subCategorySlug);
        if (vendors.length > 0) {
          payload.vendor_ids = vendors.slice(0, 5).map((v) => v.id);
        }
      }
    } catch (_) {
      // Non-critical — continue without vendor_ids
    }

    try {
      const response = await submitPublicBooking(payload);
      setLoading(false);

      setScreen('booking_done');
      addMessage({
        type: 'bot',
        text: null,
        meta: {
          type: 'success',
          matchedProviders: response?.data?.matched_providers ?? 0,
          isNewCustomer: response?.data?.is_new_customer ?? false,
        },
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        addMessage({
          type: 'bot',
          text: 'Is there anything else I can help you with?',
          options: WELCOME_OPTIONS,
          timestamp: new Date().toISOString(),
        });
        setScreen('welcome');
      }, 800);
    } catch (err) {
      setLoading(false);
      const errText =
        err?.message?.includes('422')
          ? 'Some information seems invalid. Please check your details and try again.'
          : 'Something went wrong submitting your request. Please try again or contact support.';

      addMessage({
        type: 'bot',
        text: null,
        meta: { type: 'error', text: errText },
        timestamp: new Date().toISOString(),
      });

      addMessage({
        type: 'bot',
        text: 'What would you like to do?',
        options: [
          { label: '🔄 Try Again', value: 'CONFIRM_BOOKING' },
          { label: '📞 Contact Support', value: 'CONTACT_SUPPORT' },
          { label: '← Main Menu', value: 'BACK_TO_MENU' },
        ],
        timestamp: new Date().toISOString(),
      });
    }
  }

  // ── Browse Flow ────────────────────────────────────────────────────────────

  async function startBrowseFlow() {
    let categories = categoryCacheRef.current;
    if (!categories) {
      botReply({ text: 'Loading available services…' }, 300);
      try {
        categories = await fetchServiceCategories();
        categoryCacheRef.current = categories;
      } catch (_) {
        categories = [];
      }
    }

    if (categories.length === 0) {
      botReply({ text: 'Unable to load services. Please try again.', options: WELCOME_OPTIONS });
      return;
    }

    const items = categories.map((c) => ({
      id: c.id,
      label: c.name,
      value: `BROWSE_CAT:${c.id}`,
      sub: c.description || null,
      icon: getCategoryEmoji(c.name),
    }));

    botReply({
      text: '🔍 Here are all our service categories. Tap one to explore:',
      meta: { type: 'cards', items },
    });
  }

  async function handleBrowseAction(value, label) {
    if (value.startsWith('BROWSE_CAT:')) {
      const id = parseInt(value.replace('BROWSE_CAT:', ''));
      let subs = subCategoryCacheRef.current[id];
      if (!subs) {
        try {
          subs = await fetchSubCategories(id);
          subCategoryCacheRef.current[id] = subs;
        } catch (_) {
          subs = [];
        }
      }

      if (subs.length === 0) {
        botReply({ text: `No specific services listed under ${label} yet.` });
        return;
      }

      const items = subs.map((s) => ({
        id: s.id,
        label: s.name,
        value: `BROWSE_SUB:${s.id}:${encodeURIComponent(s.name)}`,
        sub: s.description || null,
      }));

      botReply({
        text: `Here are the services under **${label}**:`,
        meta: { type: 'cards', items },
      });
      return;
    }

    if (value.startsWith('BROWSE_SUB:')) {
      const parts = value.split(':');
      const name = decodeURIComponent(parts.slice(2).join(':'));
      botReply({
        text: `📌 ${name}\n\nWould you like to book this service?`,
        options: [
          { label: '📅 Book This Service', value: 'BOOK_SERVICE', primary: true },
          { label: '🔍 Browse More', value: 'BROWSE_SERVICES' },
        ],
      });
      return;
    }

    if (value === 'BACK_TO_MENU') {
      goToWelcome();
    }
  }

  // ── FAQ Flow ───────────────────────────────────────────────────────────────

  function startFaqFlow() {
    const items = FAQS.map((faq) => ({
      id: faq.id,
      label: faq.question,
      value: `FAQ:${faq.id}`,
    }));

    botReply({
      text: '❓ Here are some frequently asked questions. Select one to read the answer:',
      meta: { type: 'cards', items },
    });
  }

  function handleFaqAction(value, label) {
    if (value.startsWith('FAQ:')) {
      const id = value.replace('FAQ:', '');
      const faq = FAQS.find((f) => f.id === id);
      if (faq) {
        botReply({
          text: faq.answer,
          options: [
            { label: '← More FAQs', value: 'FAQS' },
            { label: '📅 Book a Service', value: 'BOOK_SERVICE', primary: true },
          ],
        });
      }
      return;
    }

    if (value === 'FAQS') {
      startFaqFlow();
      return;
    }

    if (value === 'BACK_TO_MENU') {
      goToWelcome();
    }
  }

  // ── Support Flow ───────────────────────────────────────────────────────────

  function startSupportFlow() {
    botReply({
      text: '👋 Our team is here to help! Choose how you\'d like to reach us:',
      meta: { type: 'support', items: SUPPORT_ITEMS },
    });

    setTimeout(() => {
      addMessage({
        type: 'bot',
        text: 'Anything else I can help you with?',
        options: WELCOME_OPTIONS,
        timestamp: new Date().toISOString(),
      });
    }, 600);
  }

  // ── Utility ────────────────────────────────────────────────────────────────

  return { handleQuickAction, handleUserText, handleBack };
}

// ─── Category Emoji Mapping ───────────────────────────────────────────────────

function getCategoryEmoji(name = '') {
  const n = name.toLowerCase();
  if (n.includes('home') || n.includes('repair'))   return '🏠';
  if (n.includes('electric'))                        return '⚡';
  if (n.includes('plumb'))                           return '🚿';
  if (n.includes('paint') || n.includes('wall'))     return '🎨';
  if (n.includes('carpent') || n.includes('wood'))   return '🪵';
  if (n.includes('clean'))                           return '✨';
  if (n.includes('applian'))                         return '🔧';
  if (n.includes('outdoor') || n.includes('garden')) return '🌿';
  if (n.includes('smart') || n.includes('tech'))     return '📡';
  if (n.includes('moving') || n.includes('support')) return '📦';
  if (n.includes('auto'))                            return '🚗';
  return '🛠️';
}

function getTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}
