import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

/**
 * Format date for filename suffix (YYYY-MM-DD)
 */
const getFileSuffix = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Export as PDF using html2pdf.js
 */
export const exportAsPDF = async (elementId, filename = 'TrackJobs_Report') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Export element not found');

  const opt = {
    margin: [10, 10],
    filename: `${filename}_${getFileSuffix()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    throw error;
  }
};

/**
 * Export as Excel using xlsx
 */
export const exportAsExcel = (data, filename = 'TrackJobs_Report') => {
  try {
    if (!data) throw new Error('No data available for Excel export');

    const wb = XLSX.utils.book_new();

    // KPI Summary Sheet
    const kpiData = (data.kpi_stats || []).map(k => ({ Metric: k.label, Value: k.value, Growth: k.growth }));
    const wsKpi = XLSX.utils.json_to_sheet(kpiData);
    XLSX.utils.book_append_sheet(wb, wsKpi, 'KPI Summary');

    // Jobs Sheet
    const jobsData = (data.recent_jobs || []).map(j => ({ 
      'Job #': j.job_number, 
      Customer: j.customer_name, 
      Employee: j.employee_name, 
      Status: j.status,
      Amount: j.amount 
    }));
    const wsJobs = XLSX.utils.json_to_sheet(jobsData);
    XLSX.utils.book_append_sheet(wb, wsJobs, 'Jobs');

    // Revenue Sheet
    const revenueData = (data.revenue_chart || []).map(r => ({ Month: r.month, Revenue: r.value }));
    const wsRev = XLSX.utils.json_to_sheet(revenueData);
    XLSX.utils.book_append_sheet(wb, wsRev, 'Revenue');

    // Invoices Sheet
    const invoiceData = (data.invoice_analytics || []).map(i => ({ Month: i.month, Paid: i.paid, Unpaid: i.unpaid, Overdue: i.overdue }));
    const wsInv = XLSX.utils.json_to_sheet(invoiceData);
    XLSX.utils.book_append_sheet(wb, wsInv, 'Invoices');

    XLSX.writeFile(wb, `${filename}_${getFileSuffix()}.xlsx`);
  } catch (error) {
    throw error;
  }
};

/**
 * Export as Image using html2canvas
 */
export const exportAsImage = async (elementId, filename = 'TrackJobs_Report') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Export element not found');

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f4f6fb',
      logging: false
    });
    
    const link = document.createElement('a');
    link.download = `${filename}_${getFileSuffix()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    throw error;
  }
};

/**
 * Print optimized report
 */
export const printReport = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Print element not found');

  try {
    const canvas = await html2canvas(element, { scale: 1.5, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>TrackJobs Report - ${getFileSuffix()}</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; background: #fff; }
            img { max-width: 100%; height: auto; }
            @media print {
              body { margin: 0; }
              @page { margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" />
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } catch (error) {
    throw error;
  }
};
