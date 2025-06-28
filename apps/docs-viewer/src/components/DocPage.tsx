import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function stripFrontmatter(content: string): string {
  if (content.startsWith('---')) {
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd !== -1) {
      return content.slice(frontmatterEnd + 3).trim();
    }
  }
  return content;
}

const DocPage = () => {
  const params = useParams();
  const path = params['*'];
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (path) {
      setLoading(true);
      fetch(`/${path}`)
        .then(res => res.ok ? res.text() : Promise.reject(res.statusText))
        .then(text => {
          const cleanedMarkdown = stripFrontmatter(text);
          setMarkdown(cleanedMarkdown);
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch document:", error);
          setMarkdown(`# 404: Not Found\n\nCould not find the document at \`${path}\`.`);
          setLoading(false);
        });
    }
  }, [path]);

  if (!path) {
    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Welcome to AI-Q Library</h1>
                <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">📚 The Knowledge Library</h2>
                    <p className="text-blue-800 dark:text-blue-200">
                        The definitive source of truth for kOS and griot-node development. 
                        Select a document from the navigation to explore the comprehensive specifications and architecture.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🎯 Foundation</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Core philosophy and architectural vision</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📡 Protocols</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Communication and interoperability specs</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🏗️ Node Specifications</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Complete technical implementations</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">⚡ Architecture</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">System design and deployment guides</p>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (loading) {
      return (
          <div className="p-8 lg:p-12">
              <div className="max-w-4xl mx-auto">
                  <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none p-8 lg:p-12 prose-blue dark:prose-blue">
      <div className="max-w-4xl mx-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default DocPage; 