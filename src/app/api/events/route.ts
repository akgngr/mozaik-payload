import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '9', 10))
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''

    const payload = await getPayload()

    const whereClause: Record<string, any> = {}

    if (category && category !== 'all') {
      whereClause.category = { equals: category }
    }

    if (search) {
      whereClause.or = [
        { title: { like: search } },
        { location: { like: search } },
        { excerpt: { like: search } },
      ]
    }

    const result = await payload.find({
      collection: 'events',
      limit,
      page,
      sort: 'eventDate',
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    })

    return NextResponse.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
    })
  } catch (error) {
    console.error('Events fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
