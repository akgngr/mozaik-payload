import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export const RichText = ({
  data,
  className = '',
}: {
  data: SerializedEditorState | null | undefined
  className?: string
}) => {
  if (!data) return null

  return (
    <LexicalRichText
      data={data}
      className={`prose prose-lg prose-headings:text-ocean-900 prose-a:text-brand-600 max-w-none ${className}`}
    />
  )
}
