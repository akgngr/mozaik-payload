'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { Card } from '@/components/Card'
import { Animated } from '@/components/Animated'
import type { Project, Media } from '@/payload-types'

const accentBars = [
  'bg-brand-400',
  'bg-aqua-400',
  'bg-lav-400',
  'bg-salmon-400',
  'bg-citrus-400',
  'bg-leaf-400',
]

const formatDate = (date: string | null) =>
  date
    ? new Date(date).toLocaleDateString('de-DE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

interface Props {
  initialProjects: Project[]
  initialHasNextPage: boolean
}

export function InfiniteProjectList({ initialProjects, initialHasNextPage }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [loading, setLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage) return

    setLoading(true)
    const nextPage = page + 1

    try {
      const res = await fetch(`/api/projects?page=${nextPage}&limit=9`)
      const data = await res.json()

      if (data.docs && Array.isArray(data.docs)) {
        setProjects((prev) => [...prev, ...data.docs])
        setPage(nextPage)
        setHasNextPage(Boolean(data.hasNextPage))
      }
    } catch (err) {
      console.error('Error loading more projects:', err)
    } finally {
      setLoading(false)
    }
  }, [page, hasNextPage, loading])

  useEffect(() => {
    const el = observerRef.current
    if (!el || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && hasNextPage) {
          loadMore()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore, loading, hasNextPage])

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => {
          const image =
            typeof project.coverImage === 'object' && project.coverImage !== null
              ? (project.coverImage as Media)
              : null

          const date = formatDate(
            typeof project.publishedDate === 'string' ? project.publishedDate : null,
          )

          return (
            <Animated key={`${project.id}-${i}`} variant="fade-up" delay={(i % 9) * 40}>
              <Link href={`/projekt/${project.slug}`} className="group block h-full">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  {image?.url && (
                    <div className="relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.alt || project.title}
                        className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className={`absolute inset-x-0 bottom-0 h-1.5 ${accentBars[i % accentBars.length]}`}
                        aria-hidden
                      />
                    </div>
                  )}
                  <div className="p-7">
                    {date && (
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-lav-500">
                        {date}
                      </span>
                    )}
                    <h2 className="mb-2 mt-1.5 text-xl font-semibold text-ocean-900 group-hover:text-brand-600 transition-colors">
                      {project.title}
                    </h2>
                    {project.excerpt && (
                      <p className="leading-relaxed text-ocean-700/85 line-clamp-3">{project.excerpt}</p>
                    )}
                  </div>
                </Card>
              </Link>
            </Animated>
          )
        })}

        {projects.length === 0 && !loading && (
          <p className="col-span-full py-12 text-center text-ocean-700/70">
            Aktuell sind keine Projekte hinterlegt.
          </p>
        )}
      </div>

      {/* Infinite scroll trigger / loading state */}
      <div ref={observerRef} className="mt-12 flex justify-center py-6">
        {loading && (
          <div className="flex items-center gap-3 text-brand-600 font-semibold text-sm">
            <svg
              className="h-6 w-6 animate-spin text-brand-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Weitere Projekte werden geladen...</span>
          </div>
        )}
        {!hasNextPage && projects.length > 9 && (
          <p className="text-sm font-medium text-ocean-400">
            Sie haben alle Projekte gesehen.
          </p>
        )}
      </div>
    </>
  )
}
