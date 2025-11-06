import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";

import { ShoppingListItem } from "../types";

interface ShoppingListProps {
  items: ShoppingListItem[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

const ShoppingList = ({ items, onToggle, onClear }: ShoppingListProps) => (
  <Box>
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
      <Typography variant="h6">Список покупок</Typography>
      {items.length > 0 && (
        <Button size="small" startIcon={<ClearIcon />} onClick={onClear}>
          Очистити
        </Button>
      )}
    </Box>
    {items.length === 0 ? (
      <Typography color="text.secondary">Наразі немає товарів для покупки — чудовий шанс використати залишки!</Typography>
    ) : (
      <List dense>
        {items.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => onToggle(item.id)}>
                <CheckCircleIcon color={item.reason === "suggested" ? "success" : "action"} />
              </IconButton>
            }
          >
            <ListItemIcon>
              <ShoppingCartIcon color={item.reason === "missing" ? "warning" : "primary"} />
            </ListItemIcon>
            <ListItemText
              primary={`${item.name}${item.unit ? ` — ${item.unit}` : ""}`}
              secondary={item.reason === "missing" ? "Відсутній для рецепта" : "Пропозиція AI"}
            />
          </ListItem>
        ))}
      </List>
    )}
  </Box>
);

export default ShoppingList;
