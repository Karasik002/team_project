import AddCircleIcon from "@mui/icons-material/AddCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Alert,
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { useMemo, useState } from "react";

import { IngredientInputData } from "../types";
import { useUserStore } from "../store/userStore";
import VoiceInputButton from "./VoiceInputButton";

interface IngredientInputProps {
  onChange: (ingredients: IngredientInputData[]) => void;
  initialIngredients?: IngredientInputData[];
}

const splitIngredients = (text: string): IngredientInputData[] =>
  text
    .split(/,|і|\band\b/gi)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((name) => ({ name }));

const IngredientInput = ({ onChange, initialIngredients = [] }: IngredientInputProps) => {
  const [value, setValue] = useState("");
  const [ingredients, setIngredients] = useState<IngredientInputData[]>(initialIngredients);
  const allergies = useUserStore((state) => state.profile.preferences.allergies);

  const allergenMatches = useMemo(
    () =>
      ingredients.filter((ingredient) =>
        allergies.some((allergy) => ingredient.name.toLowerCase().includes(allergy.toLowerCase()))
      ),
    [ingredients, allergies]
  );

  const updateIngredients = (next: IngredientInputData[]) => {
    setIngredients(next);
    onChange(next);
  };

  const handleAdd = () => {
    if (!value.trim()) return;
    const newIngredients = splitIngredients(value)
      .map((ingredient) => ({
        ...ingredient,
        name: ingredient.name.replace(/\s+/g, " ")
      }))
      .filter(
        (ingredient) =>
          !ingredients.some((existing) => existing.name.toLowerCase() === ingredient.name.toLowerCase())
      );

    const next = [...ingredients, ...newIngredients];
    updateIngredients(next);
    setValue("");
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (!transcript) return;
    const parsed = splitIngredients(transcript);
    const next = [...ingredients];
    parsed.forEach((ingredient) => {
      if (
        !next.some((existing) => existing.name.toLowerCase() === ingredient.name.toLowerCase()) &&
        ingredient.name.length > 1
      ) {
        next.push(ingredient);
      }
    });
    updateIngredients(next);
  };

  const handleRemove = (ingredientName: string) => {
    updateIngredients(ingredients.filter((ingredient) => ingredient.name !== ingredientName));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Ваші інгредієнти</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
        <TextField
          fullWidth
          variant="outlined"
          label="Додайте інгредієнти через кому"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
        />
        <Tooltip title="Додати інгредієнти">
          <span>
            <IconButton
              color="primary"
              onClick={handleAdd}
              disabled={!value.trim()}
              size="large"
            >
              <AddCircleIcon />
            </IconButton>
          </span>
        </Tooltip>
        <VoiceInputButton onTranscript={handleVoiceTranscript} />
      </Stack>

      {allergenMatches.length > 0 && (
        <Alert severity="warning" icon={<WarningAmberIcon fontSize="inherit" />}>
          Обережно: знайдено інгредієнти, що можуть містити алергени ({" "}
          {allergenMatches.map((ingredient) => ingredient.name).join(", ")}).
        </Alert>
      )}

      <Divider />

      <Box display="flex" flexWrap="wrap" gap={1}>
        {ingredients.length === 0 && (
          <Typography color="text.secondary">Поки що немає інгредієнтів. Спробуйте додати дещо.</Typography>
        )}
        {ingredients.map((ingredient) => (
          <Chip
            key={ingredient.name}
            label={ingredient.name}
            variant="outlined"
            onDelete={() => handleRemove(ingredient.name)}
            color={
              allergies.some((allergy) => ingredient.name.toLowerCase().includes(allergy.toLowerCase()))
                ? "warning"
                : "default"
            }
          />
        ))}
      </Box>
    </Stack>
  );
};

export default IngredientInput;
