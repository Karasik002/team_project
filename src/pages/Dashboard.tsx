import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import UtensilsIcon from "@mui/icons-material/Restaurant";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import IngredientInput from "../components/IngredientInput";
import GeneratedRecipes from "../components/GeneratedRecipes";
import { generateAIRecipes } from "../services/aiService";
import { useGamificationStore } from "../store/gamificationStore";
import { usePantryStore } from "../store/pantryStore";
import { useUserStore } from "../store/userStore";
import { IngredientInputData, Recipe } from "../types";
import { fitnessGoalLabel } from "../utils/format";

const Dashboard = () => {
  const [ingredients, setIngredients] = useState<IngredientInputData[]>([]);
  const profile = useUserStore((state) => state.profile);
  const pantry = usePantryStore((state) => state.pantry);
  const { streak, points, unlockAchievement, addPoints } = useGamificationStore((state) => ({
    streak: state.streak,
    points: state.points,
    unlockAchievement: state.unlockAchievement,
    addPoints: state.addPoints
  }));
  const navigate = useNavigate();

  const allergies = profile.preferences.allergies;
  const riskyIngredients = useMemo(
    () =>
      ingredients.filter((ingredient) =>
        allergies.some((allergy) => ingredient.name.toLowerCase().includes(allergy.toLowerCase()))
      ),
    [ingredients, allergies]
  );

  const { mutate, data, isLoading, error } = useMutation<Recipe[], Error>({
    mutationFn: () => generateAIRecipes(ingredients, profile, pantry),
    mutationKey: ["ai-recipes", ingredients.map((item) => item.name).join("-")],
    onSuccess: (recipes) => {
      if (recipes.length > 0) {
        unlockAchievement("start-journey");
        addPoints(15);
      }
    }
  });

  const handleGenerate = () => {
    if (!ingredients.length) return;
    mutate();
  };

  const handleLaunchAssistant = (recipe: Recipe) => {
    navigate("/assistant", { state: { recipe } });
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          AI Smart Recipe Maker
        </Typography>
        <Typography color="text.secondary" maxWidth={700}>
          Введіть або надиктуйте інгредієнти, а ми створимо унікальні рецепти з урахуванням ваших дієтичних
          вподобань, історії приготувань та вмісту комори.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <IngredientInput onChange={setIngredients} />
              {riskyIngredients.length > 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Зверніть увагу: {riskyIngredients.map((ingredient) => ingredient.name).join(", ")} можуть містити
                  алергени з вашого профілю.
                </Alert>
              )}
              <Button
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                onClick={handleGenerate}
                disabled={ingredients.length === 0}
                startIcon={<AutoAwesomeIcon />}
              >
                Згенерувати рецепти
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <UtensilsIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1">Ви готуєте як профі</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.favoriteRecipes.length} улюблених страв • {profile.history.length} приготувань
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <BoltIcon color="secondary" />
                  <Box>
                    <Typography variant="subtitle1">Смуга успіху</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {streak} дні поспіль готування • {points} XP
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <QueryStatsIcon color="action" />
                  <Box>
                    <Typography variant="subtitle1">Фітнес-мета</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {fitnessGoalLabel[profile.preferences.fitnessGoal]}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <GeneratedRecipes
        recipes={data ?? []}
        isLoading={isLoading}
        error={error?.message ?? null}
        onLaunchAssistant={handleLaunchAssistant}
      />
    </Stack>
  );
};

export default Dashboard;
