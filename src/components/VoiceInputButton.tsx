import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { Button, Tooltip } from "@mui/material";
import { useEffect } from "react";

import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
}

const VoiceInputButton = ({ onTranscript }: VoiceInputButtonProps) => {
  const { status, error, listen, stop, subscribe, isSupported } = useSpeechRecognition();

  useEffect(() => subscribe(onTranscript), [subscribe, onTranscript]);

  if (!isSupported) {
    return (
      <Tooltip title="Розпізнавання мовлення не підтримується">
        <span>
          <Button variant="outlined" color="inherit" disabled startIcon={<KeyboardVoiceIcon />}>
            Голос
          </Button>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={error ?? (status === "listening" ? "Зупинити" : "Надиктувати інгредієнти")}> 
      <Button
        variant={status === "listening" ? "contained" : "outlined"}
        color={status === "listening" ? "secondary" : "inherit"}
        onClick={status === "listening" ? stop : listen}
        startIcon={status === "listening" ? <StopCircleIcon /> : <KeyboardVoiceIcon />}
      >
        {status === "listening" ? "Стоп" : "Голос"}
      </Button>
    </Tooltip>
  );
};

export default VoiceInputButton;
