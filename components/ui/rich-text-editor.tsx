'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { useEffect, useRef } from 'react'

// Normalize empty HTML for comparison (Quill/TipTap use <p></p> or <p><br></p>)
function normalizeEmptyHtml(html: string): string {
  const t = (html || '').trim()
  if (!t || t === '<p></p>' || t === '<p><br></p>') return ''
  return t
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className = '',
  minHeight = '200px',
}: RichTextEditorProps) {
  const lastSentHtml = useRef<string>(normalizeEmptyHtml(value))

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline' } }),
    ],
    content: value ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'rich-text-editor-admin-inner focus:outline-none min-h-[200px] px-3 py-2',
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      lastSentHtml.current = normalizeEmptyHtml(html)
      onChange(html)
    },
  })

  // Sync when parent passes a new value (e.g. form reset or switching to another service)
  useEffect(() => {
    if (!editor) return
    const current = normalizeEmptyHtml(editor.getHTML())
    const next = normalizeEmptyHtml(value ?? '')
    if (next !== current && next !== lastSentHtml.current) {
      editor.commands.setContent(next || '<p></p>', { emitUpdate: false })
      lastSentHtml.current = next
    }
  }, [editor, value])

  if (!editor) {
    return (
      <div className={`rounded-md border border-gray-300 ${className}`} style={{ minHeight }}>
        <div className="px-3 py-2 text-gray-500">{placeholder}</div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="rich-text-editor-admin rounded-md border border-gray-300 bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-gray-300" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <b>B</b>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <i>I</i>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <s>S</s>
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-gray-300" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet list"
          >
            •
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Ordered list"
          >
            1.
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const url = window.prompt('Enter URL:', editor.getAttributes('link').href || 'https://')
              if (url != null) editor.chain().focus().setLink({ href: url || '' }).run()
            }}
            active={editor.isActive('link')}
            title="Link"
          >
            Link
          </ToolbarButton>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
        active ? 'bg-gray-300 text-gray-800' : 'bg-transparent text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}
