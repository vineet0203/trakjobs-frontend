import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

const getFileSuffix = () => new Date().toISOString().split('T')[0];

export const exportAsPDF = async (elementId, filename = 'TrakJobs_Report') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Export element not found');
  const opt = {
    margin: [8, 5],
    filename: `${filename}_${getFileSuffix()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false, scrollX: 0, scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };
  await html2pdf().set(opt).from(element).save();
};

export const exportAsExcel = (data, filename = 'TrakJobs_Report') => {
  if (!data) throw new Error('No data available for Excel export');
  const wb = XLSX.utils.book_new();
  const fmt = (val) => {
    const num = parseFloat(String(val || 0).replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? (val || '') : '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const setColWidths = (ws, cols) => { ws['!cols'] = cols.map(w => ({ wch: w })); };

  const kpiData = (data.kpi_stats || []).map(k => ({ Metric: k.label, Value: k.value, Growth: k.growth }));
  const wsKpi = XLSX.utils.json_to_sheet(kpiData);
  setColWidths(wsKpi, [30, 20, 15]);
  XLSX.utils.book_append_sheet(wb, wsKpi, 'KPI Summary');

  const jobsData = (data.recent_jobs || []).map(j => ({
    'Job #': j.job_number,
    Customer: j.customer_name,
    Employee: j.employee_name,
    Status: j.status,
    Amount: fmt(j.amount ?? j.total_amount ?? j.invoice_amount)
  }));
  const wsJobs = XLSX.utils.json_to_sheet(jobsData);
  setColWidths(wsJobs, [15, 25, 25, 15, 18]);
  XLSX.utils.book_append_sheet(wb, wsJobs, 'Jobs');

  const revenueData = (data.revenue_chart || []).map(r => ({ Month: r.month, Revenue: fmt(r.value) }));
  const wsRev = XLSX.utils.json_to_sheet(revenueData);
  setColWidths(wsRev, [15, 18]);
  XLSX.utils.book_append_sheet(wb, wsRev, 'Revenue');

  const invoiceData = (data.invoice_analytics || []).map(i => ({ Month: i.month, Paid: fmt(i.paid), Unpaid: fmt(i.unpaid), Overdue: fmt(i.overdue) }));
  const wsInv = XLSX.utils.json_to_sheet(invoiceData);
  setColWidths(wsInv, [15, 18, 18, 18]);
  XLSX.utils.book_append_sheet(wb, wsInv, 'Invoices');

  XLSX.writeFile(wb, `${filename}_${getFileSuffix()}.xlsx`);
};

export const exportAsImage = async (elementId, filename = 'TrakJobs_Report') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Export element not found');
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#f4f6fb', logging: false });
  const link = document.createElement('a');
  link.download = `${filename}_${getFileSuffix()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const printReport = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Print element not found');
  const canvas = await html2canvas(element, { scale: 1.5, useCORS: true });
  const imgData = canvas.toDataURL('image/png');
  const printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>TrakJobs Report</title><style>body{margin:0;display:flex;justify-content:center;}img{max-width:100%;height:auto;}@media print{@page{margin:10mm;}}</style></head><body><img src="' + imgData + '"/><script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();}<\/script></body></html>');
  printWindow.document.close();
};
