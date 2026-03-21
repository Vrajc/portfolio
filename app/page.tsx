import HomePortfolio from '../src/components/HomePortfolio'
import { PROJECTS } from '../src/data/projects'

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://vraj-chauhan.tech/#person',
        name: 'Vraj Chauhan',
        url: 'https://vraj-chauhan.tech/',
        image: 'https://vraj-chauhan.tech/vraj.png',
        jobTitle: 'Full Stack Developer',
        sameAs: ['https://www.linkedin.com/in/vraj-chauhan07/', 'https://github.com/Vrajc'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://vraj-chauhan.tech/#website',
        url: 'https://vraj-chauhan.tech/',
        name: 'Vraj Chauhan Portfolio',
        inLanguage: 'en-US',
        publisher: {
          '@id': 'https://vraj-chauhan.tech/#person',
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://vraj-chauhan.tech/#projects',
        name: 'Featured Projects',
        itemListElement: PROJECTS.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `https://vraj-chauhan.tech/project/${project.slug}`,
          name: project.name,
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <HomePortfolio />
    </>
  )
}
