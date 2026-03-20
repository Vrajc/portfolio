import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectDetail from '../../../src/components/ProjectDetail'
import { PROJECTS } from '../../../src/data/projects'

type PageProps = {
  params: Promise<{ slug: string }>
}

function toAbsoluteImage(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://vraj-chauhan.tech${url}`
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = PROJECTS.find((entry) => entry.slug === slug)

  if (!project) {
    return {
      title: 'Project Not Found | Vraj Chauhan',
    }
  }

  const title = `${project.name} | Project by Vraj Chauhan`
  const description = project.subtitle
  const canonicalUrl = `https://vraj-chauhan.tech/project/${project.slug}`
  const image = toAbsoluteImage(project.image)

  return {
    title,
    description,
    alternates: {
      canonical: `/project/${project.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Vraj Chauhan Portfolio',
      locale: 'en_US',
      url: canonicalUrl,
      images: [{ url: image, alt: `${project.name} project preview` }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Vrajc',
      creator: '@Vrajc',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = PROJECTS.find((entry) => entry.slug === slug)

  if (!project) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.subtitle,
    url: `https://vraj-chauhan.tech/project/${project.slug}`,
    image: toAbsoluteImage(project.image),
    creator: {
      '@type': 'Person',
      name: 'Vraj Chauhan',
      url: 'https://vraj-chauhan.tech/',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetail slug={slug} />
    </>
  )
}
