import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none',
        // Headings - more spacing
        'prose-headings:font-semibold prose-headings:text-foreground',
        'prose-h2:text-base prose-h2:mt-5 prose-h2:mb-2 prose-h2:border-b prose-h2:border-border prose-h2:pb-1',
        'prose-h3:text-sm prose-h3:mt-4 prose-h3:mb-2',
        // Paragraphs - better spacing
        'prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-3',
        // Lists - better spacing
        'prose-ul:my-3 prose-ul:list-disc prose-ul:pl-4',
        'prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-4',
        'prose-li:text-muted-foreground prose-li:my-1',
        // Code
        'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-lg prose-pre:p-3 prose-pre:overflow-x-auto prose-pre:my-3',
        // Strong/Bold
        'prose-strong:text-foreground prose-strong:font-semibold',
        // Links
        'prose-a:text-primary prose-a:underline prose-a:underline-offset-2',
        // Tables
        'prose-table:my-3',
        // Blockquotes
        'prose-blockquote:border-l-violet-500 prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:my-3',
        className
      )}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
