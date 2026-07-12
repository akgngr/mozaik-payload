type Node = Record<string, unknown>

const textNode = (text: string, bold = false): Node => ({
  type: 'text',
  text,
  detail: 0,
  format: bold ? 1 : 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const paragraph = (text: string): Node => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const heading = (tag: 'h2' | 'h3', text: string): Node => ({
  type: 'heading',
  tag,
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const listItem = (text: string): Node => ({
  type: 'listitem',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  value: 1,
})

const list = (items: string[]): Node => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((item) => listItem(item)),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

type Block = { h2: string } | { h3: string } | { p: string } | { ul: string[] }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const richText = (blocks: Block[]): any => ({
  root: {
    type: 'root',
    children: blocks.map((block) => {
      if ('h2' in block) return heading('h2', block.h2)
      if ('h3' in block) return heading('h3', block.h3)
      if ('ul' in block) return list(block.ul)
      return paragraph(block.p)
    }),
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})
