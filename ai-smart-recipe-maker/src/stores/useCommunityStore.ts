import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import { communityFeed } from '../data/community'
import type { CommunityComment, CommunityPost } from '../types'

interface CommunityState {
  posts: CommunityPost[]
  toggleLike: (postId: string) => void
  addComment: (postId: string, comment: Omit<CommunityComment, 'id' | 'createdAt'>) => void
  addPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'createdAt' | 'comments'>) => void
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      posts: communityFeed,
      toggleLike: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: post.likes + 1,
                }
              : post,
          ),
        })),
      addComment: (postId, comment) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      ...comment,
                      id: uuid(),
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : post,
          ),
        })),
      addPost: (post) =>
        set((state) => ({
          posts: [
            {
              ...post,
              id: uuid(),
              likes: 0,
              createdAt: new Date().toISOString(),
              comments: [],
            },
            ...state.posts,
          ],
        })),
    }),
    {
      name: 'ai-smart-community',
    },
  ),
)
