/**
 * Simple CSV parser for Zephyr test case files
 * No dependencies - pure JavaScript
 * 
 * Handles quoted fields with commas and escaped quotes
 */

/**
 * Parse CSV content into array of objects
 * @param {string} csvContent - CSV file content as string
 * @returns {Array<Object>} Array of row objects with column headers as keys
 */
function parseCSV(csvContent) {
  const lines = splitCSVIntoRows(csvContent.trim());
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const values = parseCSVLine(lines[i]);
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }

  return rows;
}

/**
 * Split CSV content into rows, respecting quoted fields with newlines
 * @param {string} csvContent - Raw CSV content
 * @returns {Array<string>} Array of CSV row strings
 */
function splitCSVIntoRows(csvContent) {
  const rows = [];
  let currentRow = '';
  let insideQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    
    if (char === '"') {
      // Handle escaped quotes ("" inside quoted field)
      if (insideQuotes && csvContent[i + 1] === '"') {
        currentRow += '""';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
        currentRow += char;
      }
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      // Row separator found outside quotes
      if (currentRow.trim()) {
        rows.push(currentRow);
        currentRow = '';
      }
      // Skip \r\n sequences
      if (char === '\r' && csvContent[i + 1] === '\n') {
        i++;
      }
    } else {
      currentRow += char;
    }
  }
  
  // Add last row if not empty
  if (currentRow.trim()) {
    rows.push(currentRow);
  }
  
  return rows;
}

/**
 * Parse a single CSV line handling quotes and commas
 * @param {string} line - Single CSV line
 * @returns {Array<string>} Array of field values
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // Handle escaped quotes ("" inside quoted field)
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator found outside quotes
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  
  return result;
}

// Export functions
module.exports = { parseCSV, parseCSVLine };
