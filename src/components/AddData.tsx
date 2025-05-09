import { Button } from "./ui/button"
import { useState } from "react";
import { useActivity } from "../contexts/ActivityContext";
import { Textarea } from "./ui/textarea";
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

  const handleImport = () => {
    if (csvInput.trim()) {
      importCSV(csvInput);
    }
  };

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
            <Textarea
              placeholder="Paste CSV data here..."
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="min-h-[200px]"
            />
            <Button onClick={handleImport}>Import Garmin Data</Button>
          </div>
        </DialogContent>
      </Dialog>
  </div>
  )
}

export default AddData