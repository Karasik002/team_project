import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { usePantryStore } from "../store/pantryStore";
import { Recipe } from "../types";
import NutritionRadar from "../components/NutritionRadar";
import RecipeInstructions from "../components/RecipeInstructions";

interface AssistantLocationState {
  recipe?: Recipe;
}

const Assistant = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pantry = usePantryStore((state) => state.pantry);
  const state = location.state as AssistantLocationState | null;
  const recipe = state?.recipe;
  const [stepIndex, setStepIndex] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const { speak, stop, status: ttsStatus, isSupported: ttsSupported } = useTextToSpeech();
  const { listen, stop: stopListening, subscribe, status: voiceStatus, isSupported: voiceSupported } =
    useSpeechRecognition();

  const startSession = () => {
    setSessionActive(true);
    setStepIndex(0);
    if (voiceSupported) listen();
  };

  const handlePause = () => {
    setSessionActive(false);
    stop();
    stopListening();
  };

  const nextStep = () => {
    if (!recipe) return;
    setStepIndex((prev) => Math.min(prev + 1, recipe.instructions.length - 1));
  };

  const previousStep = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const replayStep = () => {
    if (!recipe) return;
    const step = recipe.instructions[stepIndex];
    if (!step) return;
    speak(`Повторюю. ${step.instruction}`);
  };

  useEffect(() => {
    if (!sessionActive || !recipe) return;
    const step = recipe.instructions[stepIndex];
    if (!step) return;
    speak(`Крок ${step.order}. ${step.instruction}`);
  }, [sessionActive, recipe, stepIndex, speak]);

  useEffect(() => {
    return subscribe((command) => {
      if (!sessionActive) return;
      const text = command.toLowerCase();
      if (text.includes("стоп")) {
        handlePause();
        return;
      }
      if (text.includes("повтор")) {
        replayStep();
      } else if (text.includes("далі")) {
        nextStep();
      } else if (text.includes("назад")) {
        previousStep();
      }

      if (sessionActive) {
        listen();
      }
    });
  }, [sessionActive, subscribe, handlePause, replayStep, nextStep, previousStep, listen]);

  useEffect(() => {
    if (!recipe) {
      setSessionActive(false);
    }
  }, [recipe]);

  if (!recipe) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Кухонний асистент
        </Typography>
        <Typography color="text.secondary" maxWidth={600}>
          Виберіть рецепт на головній сторінці та активуйте "Режим асистента", щоб отримувати голосові підказки.
        </Typography>
        <Button sx={{ mt: 3 }} variant="contained" onClick={() => navigate("/")}>
          До генератора рецептів
        </Button>
      </Box>
    );
  }

  const currentStep = recipe.instructions[stepIndex];
  const progress = ((stepIndex + 1) / recipe.instructions.length) * 100;
  const expiringPantryItems = useMemo(
    () =>
      pantry.filter((item) => {
        if (!item.expiresAt) return false;
        const days = (new Date(item.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return days < 3;
      }),
    [pantry]
  );

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Кухонний асистент
        </Typography>
        <Typography color="text.secondary" maxWidth={700}>
          Голосовий супровід кожного кроку, фокус на безпечності (алергії та терміни придатності), а також підказки для
          фітнес-цілей.
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                width={180}
                height={120}
                style={{ borderRadius: 12, objectFit: "cover" }}
              />
              <Box>
                <Typography variant="h5">{recipe.title}</Typography>
                <Typography color="text.secondary">{recipe.description}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {recipe.servings} порції · {recipe.cookTime + recipe.preparationTime} хв
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Прогрес приготування
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 12, borderRadius: 2 }} />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Крок {stepIndex + 1} з {recipe.instructions.length}
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              <Box flex={1}>
                <Typography variant="subtitle1" gutterBottom>
                  Поточний крок
                </Typography>
                <Typography>{currentStep?.instruction}</Typography>
                {currentStep?.tip && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Порада: {currentStep.tip}
                  </Typography>
                )}
                <Stack direction="row" spacing={1.5} mt={2}>
                  <Button
                    variant="contained"
                    startIcon={sessionActive ? <PauseCircleIcon /> : <PlayArrowIcon />}
                    onClick={sessionActive ? handlePause : startSession}
                  >
                    {sessionActive ? "Пауза" : "Старт"}
                  </Button>
                  <Button variant="outlined" startIcon={<SkipPreviousIcon />} onClick={previousStep}>
                    Назад
                  </Button>
                  <Button variant="outlined" startIcon={<SkipNextIcon />} onClick={nextStep}>
                    Далі
                  </Button>
                  <Button variant="outlined" startIcon={<ReplayIcon />} onClick={replayStep}>
                    Повторити
                  </Button>
                </Stack>
                {voiceSupported && (
                  <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" mt={2}>
                    <KeyboardVoiceIcon fontSize="small" sx={{ mr: 0.5 }} /> Скажіть "далі", "назад", "повтори" або
                    "стоп"
                  </Typography>
                )}
                {voiceStatus === "error" && (
                  <Typography variant="caption" color="error" mt={1}>
                    Не вдалося розпізнати голосову команду.
                  </Typography>
                )}
                {ttsSupported && ttsStatus === "speaking" && (
                  <Typography variant="caption" color="secondary" display="flex" alignItems="center" mt={1}>
                    <GraphicEqIcon fontSize="small" sx={{ mr: 0.5 }} /> Асистент озвучує інструкцію
                  </Typography>
                )}
              </Box>
              <Box flex={1}>
                <NutritionRadar nutrition={recipe.nutrition} />
              </Box>
            </Stack>

            <RecipeInstructions steps={recipe.instructions} />
          </Stack>
        </CardContent>
      </Card>

      {expiringPantryItems.length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Використайте залишки найближчим часом
            </Typography>
            <Stack spacing={1}>
              {expiringPantryItems.map((item) => (
                <Typography key={item.id} variant="body2" color="text.secondary">
                  {item.name} — термін придатності до {new Date(item.expiresAt as string).toLocaleDateString()}
                </Typography>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default Assistant;
