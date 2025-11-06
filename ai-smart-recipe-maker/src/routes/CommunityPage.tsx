import type { FormEvent } from 'react'
import { useState } from 'react'
import { Heart, MessageCircle, Share2, Users } from 'lucide-react'
import Card from '../components/core/Card'
import Button from '../components/core/Button'
import Badge from '../components/core/Badge'
import { useCommunityStore } from '../stores/useCommunityStore'
import { useProfileStore } from '../stores/useProfileStore'

const CommunityPage = () => {
  const { posts, toggleLike, addComment, addPost } = useCommunityStore((state) => state)
  const profile = useProfileStore((state) => state.profile)
  const [shareOpenId, setShareOpenId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [shareTitle, setShareTitle] = useState('')
  const [shareDescription, setShareDescription] = useState('')
  const [shareImage, setShareImage] = useState('')

  const handleSubmitShare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!shareTitle.trim()) return

    addPost({
      author: {
        name: profile.name,
        avatar: profile.avatar,
      },
      title: shareTitle.trim(),
      description: shareDescription.trim(),
      image: shareImage.trim() || 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
      tags: ['користувацький рецепт'],
    })

    setShareTitle('')
    setShareDescription('')
    setShareImage('')
  }

  const handleSubmitComment = (event: FormEvent<HTMLFormElement>, postId: string) => {
    event.preventDefault()
    if (!newComment.trim()) return
    addComment(postId, {
      author: {
        name: profile.name,
        avatar: profile.avatar,
      },
      message: newComment.trim(),
    })
    setNewComment('')
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Кулінарна спільнота</h1>
          <p className="text-sm text-slate-300">Діліться стравами, оцінюйте ідеї та надихайтеся чужими експериментами.</p>
        </div>
        <Badge variant="info" className="flex items-center gap-1">
          <Users className="h-4 w-4" /> {posts.length} постів
        </Badge>
      </header>

      <Card className="border-slate-800/70 bg-slate-900/70">
        <form onSubmit={handleSubmitShare} className="grid gap-3">
          <h2 className="text-sm font-semibold text-white">Поділитися власним рецептом</h2>
          <input
            className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-brand-500 focus:outline-none"
            placeholder="Заголовок"
            value={shareTitle}
            onChange={(event) => setShareTitle(event.target.value)}
          />
          <textarea
            className="min-h-[100px] rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-brand-500 focus:outline-none"
            placeholder="Опишіть свій досвід, лайфхаки або поради"
            value={shareDescription}
            onChange={(event) => setShareDescription(event.target.value)}
          />
          <input
            className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-brand-500 focus:outline-none"
            placeholder="Посилання на фото (опційно)"
            value={shareImage}
            onChange={(event) => setShareImage(event.target.value)}
          />
          <Button type="submit" icon={<Share2 className="h-4 w-4" />}>Поділитися</Button>
        </form>
      </Card>

      <section className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="border-slate-800/70 bg-slate-900/70">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-white">{post.author.name}</p>
                  <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <h2 className="text-lg font-semibold text-white">{post.title}</h2>
              <p className="text-sm text-slate-300">{post.description}</p>
              <img src={post.image} alt={post.title} className="h-56 w-full rounded-2xl object-cover" />
              <div className="flex flex-wrap items-center gap-3 text-xs text-brand-200">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="info">#{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-rose-300 transition hover:text-rose-200"
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart className="h-4 w-4" /> {post.likes}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-brand-200 transition hover:text-brand-100"
                  onClick={() => setShareOpenId((prev) => (prev === post.id ? null : post.id))}
                >
                  <MessageCircle className="h-4 w-4" /> {post.comments.length}
                </button>
              </div>
            </div>

            {shareOpenId === post.id && (
              <div className="mt-4 border-t border-slate-800/60 pt-4">
                <h3 className="text-sm font-semibold text-white">Коментарі</h3>
                <div className="mt-3 flex flex-col gap-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3 text-sm text-slate-200">
                      <p className="font-medium text-white">{comment.author.name}</p>
                      <p className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</p>
                      <p className="mt-1 text-slate-200">{comment.message}</p>
                    </div>
                  ))}
                  <form onSubmit={(event) => handleSubmitComment(event, post.id)} className="flex gap-2">
                    <input
                      className="flex-1 rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-brand-500 focus:outline-none"
                      placeholder="Напишіть коментар"
                      value={newComment}
                      onChange={(event) => setNewComment(event.target.value)}
                    />
                    <Button type="submit" variant="secondary" size="sm">Відправити</Button>
                  </form>
                </div>
              </div>
            )}
          </Card>
        ))}
      </section>
    </div>
  )
}

export default CommunityPage
