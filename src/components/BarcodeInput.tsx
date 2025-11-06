import CameraAltIcon from "@mui/icons-material/CameraAlt";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";

import { detectBarcodeFromImage } from "../services/barcodeService";

interface BarcodeInputProps {
  onBarcodeDetected: (barcode: string) => void;
}

const BarcodeInput = ({ onBarcodeDetected }: BarcodeInputProps) => {
  const [manualCode, setManualCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = async () => {
      const result = await detectBarcodeFromImage(image);
      URL.revokeObjectURL(image.src);
      if (result) {
        setStatus(`Штрих-код розпізнано (${result.format})`);
        onBarcodeDetected(result.rawValue);
      } else {
        setStatus("Не вдалося розпізнати штрих-код. Спробуйте інший ракурс або введіть вручну.");
      }
    };
  };

  const handleManualAdd = () => {
    if (!manualCode.trim()) return;
    onBarcodeDetected(manualCode.trim());
    setManualCode("");
    setStatus("Штрих-код додано вручну");
  };

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <Button
          variant="outlined"
          startIcon={<CameraAltIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Завантажити фото штрих-коду
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <TextField
          label="Введіть штрих-код"
          value={manualCode}
          onChange={(event) => setManualCode(event.target.value)}
          InputProps={{ endAdornment: <QrCodeScannerIcon color="action" /> }}
        />
        <Button variant="contained" onClick={handleManualAdd} disabled={!manualCode.trim()}>
          Додати
        </Button>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Порада: для кращого розпізнавання тримайте штрих-код на відстані 15 см та забезпечте достатнє світло.
      </Typography>
      {status && (
        <Typography variant="body2" color="text.secondary">
          {status}
        </Typography>
      )}
    </Stack>
  );
};

export default BarcodeInput;
