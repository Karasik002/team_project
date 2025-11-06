import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { useMemo, useState } from "react";

import { useGamificationStore } from "../store/gamificationStore";
import { useUserStore } from "../store/userStore";
import { DietPreference } from "../types";
import { fitnessGoalLabel } from "../utils/format";

const allDietOptions: { value: DietPreference; label: string }[] = [
  { value: "balanced", label: "Збалансоване" },
  { value: "vegan", label: "Веган" },
  { value: "vegetarian", label: "Вегетаріан" },
  { value: "keto", label: "Кето" },
  { value: "paleo", label: "Палео" }
];

const Profile = () => {
  const profile = useUserStore((state) => state.profile);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const toggleDietPreference = useUserStore((state) => state.toggleDietPreference);
  const addAllergy = useUserStore((state) => state.addAllergy);
  const removeAllergy = useUserStore((state) => state.removeAllergy);
  const { achievements, points } = useGamificationStore((state) => ({
    achievements: state.achievements,
    points: state.points
  }));

  const [allergyInput, setAllergyInput] = useState("");

  const unlockedAchievements = achievements.filter((achievement) => achievement.unlockedAt);

  const handleAddAllergy = () => {
    if (!allergyInput.trim()) return;
    addAllergy(allergyInput.trim());
    setAllergyInput("");
  };

  const activityStreak = useMemo(() => {
    if (!profile.history.length) return 0;
    const days = new Set(
      profile.history.map((entry) => new Date(entry.cookedAt).toDateString())
    );
    return days.size;
  }, [profile.history]);

  return (
    <Stack spacing={4}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: profile.avatarColor, width: 64, height: 64 }}>
          {profile.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h4">{profile.name}</Typography>
          <Typography color="text.secondary">
            {profile.preferences.diets.join(", ") || "Збалансоване харчування"} · {profile.history.length} пригот.
          </Typography>
        </Box>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <SettingsIcon /> Персоналізація
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Ім'я" 
                fullWidth
                value={profile.name}
                onChange={(event) => updateProfile({ name: event.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Улюблені кухні"
                fullWidth
                value={profile.preferences.favoriteCuisines.join(", ")}
                onChange={(event) =>
                  updateProfile({
                    preferences: {
                      favoriteCuisines: event.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                    } as any
                  })
                }
                helperText="Розділяйте комами, щоб AI врахував ваш смак"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Алергії
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {profile.preferences.allergies.map((allergy) => (
                  <Chip key={allergy} label={allergy} onDelete={() => removeAllergy(allergy)} />
                ))}
                <TextField
                  size="small"
                  label="Додати алергію"
                  value={allergyInput}
                  onChange={(event) => setAllergyInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddAllergy();
                    }
                  }}
                />
                <Button onClick={handleAddAllergy} startIcon={<AddIcon />}>
                  Додати
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Дієтичні уподобання
              </Typography>
              <FormGroup row>
                {allDietOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Switch
                        checked={profile.preferences.diets.includes(option.value)}
                        onChange={() => toggleDietPreference(option.value)}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </FormGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Цілі здоров'я
              </Typography>
              <TextField
                label="Фітнес-мета"
                select
                fullWidth
                value={profile.preferences.fitnessGoal}
                onChange={(event) =>
                  updateProfile({
                    preferences: {
                      fitnessGoal: event.target.value as any
                    } as any
                  })
                }
              >
                {Object.entries(fitnessGoalLabel).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                <FavoriteIcon /> Улюблені рецепти
              </Typography>
              <Stack spacing={1.5} mt={2}>
                {profile.favoriteRecipes.length === 0 ? (
                  <Typography color="text.secondary">Ще немає улюблених. Позначайте, що смакує найбільше!</Typography>
                ) : (
                  profile.favoriteRecipes.map((recipe) => (
                    <Box key={recipe.id}>
                      <Typography>{recipe.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Останній раз: {recipe.lastCookedAt ? new Date(recipe.lastCookedAt).toLocaleDateString() : "—"}
                      </Typography>
                    </Box>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                <EmojiEventsIcon /> Досягнення
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {points} XP загалом
              </Typography>
              <Stack spacing={1.5} mt={2}>
                {unlockedAchievements.length === 0 ? (
                  <Typography color="text.secondary">
                    Почніть готувати з AI, щоб відкривати бейджі та отримувати XP.
                  </Typography>
                ) : (
                  unlockedAchievements.map((achievement) => (
                    <Box key={achievement.id}>
                      <Typography>
                        {achievement.icon} {achievement.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(achievement.unlockedAt ?? "").toLocaleDateString()} — {achievement.description}
                      </Typography>
                    </Box>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <HistoryIcon /> Історія приготувань
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {activityStreak} днів активності • {profile.history.length} рецептів приготовано
          </Typography>
          <Stack spacing={1.5} mt={2}>
            {profile.history.length === 0 ? (
              <Typography color="text.secondary">Жодного запису поки немає — запустіть рецепт зараз!</Typography>
            ) : (
              profile.history.slice(0, 8).map((entry, index) => (
                <Box key={`${entry.recipeId}-${entry.cookedAt}-${index}`}>
                  <Typography>
                    {new Date(entry.cookedAt).toLocaleDateString()} — {entry.recipeId}
                  </Typography>
                  {entry.notes && (
                    <Typography variant="caption" color="text.secondary">
                      Нотатка: {entry.notes}
                    </Typography>
                  )}
                </Box>
              ))
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Profile;
