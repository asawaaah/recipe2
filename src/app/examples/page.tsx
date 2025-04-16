'use client'

import Link from 'next/link'

export default function ExamplesIndexPage() {
  const examples = [
    {
      title: 'Storage Hooks',
      description: 'Examples of localStorage, sessionStorage, and URL state persistence',
      href: '/examples/storage',
      tags: ['localStorage', 'State', 'Persistence']
    },
    {
      title: 'Complex Forms',
      description: 'Multi-step forms with validation, state persistence, and file uploads',
      href: '/examples/forms',
      tags: ['Forms', 'Validation', 'Multi-step']
    }
    // More example categories can be added here
  ]
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Examples Gallery</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {examples.map((example) => (
          <Link 
            href={example.href} 
            key={example.href}
            className="block p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{example.title}</h2>
            <p className="text-muted-foreground mb-4">{example.description}</p>
            <div className="flex gap-2 flex-wrap">
              {example.tags.map(tag => (
                <span key={tag} className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 