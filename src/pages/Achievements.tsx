import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InsightsIcon from "@mui/icons-material/Insights";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import { DateTime } from "luxon";

import { useGamificationStore } from "../store/gamificationStore";
import { useUserStore } from "../store/userStore";

const Achievements = () => {
  const { achievements, challenges, points, streak } = useGamificationStore();
  const profile = useUserStore((state) => state.profile);

  const unlocked = achievements.filter((achievement) => achievement.unlockedAt);
  const activeChallenges = challenges.filter((challenge) => !challenge.completedAt);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Досягнення та виклики
        </Typography>
        <Typography color="text.secondary" maxWidth={700}>
          Заробляйте XP за готування, відкривайте бейджі та беріть участь у сезонних кулінарних викликах.
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <InsightsIcon /> Ваша статистика
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mt={2}>
            <Box>
              <Typography variant="h4">{points}</Typography>
              <Typography color="text.secondary">Загальний XP</Typography>
            </Box>
            <Box>
              <Typography variant="h4">{profile.history.length}</Typography>
              <Typography color="text.secondary">Приготованих рецептів</Typography>
            </Box>
            <Box>
              <Typography variant="h4">{streak}</Typography>
              <Typography color="text.secondary">Поточна серія днів</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <EmojiEventsIcon /> Відкриті бейджі
          </Typography>
          <Stack spacing={2} mt={2}>
            {unlocked.length === 0 ? (
              <Typography color="text.secondary">Згенеруйте рецепт та приготуйте страву, щоб отримати перший бейдж.</Typography>
            ) : (
              unlocked.map((achievement) => (
                <Stack
                  key={achievement.id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontSize={28}>{achievement.icon}</Typography>
                    <Box>
                      <Typography fontWeight={600}>{achievement.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {DateTime.fromISO(achievement.unlockedAt ?? "").toFormat("dd LLL yyyy")}
                  </Typography>
                </Stack>
              ))
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <MilitaryTechIcon /> Активні виклики
          </Typography>
          <Stack spacing={2} mt={2}>
            {activeChallenges.length === 0 ? (
              <Typography color="text.secondary">Наразі виклики відсутні, поверніться пізніше за новими завданнями.</Typography>
            ) : (
              activeChallenges.map((challenge) => {
                const deadline = DateTime.fromISO(challenge.deadline);
                const progress = Math.max(
                  0,
                  Math.min(100, (1 - Math.max(0, deadline.diffNow("days").days) / 7) * 100)
                );
                return (
                  <Box key={challenge.id}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={600}>{challenge.title}</Typography>
                      <Chip label={`${challenge.rewardPoints} XP`} color="secondary" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {challenge.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      До {deadline.toFormat("dd LLL yyyy")} • Складність: {challenge.difficulty}
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} sx={{ mt: 1.5, borderRadius: 2 }} />
                  </Box>
                );
              })
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <TrendingUpIcon /> Порада від AI
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Щоб отримати більше XP, приготуйте страву у новому стилі ({profile.preferences.favoriteCuisines.join(", ") ||
              "додайте кухні"}) та поділіться фото у спільноті.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Achievements;
