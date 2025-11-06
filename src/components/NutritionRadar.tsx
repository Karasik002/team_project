import { Paper, Typography } from "@mui/material";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer
} from "recharts";

import { NutritionBreakdown } from "../types";

interface NutritionRadarProps {
  nutrition: NutritionBreakdown;
}

const NutritionRadar = ({ nutrition }: NutritionRadarProps) => {
  const data = [
    { metric: "Білки", value: nutrition.protein },
    { metric: "Жири", value: nutrition.fat },
    { metric: "Вугл.", value: nutrition.carbs },
    { metric: "Калорії", value: Math.round(nutrition.calories / 10) },
    { metric: "Клітк.", value: nutrition.fiber * 2 }
  ];

  return (
    <Paper variant="outlined" sx={{ p: 2, height: 280 }}>
      <Typography variant="subtitle1" gutterBottom>
        Поживний профіль
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="80%">
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="metric" stroke="#333" />
          <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
          <Radar dataKey="value" stroke="#ff7043" fill="#ff7043" fillOpacity={0.45} />
        </RadarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default NutritionRadar;
