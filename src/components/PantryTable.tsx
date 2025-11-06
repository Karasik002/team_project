import DeleteIcon from "@mui/icons-material/Delete";
import KitchenIcon from "@mui/icons-material/Kitchen";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import { DateTime } from "luxon";

import { PantryItem } from "../types";
import { formatDate, formatTimeLeft } from "../utils/format";

interface PantryTableProps {
  items: PantryItem[];
  onRemove: (id: string) => void;
  onMarkLeftover: (id: string) => void;
}

const getExpiryProgress = (item: PantryItem) => {
  if (!item.expiresAt) return null;
  const expires = DateTime.fromISO(item.expiresAt);
  const added = DateTime.fromISO(item.addedAt);
  if (!expires.isValid || !added.isValid) return null;
  const total = expires.diff(added).as("days");
  const remaining = expires.diff(DateTime.now()).as("days");
  const progress = total === 0 ? 100 : Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  return {
    progress,
    remaining
  };
};

const PantryTable = ({ items, onRemove, onMarkLeftover }: PantryTableProps) => (
  <Box>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Продукт</TableCell>
          <TableCell>Кількість</TableCell>
          <TableCell>Категорія</TableCell>
          <TableCell>Термін</TableCell>
          <TableCell>Прогрес</TableCell>
          <TableCell align="right">Дії</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => {
          const expiry = getExpiryProgress(item);
          const isExpiring = expiry ? expiry.remaining < 3 : false;
          return (
            <TableRow key={item.id} hover>
              <TableCell>
                <Typography fontWeight={600}>{item.name}</Typography>
                {item.barcode && (
                  <Typography variant="caption" color="text.secondary">
                    Штрих-код: {item.barcode}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {item.quantity} {item.unit}
              </TableCell>
              <TableCell>
                <Typography>{item.category}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{formatDate(item.expiresAt)}</Typography>
                <Typography variant="caption" color={isExpiring ? "error" : "text.secondary"}>
                  {formatTimeLeft(item.expiresAt)}
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 140 }}>
                {expiry ? (
                  <Tooltip title={`Залишилось ${Math.max(0, Math.round(expiry.remaining))} днів`}>
                    <LinearProgress
                      variant="determinate"
                      value={expiry.progress}
                      color={isExpiring ? "warning" : "primary"}
                      sx={{ height: 8, borderRadius: 2 }}
                    />
                  </Tooltip>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Без терміну
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Відправити в залишки">
                  <IconButton onClick={() => onMarkLeftover(item.id)}>
                    <KitchenIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {isExpiring && (
                  <Tooltip title="Скоро зіпсується">
                    <span>
                      <IconButton color="warning">
                        <WarningIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
                <Tooltip title="Видалити">
                  <IconButton onClick={() => onRemove(item.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        })}
        {items.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center">
              <Typography color="text.secondary">Додайте продукти до комори, щоб отримувати розумні підказки.</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </Box>
);

export default PantryTable;
