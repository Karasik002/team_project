import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import EcoIcon from "@mui/icons-material/Eco";
import InventoryIcon from "@mui/icons-material/Inventory";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import BarcodeInput from "../components/BarcodeInput";
import GeneratedRecipes from "../components/GeneratedRecipes";
import PantryTable from "../components/PantryTable";
import ShoppingList from "../components/ShoppingList";
import { generateAIRecipes } from "../services/aiService";
import { usePantryStore } from "../store/pantryStore";
import { useUserStore } from "../store/userStore";
import { IngredientInputData, PantryItem, Recipe } from "../types";

interface PantryFormValues {
  name: string;
  quantity: number;
  unit: string;
  category: PantryItem["category"];
  expiresAt: string;
  barcode?: string;
}

const Pantry = () => {
  const {
    pantry,
    leftovers,
    shoppingList,
    addPantryItem,
    removePantryItem,
    markAsLeftover,
    consumeLeftover,
    toggleShoppingItem,
    clearShoppingList
  } = usePantryStore();
  const profile = useUserStore((state) => state.profile);

  const soonExpiring = useMemo(
    () =>
      pantry.filter((item) =>
        item.expiresAt ? DateTime.fromISO(item.expiresAt) < DateTime.now().plus({ days: 5 }) : false
      ),
    [pantry]
  );

  const defaultValues: PantryFormValues = {
    name: "",
    quantity: 1,
    unit: "шт",
    category: "produce",
    expiresAt: DateTime.now().plus({ days: 5 }).toFormat("yyyy-LL-dd"),
    barcode: ""
  };

  const { register, handleSubmit, reset, setValue } = useForm<PantryFormValues>({ defaultValues });

  const onSubmit = handleSubmit((values) => {
    addPantryItem({
      name: values.name,
      quantity: Number(values.quantity),
      unit: values.unit,
      category: values.category,
      expiresAt: values.expiresAt ? DateTime.fromISO(values.expiresAt).toISO() ?? undefined : undefined,
      barcode: values.barcode?.trim() || undefined,
      pricePerUnit: undefined
    });
    reset(defaultValues);
  });

  const leftoverIngredients: IngredientInputData[] = leftovers.map((item) => ({
    name: item.name,
    amount: `${item.quantity} ${item.unit}`
  }));

  const { mutate: generateBudgetRecipes, data: budgetRecipes, isLoading, error } = useMutation<Recipe[], Error>({
    mutationFn: () => generateAIRecipes(leftoverIngredients, profile, pantry, { maxRecipes: 2 })
  });

  const handleBarcodeDetected = (barcode: string) => {
    setValue("barcode", barcode);
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Моя комора
        </Typography>
        <Typography color="text.secondary" maxWidth={720}>
          Скануйте продукти, відстежуйте терміни придатності, автоматично поповнюйте список покупок та отримуйте
          рецепти, що економлять бюджет, використовуючи залишки.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                  <InventoryIcon /> Додати продукт
                </Typography>
                <form onSubmit={onSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField label="Назва" fullWidth required {...register("name")} />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField
                        label="Кількість"
                        type="number"
                        inputProps={{ min: 0, step: 0.1 }}
                        fullWidth
                        required
                        {...register("quantity", { valueAsNumber: true })}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField label="Одиниці" select fullWidth {...register("unit")}>
                        {[
                          "шт",
                          "г",
                          "кг",
                          "л",
                          "мл",
                          "пач"
                        ].map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField label="Категорія" select fullWidth {...register("category")}>
                        {[
                          { label: "Овочі/фрукти", value: "produce" },
                          { label: "Білки", value: "protein" },
                          { label: "Зернові", value: "grain" },
                          { label: "Молочне", value: "dairy" },
                          { label: "Спеції", value: "spice" },
                          { label: "Інше", value: "other" }
                        ].map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Дійсний до"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        {...register("expiresAt")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <BarcodeInput onBarcodeDetected={handleBarcodeDetected} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField label="Штрих-код" fullWidth {...register("barcode")} />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                      <Button type="submit" variant="contained" startIcon={<PlaylistAddIcon />}>
                        Додати у комору
                      </Button>
                    </Grid>
                  </Grid>
                </form>

                <Divider />

                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                  <ReceiptLongIcon /> Поточні запаси
                </Typography>
                {soonExpiring.length > 0 && (
                  <Alert severity="warning">
                    Ці продукти потрібно використати найближчі дні: {soonExpiring.map((item) => item.name).join(", ")}.
                  </Alert>
                )}

                <PantryTable items={pantry} onRemove={removePantryItem} onMarkLeftover={markAsLeftover} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <ShoppingList
                  items={shoppingList}
                  onToggle={toggleShoppingItem}
                  onClear={clearShoppingList}
                />
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                  <TaskAltIcon /> Залишки
                </Typography>
                <Stack spacing={1} mt={2}>
                  {leftovers.length === 0 ? (
                    <Typography color="text.secondary">
                      Залишків немає. Створюйте порції без відходів!
                    </Typography>
                  ) : (
                    leftovers.map((item) => (
                      <Stack
                        key={item.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography>{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.quantity} {item.unit} · до {DateTime.fromISO(item.expiresAt ?? "").toFormat("dd LLL")}
                          </Typography>
                        </Box>
                        <Button size="small" onClick={() => consumeLeftover(item.id)}>
                          Використано
                        </Button>
                      </Stack>
                    ))
                  )}
                </Stack>
                <Button
                  sx={{ mt: 2 }}
                  variant="outlined"
                  startIcon={<EcoIcon />}
                  disabled={leftoverIngredients.length === 0}
                  onClick={() => generateBudgetRecipes()}
                >
                  Економні рецепти зі залишків
                </Button>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                  <AutoGraphIcon /> Аналітика
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Загалом {pantry.length} продуктів · {shoppingList.length} у списку покупок · {leftovers.length} залишків.
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Ваша мета: {profile.preferences.diets.join(", ") || "збалансовано"} — AI пріоритезує відповідні
                  продукти у рецептах.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {(budgetRecipes && budgetRecipes.length > 0) || isLoading ? (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <EcoIcon /> Рецепти для використання залишків
            </Typography>
            <GeneratedRecipes
              recipes={budgetRecipes ?? []}
              isLoading={isLoading}
              error={error?.message ?? null}
              onLaunchAssistant={() => undefined}
            />
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
};

export default Pantry;
