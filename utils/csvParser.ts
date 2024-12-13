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
            header: false,
            complete: (results) => {
                try {
                    if (!results.data || results.data.length < 2) {
                        throw new Error('CSV file is empty or has insufficient data');
                    }

                    const questions: Question[] = [];
                    for (let i = 0; i < results.data.length; i++) {
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
            error: (error: Papa.ParseError) => {
                reject(new Error(`CSV parsing error: ${error.message} (type: ${error.type}, code: ${error.code})`));
            },
            delimiter: ',',
            encoding: 'UTF-8',
            skipEmptyLines: true,
        });
    });
}