import Papa from 'papaparse';

export interface Question {
  condition: string;
  answerB: number;
  answerC: number;
}

interface LocalFile extends File {
  path?: string;
}


export function parseCSV(file: LocalFile | string): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      Papa.parse<string[]>(file, {
        header: false, // ヘッダー行はないためfalseに変更
        complete: (results) => {
          try {
            if (!results.data || results.data.length < 2) {
              throw new Error('CSV file is empty or has insufficient data');
            }

            // Skip header row and process data rows until an empty row is encountered
            const questions: Question[] = [];
            for (let i = 0; i < results.data.length; i++) { // ヘッダー行がないので0から開始
              const row = results.data[i];
              // Stop processing if we encounter an empty row
              if (!row || (row.length === 1 && row[0] === '')) {
                break;
              }

              // Ensure row has enough columns and is not empty
              if (row.length < 3 || row.every(cell => !cell || cell.trim() === '')) {
                console.warn(`Skipping invalid row at line ${i + 1}: ${JSON.stringify(row)}`);
                continue;
              }

              // Convert string numbers to actual numbers
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
            reject(new Error(`CSV parsing error: ${error.message} (type: ${error.type}, code: ${error.code})`));
        },
        delimiter: ',',      // Use comma as delimiter
        encoding: 'UTF-8',   // Specify UTF-8 encoding
        skipEmptyLines: true // Skip empty lines automatically
      });
    });
}