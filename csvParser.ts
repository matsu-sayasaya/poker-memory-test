import Papa from 'papaparse'

export interface Question {
  condition: string;
  answerB: number;
  answerC: number;
}

interface ParseResult {
  data: string[][];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

export function parseCSV(file: File): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      complete: (results: Papa.ParseResult<string[]>) => {
        try {
          if (!results.data || results.data.length < 2) {
            throw new Error('CSV file is empty or has insufficient data');
          }

          const questions: Question[] = [];
          for (let i = 1; i < results.data.length; i++) {
            const row = results.data[i];
            if (!row || (row.length === 1 && row[0] === '')) {
              break;
            }

            if (row.length < 3 || row.every(cell => !cell || cell.trim() === '')) {
              console.warn(`Skipping invalid row at line ${i + 1}: ${JSON.stringify(row)}`);
              continue;
            }
            
            const sizeValue = parseFloat(row[1].trim());
            const freqValue = parseFloat(row[2].trim());
            
            if (isNaN(sizeValue) || isNaN(freqValue)) {
              console.warn(`Skipping row with invalid number format at line ${i + 1}: Size=${row[1]}, Freq=${row[2]}`);
              continue;
            }

            questions.push({
              condition: row[0].trim(),
              answerB: sizeValue,
              answerC: freqValue,
            });
          }

          if (questions.length === 0) {
            throw new Error('No valid questions found in the CSV file');
          }

          resolve(questions);
        } catch (error) {
          reject(new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      },
      error: (error: Papa.ParseError, file?: File) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
      delimiter: ',',
      encoding: 'UTF-8',
      skipEmptyLines: true
    });
  });
}
