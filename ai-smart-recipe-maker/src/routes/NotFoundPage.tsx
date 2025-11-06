import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Card from '../components/core/Card'
import Button from '../components/core/Button'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Card className="flex flex-col items-center gap-4 border-dashed border-slate-800/70 bg-slate-900/60 py-16 text-center">
      <Compass className="h-12 w-12 text-brand-400" />
      <h2 className="text-xl font-semibold text-white">Сторінку не знайдено</h2>
      <p className="max-w-md text-sm text-slate-300">Можливо, ви перейшли за застарілим посиланням. Поверніться на панель, щоб продовжити кулінарну подорож.</p>
      <Button onClick={() => navigate('/')}>До панелі</Button>
    </Card>
  )
}

export default NotFoundPage
