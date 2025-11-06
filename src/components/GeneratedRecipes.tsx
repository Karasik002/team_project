import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";

import { Recipe } from "../types";
import RecipeCard from "./RecipeCard";

interface GeneratedRecipesProps {
  recipes: Recipe[];
  isLoading?: boolean;
  error?: string | null;
  onLaunchAssistant: (recipe: Recipe) => void;
}

const GeneratedRecipes = ({ recipes, isLoading, error, onLaunchAssistant }: GeneratedRecipesProps) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        {error}
      </Alert>
    );
  }

  if (recipes.length === 0) {
    return (
      <Box textAlign="center" my={6}>
        <Typography variant="h6" color="text.secondary">
          Введіть інгредієнти, щоб AI створив індивідуальні рецепти.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4} sx={{ mt: 2 }}>
      {recipes.map((recipe) => (
        <Grid item xs={12} key={recipe.id}>
          <RecipeCard recipe={recipe} onLaunchAssistant={onLaunchAssistant} />
        </Grid>
      ))}
    </Grid>
  );
};

export default GeneratedRecipes;
