import HomePortfolio from '../src/components/HomePortfolio'

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vraj Chauhan',
    url: 'https://vraj-chauhan.tech/',
    image: 'https://vraj-chauhan.tech/vraj.png',
    jobTitle: 'Full Stack Developer',
    sameAs: ['https://www.linkedin.com/in/vraj-chauhan07/', 'https://github.com/Vrajc'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePortfolio />
    </>
  )
}
