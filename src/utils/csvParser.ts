
import type { Activity } from "../types/activity";

export const parseCSV = (csvData: string): Activity[] => {
  // Split the input by rows and ignore empty rows
  const rows = csvData
    .split("\n")
    .filter(row => row.trim().length > 0);
  
  const activities: Activity[] = [];
  
  for (const row of rows) {
    // Split by commas, but respect quoted values
    const parsedRow = parseCSVRow(row);
    
    if (parsedRow.length >= 26) {
      activities.push({
        activityType: parsedRow[0],
        date: parsedRow[1],
        favorite: parsedRow[2].toLowerCase() === "true",
        title: parsedRow[3].replace(/"/g, ""),
        distance: parsedRow[4].replace(/"/g, ""),
        calories: parsedRow[5].replace(/"/g, ""),
        time: parsedRow[6].replace(/"/g, ""),
        avgHR: parsedRow[7].replace(/"/g, ""),
        maxHR: parsedRow[8].replace(/"/g, ""),
        avgRunCadence: parsedRow[9].replace(/"/g, ""),
        maxRunCadence: parsedRow[10].replace(/"/g, ""),
        avgPace: parsedRow[11].replace(/"/g, ""),
        bestPace: parsedRow[12].replace(/"/g, ""),
        totalAscent: parsedRow[13].replace(/"/g, ""),
        totalDescent: parsedRow[14].replace(/"/g, ""),
        avgStrideLength: parsedRow[15].replace(/"/g, ""),
        trainingStressScore: parsedRow[16].replace(/"/g, ""),
        steps: parsedRow[17].replace(/"/g, "").replace(",", ""),
        minTemp: parsedRow[18].replace(/"/g, ""),
        decompression: parsedRow[19].replace(/"/g, ""),
        bestLapTime: parsedRow[20].replace(/"/g, ""),
        numberOfLaps: parsedRow[21].replace(/"/g, ""),
        maxTemp: parsedRow[22].replace(/"/g, ""),
        movingTime: parsedRow[23].replace(/"/g, ""),
        elapsedTime: parsedRow[24].replace(/"/g, ""),
        minElevation: parsedRow[25].replace(/"/g, ""),
        maxElevation: parsedRow[26]?.replace(/"/g, "") || "",
      });
    }
  }
  
  return activities;
};

// Helper function to parse CSV row with support for quoted values
const parseCSVRow = (row: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"' && row[i-1] !== '\\') {
      inQuotes = !inQuotes;
      continue;
    }
    
    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    
    current += char;
  }
  
  if (current) {
    result.push(current);
  }
  
  return result;
};