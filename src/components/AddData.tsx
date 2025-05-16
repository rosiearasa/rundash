import { Button } from "./ui/button"
import { useState, useEffect } from "react";
import { useActivity } from "../contexts/ActivityContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";


const AddData = () => {
  const { importCSV } = useActivity();
  const [csvInput, setCsvInput] = useState("");
  const [displayValue, setDisplayValue] = useState('');

  const handleImport = () => {
    if (csvInput.trim()) {
      importCSV(csvInput);
    }
  };
  useEffect(() => {
    // If input is longer than 500 characters, truncate with ellipsis
    if (csvInput.length > 500) {
      setDisplayValue(csvInput.substring(0, 500) + '...');
    } else {
      setDisplayValue(csvInput);
    }
  }, [csvInput]);

  return (
    <div className="flex flex-col items-end justify-start">
        <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Import Data</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Training Data</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Paste your Garmin CSV data below. Each row should contain activity data.
            </p>
            <div className="relative">
              <textarea
                placeholder="Paste CSV data here..."
                value={displayValue}
                onChange={(e) => setCsvInput(e.target.value)}
                className="min-h-[200px] w-full resize-none rounded-md border p-2"
              />
              {csvInput.length > 500 && (
                <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 text-xs px-2 py-1 rounded-md opacity-80">
                  {csvInput.length} characters
                </div>   )}
                </div>
            <Button onClick={handleImport}>Import Garmin Data</Button>
          </div>
        </DialogContent>
      </Dialog>
  </div>
  )
}

export default AddData