import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import {
  Box,
  Button,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography
} from "@mui/material";
import { useState } from "react";

import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { RecipeStep } from "../types";
import { formatDuration } from "../utils/format";

interface RecipeInstructionsProps {
  steps: RecipeStep[];
}

const RecipeInstructions = ({ steps }: RecipeInstructionsProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const { speak, stop, status, isSupported } = useTextToSpeech();

  const handleStepChange = (step: number) => {
    setActiveStep(step);
    if (status === "speaking") stop();
  };

  const handleSpeak = () => {
    const step = steps[activeStep];
    if (!step) return;
    speak(step.instruction);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Крок за кроком</Typography>
        {isSupported && (
          <Button
            onClick={status === "speaking" ? stop : handleSpeak}
            startIcon={status === "speaking" ? <VolumeOffIcon /> : <PlayCircleIcon />}
            variant="outlined"
          >
            {status === "speaking" ? "Зупинити" : "Озвучити крок"}
          </Button>
        )}
      </Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.order} expanded>
            <StepLabel onClick={() => handleStepChange(index)} sx={{ cursor: "pointer" }}>
              <Typography variant="subtitle1">Крок {step.order}</Typography>
              {step.durationMinutes && (
                <Typography variant="caption" color="text.secondary">
                  {formatDuration(step.durationMinutes)}
                </Typography>
              )}
            </StepLabel>
            <StepContent>
              <Typography>{step.instruction}</Typography>
              {step.tip && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Порада: {step.tip}
                </Typography>
              )}
              <Button
                size="small"
                sx={{ mt: 1 }}
                onClick={() => handleStepChange(Math.min(index + 1, steps.length - 1))}
                disabled={index === steps.length - 1}
              >
                До наступного кроку
              </Button>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default RecipeInstructions;
