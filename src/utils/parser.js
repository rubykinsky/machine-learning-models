// parser.js

/**
 * Parses data from a CSV string into an array of objects.
 *
 * @param {string} csvString The CSV string to parse.
 * @param {object} options Optional configuration options.
 * @param {string} [options.delimiter=","] The delimiter used in the CSV string.
 * @param {boolean} [options.header=true] Whether the first row is a header row.
 * @returns {Array<object>} An array of objects representing the parsed data.  Returns an empty array if csvString is empty or invalid.
 * @throws {Error} If the CSV string is malformed (e.g., inconsistent number of columns).
 */
function parseCSV(csvString, options = {}) {
  if (!csvString) {
    return [];
  }

  const delimiter = options.delimiter || ",";
  const hasHeader = options.header !== false; // Default to true

  const lines = csvString.trim().split("\n");
  if (lines.length === 0) {
    return [];
  }

  const headers = hasHeader ? lines.shift().split(delimiter).map(h => h.trim()) : [];
  const data = [];

  if (!hasHeader) {
    // Generate generic headers like "column1", "column2", etc.
    for (let i = 0; i < lines[0].split(delimiter).length; i++) {
      headers.push(`column${i + 1}`);
    }
  }

  for (const line of lines) {
    const values = line.split(delimiter).map(v => v.trim());

    if (values.length !== headers.length) {
      throw new Error("Malformed CSV: Inconsistent number of columns.");
    }

    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = values[i];
    }
    data.push(obj);
  }

  return data;
}

/**
 * Parses data from a JSON string into a JavaScript object.
 *
 * @param {string} jsonString The JSON string to parse.
 * @returns {object|Array<any>} The parsed JavaScript object or array. Returns null if jsonString is empty or invalid.
 * @throws {Error} If the JSON string is malformed.
 */
function parseJSON(jsonString) {
  if (!jsonString) {
    return null;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Malformed JSON: ${error.message}`);
  }
}


/**
 * Parses data from a string based on the specified data format.
 *
 * @param {string} dataString The data string to parse.
 * @param {string} format The format of the data string ("csv" or "json").
 * @param {object} options Optional configuration options.  Passed to the underlying parser.
 * @returns {Array<object>|object|null} The parsed data.
 * @throws {Error} If the format is not supported or if the underlying parser throws an error.
 */
function parseData(dataString, format, options = {}) {
  switch (format.toLowerCase()) {
    case "csv":
      return parseCSV(dataString, options);
    case "json":
      return parseJSON(dataString);
    default:
      throw new Error(`Unsupported data format: ${format}`);
  }
}


module.exports = {
  parseCSV,
  parseJSON,
  parseData,
};