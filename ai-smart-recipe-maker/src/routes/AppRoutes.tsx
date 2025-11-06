import { Route, Routes } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import DashboardPage from './DashboardPage'
import RecipesPage from './RecipesPage'
import RecipeDetailPage from './RecipeDetailPage'
import PantryPage from './PantryPage'
import ShoppingListPage from './ShoppingListPage'
import ProfilePage from './ProfilePage'
import CommunityPage from './CommunityPage'
import ChallengesPage from './ChallengesPage'
import KitchenAssistantPage from './KitchenAssistantPage'
import NotFoundPage from './NotFoundPage'

const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="recipes" element={<RecipesPage />} />
      <Route path="recipes/:id" element={<RecipeDetailPage />} />
      <Route path="pantry" element={<PantryPage />} />
      <Route path="shopping-list" element={<ShoppingListPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="community" element={<CommunityPage />} />
      <Route path="challenges" element={<ChallengesPage />} />
      <Route path="assistant" element={<KitchenAssistantPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
)

export default AppRoutes
