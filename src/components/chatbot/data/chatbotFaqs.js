/**
 * chatbotFaqs.js
 *
 * Static FAQ knowledge base for TrakJobs chatbot.
 * Replace or extend with a database/AI layer in the future.
 */

const FAQS = [
  {
    id: 'how-it-works',
    question: 'How does TrakJobs work?',
    answer:
      'TrakJobs connects you with verified local service professionals. Simply choose your service, share your details, and we match you with the best providers in your area. You\'ll receive a quote, and once accepted, a professional is assigned to your job.',
  },
  {
    id: 'working-hours',
    question: 'What are your working hours?',
    answer:
      'Most TrakJobs service providers are available Monday–Saturday, 8:00 AM – 6:00 PM. Some providers offer weekend or emergency slots. When you book, you can select your preferred date and time and we\'ll confirm availability.',
  },
  {
    id: 'payments',
    question: 'How do payments work?',
    answer:
      'Payments are made directly to your service provider after the job is completed to your satisfaction. We support cash, bank transfer, and digital payments. A deposit may be required for large jobs.',
  },
  {
    id: 'cancellation',
    question: 'What is your cancellation policy?',
    answer:
      'You can cancel or reschedule a booking up to 24 hours in advance at no charge. Cancellations within 24 hours may incur a small fee. Contact your assigned provider directly or reach our support team.',
  },
  {
    id: 'coverage',
    question: 'Which areas do you cover?',
    answer:
      'TrakJobs currently operates across major metropolitan areas. When you submit a booking request, we automatically match you with providers in your location. If no provider is available, we\'ll notify you.',
  },
  {
    id: 'safety',
    question: 'Are your service providers verified?',
    answer:
      'Yes. All TrakJobs professionals go through a verification process including identity checks, background screening, and skills assessment before they are listed on our platform.',
  },
  {
    id: 'quote',
    question: 'How do I get a quote?',
    answer:
      'Simply start a booking or use the "Get a Quote" option. Share the service you need, your location, preferred date/time, and any notes. We\'ll match you with providers who will send you a competitive quote.',
  },
  {
    id: 'tracking',
    question: 'Can I track my service request?',
    answer:
      'Yes. Once you set up your TrakJobs account (a setup link is emailed after your first booking), you can log in to your customer portal to view quotes, track job status, and communicate with your provider.',
  },
];

export default FAQS;
