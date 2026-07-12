import type { Metadata } from 'next'
import { PageContent, getPageMetadata } from '@/components/PageContent'

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('impressum')
}

export default function Page() {
  return <PageContent slug="impressum" />
}
