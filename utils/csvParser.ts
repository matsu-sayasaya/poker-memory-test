import Papa from 'papaparse'

export interface Question {
  condition: string;
  answerB: number;
  answerC: number;
}

export function parseCSV(file: File): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      delimiter: ',',
      encoding: 'UTF-8',
      complete: (results) => {
        try {
          if (!results.data || results.data.length < 2) {
            throw new Error('CSV file is empty or has insufficient data');
          }

          // Skip header row and process data rows until an empty row is encountered
          const questions = [];
          for (let i = 1; i < results.data.length; i++) {
            const row = results.data[i];
            // Stop processing if we encounter an empty row
            if (row.length === 1 && row[0] === '') {
              break;
            }

            // Ensure row has enough columns and is not empty
            if (row.length < 3 || row.every(cell => cell === '')) {
              console.warn(`Skipping invalid row at line ${i + 1}: ${JSON.stringify(row)}`);
              continue;
            }
            
            // Convert string numbers to actual numbers
            const sizeValue = parseFloat(String(row[1]).trim());
            const freqValue = parseFloat(String(row[2]).trim());
            
            if (isNaN(sizeValue) || isNaN(freqValue)) {
              console.warn(`Skipping row with invalid number format at line ${i + 1}: Size=${row[1]}, Freq=${row[2]}`);
              continue;
            }

            questions.push({
              condition: String(row[0]).trim(),
              answerB: sizeValue,
              answerC: freqValue,
            });
          }

          if (questions.length === 0) {
            throw new Error('No valid questions found in the CSV file');
          }

          resolve(questions);
        } catch (error) {
          reject(new Error(`Failed to parse CSV: ${error.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
}

