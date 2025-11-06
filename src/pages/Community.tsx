import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ForumIcon from "@mui/icons-material/Forum";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Rating,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useCommunityStore } from "../store/communityStore";
import { useUserStore } from "../store/userStore";
import { IngredientInputData } from "../types";

interface CommunityRecipeForm {
  title: string;
  imageUrl: string;
  ingredients: string;
  description: string;
  cuisine: string;
}

const Community = () => {
  const { recipes, addRecipe, toggleLike, addReview } = useCommunityStore();
  const profile = useUserStore((state) => state.profile);
  const { register, handleSubmit, reset } = useForm<CommunityRecipeForm>({
    defaultValues: {
      title: "",
      imageUrl: "",
      ingredients: "",
      description: "",
      cuisine: ""
    }
  });
  const [reviewContent, setReviewContent] = useState<Record<string, string>>({});
  const [reviewRating, setReviewRating] = useState<Record<string, number>>({});

  const onSubmit = handleSubmit((values) => {
    const ingredients: IngredientInputData[] = values.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    addRecipe({
      title: values.title,
      imageUrl:
        values.imageUrl || "https://images.unsplash.com/photo-1543357480-c60d04008c91?auto=format&fit=crop&w=800&q=80",
      description: values.description || "Авторський рецепт зі спільноти",
      ingredients,
      instructions: ingredients.map((ingredient, index) => ({
        order: index + 1,
        instruction: `Додайте ${ingredient.name} та готуйте за власним смаком`
      })),
      nutrition: { calories: 450, protein: 20, fat: 12, carbs: 55, fiber: 8 },
      preparationTime: 10,
      cookTime: 20,
      servings: 2,
      difficulty: "medium",
      cuisine: values.cuisine || "Авторська",
      platingTips: ["Використайте улюблений посуд", "Додайте зелень перед подачею"],
      leftoversTip: "Зберігайте в контейнері до 2 днів",
      source: { videoUrl: "" },
      author: profile.name
    });
    reset();
  });

  const handleAddReview = (recipeId: string) => {
    const comment = reviewContent[recipeId];
    const rating = reviewRating[recipeId] ?? 5;
    if (!comment?.trim()) return;
    addReview(recipeId, {
      author: profile.name,
      rating,
      comment: comment.trim()
    });
    setReviewContent((prev) => ({ ...prev, [recipeId]: "" }));
    setReviewRating((prev) => ({ ...prev, [recipeId]: 5 }));
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Спільнота
        </Typography>
        <Typography color="text.secondary" maxWidth={700}>
          Діліться власними рецептами, надихайте інших, оцінюйте страви та формуйте рейтинг популярних ідей.
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <ShareIcon /> Поділитися своїм рецептом
          </Typography>
          <form onSubmit={onSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <TextField label="Назва" fullWidth required {...register("title")} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Зображення (URL)" fullWidth {...register("imageUrl")} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Кухня/стиль" fullWidth {...register("cuisine")} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Опис" fullWidth multiline minRows={2} {...register("description")} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Інгредієнти (через кому)"
                  fullWidth
                  required
                  {...register("ingredients")}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" startIcon={<RocketLaunchIcon />}>
                  Опублікувати
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item xs={12} md={6} key={recipe.id}>
            <Card variant="outlined">
              <CardHeader
                avatar={<Avatar>{recipe.author.charAt(0)}</Avatar>}
                title={recipe.title}
                subheader={`Автор: ${recipe.author}`}
              />
              <Box component="img" src={recipe.imageUrl} alt={recipe.title} width="100%" height={220} sx={{ objectFit: "cover" }} />
              <CardContent>
                <Typography color="text.secondary">{recipe.description}</Typography>
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                  <Chip label={`Рейтинг: ${recipe.rating.toFixed(1)}`} icon={<FavoriteBorderIcon />} />
                  <Chip label={`Вподобань: ${recipe.likes}`} icon={<ThumbUpIcon />} />
                  <Chip label={recipe.cuisine} />
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1">Відгуки</Typography>
                <Stack spacing={1} mt={1}>
                  {recipe.reviews.slice(0, 3).map((review) => (
                    <Box key={review.id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography fontWeight={600}>{review.author}</Typography>
                        <Rating size="small" value={review.rating} readOnly />
                      </Stack>
                      <Typography variant="body2">{review.comment}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                  {recipe.reviews.length === 0 && (
                    <Typography color="text.secondary">Поки що немає відгуків — станьте першим!</Typography>
                  )}
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} mt={2}>
                  <Rating
                    name={`review-rating-${recipe.id}`}
                    value={reviewRating[recipe.id] ?? 5}
                    onChange={(_, value) =>
                      setReviewRating((prev) => ({ ...prev, [recipe.id]: value ?? 5 }))
                    }
                  />
                  <TextField
                    label="Коментар"
                    fullWidth
                    size="small"
                    value={reviewContent[recipe.id] ?? ""}
                    onChange={(event) =>
                      setReviewContent((prev) => ({ ...prev, [recipe.id]: event.target.value }))
                    }
                  />
                  <Button onClick={() => handleAddReview(recipe.id)} startIcon={<ForumIcon />}>Надіслати</Button>
                </Stack>
              </CardContent>
              <CardActions>
                <Button startIcon={<ThumbUpIcon />} onClick={() => toggleLike(recipe.id)}>
                  Підтримати
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default Community;
