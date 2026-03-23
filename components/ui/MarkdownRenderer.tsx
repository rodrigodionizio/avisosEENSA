// components/ui/MarkdownRenderer.tsx
'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Renderiza texto com suporte a Markdown de forma segura
 * 
 * Formatações suportadas:
 * - **Negrito** ou __negrito__
 * - *Itálico* ou _itálico_
 * - ~~Riscado~~
 * - [Links](url)
 * - Listas (- ou 1.)
 * - > Citações
 * - Quebras de linha (dupla quebra)
 * 
 * Segurança:
 * - HTML é sanitizado (previne XSS)
 * - Scripts são bloqueados automaticamente
 * - Apenas tags seguras são permitidas
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
        // Customizar elementos renderizados
        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-bold text-eensa-text">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ children, href }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-eensa-teal hover:text-eensa-green underline transition-colors"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="ml-2">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-eensa-green pl-4 italic text-eensa-text2 my-3 bg-eensa-surface2/50 py-2 rounded-r">
            {children}
          </blockquote>
        ),
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-2 first:mt-0">{children}</h3>,
        code: ({ children }) => (
          <code className="bg-eensa-surface2 px-1.5 py-0.5 rounded text-sm font-mono text-eensa-green">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
