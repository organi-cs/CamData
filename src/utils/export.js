// src/utils/export.js
/**
 * Export utilities for CamData datasets
 * Supports CSV, JSON, and PDF export formats
 */

/**
 * Export data as CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the exported file (without extension)
 */
export function exportToCSV(data, filename = 'dataset') {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value ?? '';
        });
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    downloadFile(csvString, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export data as JSON file
 * @param {Array|Object} data - Data to export
 * @param {string} filename - Name of the exported file (without extension)
 */
export function exportToJSON(data, filename = 'dataset') {
    if (!data) {
        console.warn('No data to export');
        return;
    }

    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, `${filename}.json`, 'application/json');
}

/**
 * Export data as simple PDF (using browser print)
 * @param {Array} data - Array of objects to export
 * @param {string} title - Title for the PDF
 * @param {Object} options - Additional options
 */
export function exportToPDF(data, title = 'CamData Export', options = {}) {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    const headers = Object.keys(data[0]);

    // Create printable HTML
    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; padding: 20px; }
        h1 { color: #1e293b; border-bottom: 3px solid #FFCC33; padding-bottom: 10px; }
        .meta { color: #64748b; font-size: 12px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #f8fafc; color: #1e293b; font-weight: 600; text-align: left; padding: 10px 8px; border-bottom: 2px solid #e2e8f0; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b; }
        tr:nth-child(even) { background: #f8fafc; }
        .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
        .romduol { color: #FFCC33; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="meta">
        <strong>Source:</strong> CamData Open Data Portal<br>
        <strong>Exported:</strong> ${new Date().toLocaleString()}<br>
        <strong>Rows:</strong> ${data.length}
        ${options.ministry ? `<br><strong>Ministry:</strong> ${options.ministry}` : ''}
      </div>
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${data.slice(0, 100).map(row => `
            <tr>${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}</tr>
          `).join('')}
        </tbody>
      </table>
      ${data.length > 100 ? '<p style="color:#94a3b8;font-size:12px;">Showing first 100 rows...</p>' : ''}
      <div class="footer">
        <span class="romduol">◆</span> Powered by CamData | camdata.gov.kh
      </div>
    </body>
    </html>
  `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
}

/**
 * Helper function to download a file
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export handler that supports multiple formats
 * @param {Array} data - Data to export
 * @param {string} format - 'csv' | 'json' | 'pdf'
 * @param {string} filename - Base filename
 * @param {Object} options - Additional options (for PDF)
 */
export function exportData(data, format, filename = 'camdata-export', options = {}) {
    switch (format.toLowerCase()) {
        case 'csv':
            exportToCSV(data, filename);
            break;
        case 'json':
            exportToJSON(data, filename);
            break;
        case 'pdf':
            exportToPDF(data, options.title || filename, options);
            break;
        default:
            console.warn(`Unsupported export format: ${format}`);
    }
}

export default {
    exportToCSV,
    exportToJSON,
    exportToPDF,
    exportData,
};
