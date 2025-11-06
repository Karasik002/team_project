import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import StarIcon from "@mui/icons-material/Star";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { DateTime } from "luxon";
import { useMemo } from "react";

import { useGamificationStore } from "../store/gamificationStore";
import { usePantryStore } from "../store/pantryStore";
import { useUserStore } from "../store/userStore";
import { Recipe } from "../types";
import { difficultyLabel, formatDuration } from "../utils/format";
import NutritionRadar from "./NutritionRadar";
import RecipeInstructions from "./RecipeInstructions";

interface RecipeCardProps {
  recipe: Recipe;
  onLaunchAssistant: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, onLaunchAssistant }: RecipeCardProps) => {
  const { pantry, addToShoppingList } = usePantryStore();
  const toggleFavoriteRecipe = useUserStore((state) => state.toggleFavoriteRecipe);
  const favorites = useUserStore((state) => state.profile.favoriteRecipes);
  const historyLength = useUserStore((state) => state.profile.history.length);
  const logCookingHistory = useUserStore((state) => state.logCookingHistory);
  const addPoints = useGamificationStore((state) => state.addPoints);
  const unlockAchievement = useGamificationStore((state) => state.unlockAchievement);

  const isFavorite = favorites.some((fav) => fav.id === recipe.id);

  const missingIngredients = useMemo(
    () =>
      recipe.ingredients.filter((ingredient) =>
        !pantry.some((item) => item.name.toLowerCase().includes(ingredient.name.toLowerCase()))
      ),
    [recipe.ingredients, pantry]
  );

  const handleFavorite = () => {
    toggleFavoriteRecipe({ id: recipe.id, name: recipe.title });
  };

  const handleStartCooking = () => {
    logCookingHistory({ recipeId: recipe.id, cookedAt: new Date().toISOString() });
    addPoints(30);
    if (historyLength + 1 >= 5) {
      unlockAchievement("healthy-habit");
    }
  };

  const handleAddMissing = () => {
    missingIngredients.forEach((ingredient) =>
      addToShoppingList({
        name: ingredient.name,
        quantity: 1,
        unit: ingredient.amount ?? "",
        reason: "missing",
        relatesToRecipeId: recipe.id
      })
    );
  };

  return (
    <Card variant="outlined" sx={{ overflow: "hidden" }}>
      <CardHeader
        title={recipe.title}
        subheader={`Готовність за ${formatDuration(recipe.preparationTime + recipe.cookTime)}`}
        action={
          <Tooltip title={isFavorite ? "Видалити з улюблених" : "Додати в улюблені"}>
            <Button
              onClick={handleFavorite}
              color="secondary"
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            >
              {isFavorite ? "Улюблений" : "В обране"}
            </Button>
          </Tooltip>
        }
      />
      <CardMedia component="img" height={260} image={recipe.imageUrl} alt={recipe.title} loading="lazy" />
      <CardContent>
        <Typography color="text.secondary" mb={2}>
          {recipe.description}
        </Typography>

        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
          <Chip icon={<StarIcon />} label={difficultyLabel[recipe.difficulty]} />
          <Chip icon={<LocalDiningIcon />} label={`${recipe.servings} порції`} />
          <Chip label={`Кухня: ${recipe.cuisine}`} />
          <Chip label={`Готувати: ${formatDuration(recipe.cookTime)}`} />
        </Stack>

        <Typography variant="subtitle1" gutterBottom>
          Інгредієнти
        </Typography>
        <List dense>
          {recipe.ingredients.map((ingredient) => {
            const isMissing = missingIngredients.some(
              (missing) => missing.name.toLowerCase() === ingredient.name.toLowerCase()
            );
            return (
              <ListItem key={ingredient.name} sx={{ py: 0 }}>
                <ListItemIcon>
                  <TipsAndUpdatesIcon color={isMissing ? "warning" : "primary"} />
                </ListItemIcon>
                <ListItemText
                  primary={`${ingredient.name}${ingredient.amount ? ` — ${ingredient.amount}` : ""}`}
                  secondary={isMissing ? "Додайте до списку покупок" : undefined}
                />
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 3 }} />

        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Box flex={1}>
            <RecipeInstructions steps={recipe.instructions} />
          </Box>
          <Box flex={1}>
            <NutritionRadar nutrition={recipe.nutrition} />
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1">Поради щодо подачі</Typography>
              <List dense>
                {recipe.platingTips.map((tip) => (
                  <ListItem key={tip} sx={{ py: 0 }}>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
              {recipe.leftoversTip && (
                <Typography variant="body2" color="text.secondary">
                  {recipe.leftoversTip}
                </Typography>
              )}
            </Paper>
            {recipe.source.videoUrl && (
              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Відео-гайд
                </Typography>
                <Box
                  component="iframe"
                  width="100%"
                  height="220"
                  src={recipe.source.videoUrl}
                  title={`Відео до ${recipe.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{ borderRadius: 2, border: 0 }}
                />
              </Box>
            )}
          </Box>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<SmartDisplayIcon />}
            onClick={() => onLaunchAssistant(recipe)}
          >
            Режим асистента
          </Button>
          <Button variant="outlined" startIcon={<PlaylistAddCheckIcon />} onClick={handleStartCooking}>
            Додати в історію
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ShoppingCartIcon />}
            disabled={missingIngredients.length === 0}
            onClick={handleAddMissing}
          >
            Купити відсутнє ({missingIngredients.length})
          </Button>
          <Typography variant="caption" color="text.secondary">
            Оновлено: {DateTime.now().toFormat("dd LLL, HH:mm")}
          </Typography>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
