import Papa from 'papaparse'

export interface Question {
  condition: string;
  answerB: number;
  answerC: number;
}

export function parseCSV(file: File): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      delimiter: ',', // Ensure this is set to comma
      encoding: 'UTF-8',
      complete: (results) => {
        try {
          if (!results.data || results.data.length < 2) {
            throw new Error('CSV file is empty or has insufficient data');
          }

          // Skip header row and process data rows until an empty row is encountered
          const questions = results.data.slice(1)
            .reduce((acc: Question[], row: any, index: number) => {
              // Stop processing if we encounter an empty row
              if (row.length === 1 && row[0] === '') {
                return acc;
              }

              // Ensure row has enough columns and is not empty
              if (row.length < 3 || row.every((cell: string) => cell.trim() === '')) {
                console.warn(`Skipping invalid row at line ${index + 2}: ${JSON.stringify(row)}`);
                return acc;
              }
              
              // Convert string numbers to actual numbers
              const sizeValue = parseFloat(String(row[1]).trim());
              const freqValue = parseFloat(String(row[2]).trim());
              
              if (isNaN(sizeValue) || isNaN(freqValue)) {
                console.warn(`Skipping row with invalid number format at line ${index + 2}: Size=${row[1]}, Freq=${row[2]}`);
                return acc;
              }

              acc.push({
                condition: String(row[0]).trim(),
                answerB: sizeValue,
                answerC: freqValue,
              });

              return acc;
            }, []);

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

