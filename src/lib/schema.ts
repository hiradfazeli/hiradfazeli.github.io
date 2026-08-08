/**
 * JSON-LD node builders.
 *
 * There is exactly ONE canonical Person node, published in full on /about/ (a
 * ProfilePage) and referenced everywhere else by @id. Duplicating the full Person
 * on every page creates several disconnected identities and dilutes the signal,
 * which is the opposite of what we want: search engines and AI answer engines
 * should resolve every page back to the same entity.
 *
 * Every value here must also be visible somewhere on the rendered page.
 */

import { CERTIFICATIONS, EDUCATION, PERSON, SITE } from '../data/profile';

const az104 = CERTIFICATIONS.find((c) => c.identifier === 'AZ-104')!;

/** Reference form — used by every page that is not /about/. */
export const personRef = { '@id': SITE.personId };

export const organizationNode = {
  '@type': 'Organization',
  '@id': SITE.orgId,
  name: 'ZEEberton',
  url: 'https://zeeberton.com',
  description:
    'A map-first social network that connects nearby pet owners for walks, playdates and neighbourhood lost-pet alerts.',
  founder: personRef,
};

/** The full Person record. Emit this on /about/ only. */
export function personNode(imageUrl: string) {
  return {
    '@type': 'Person',
    '@id': SITE.personId,
    name: PERSON.name,
    givenName: 'Hirad',
    familyName: 'Fazeli',
    url: `${SITE.url}/about/`,
    mainEntityOfPage: `${SITE.url}/about/`,
    image: imageUrl,
    jobTitle: PERSON.jobTitle,
    description: PERSON.summary,
    email: `mailto:${PERSON.email}`,
    birthDate: PERSON.birth.date,
    birthPlace: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tehran',
        addressCountry: 'IR',
      },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: PERSON.location.city,
      addressCountry: PERSON.location.countryCode,
    },
    nationality: { '@type': 'Country', name: 'Iran' },
    knowsLanguage: [
      { '@type': 'Language', name: 'Persian', alternateName: 'fa' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
      { '@type': 'Language', name: 'Georgian', alternateName: 'ka' },
    ],
    knowsAbout: [...PERSON.knowsAbout],
    worksFor: { '@id': SITE.orgId },
    alumniOf: EDUCATION.map((e) => ({
      '@type': 'EducationalOrganization',
      name: e.school,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tehran',
        addressCountry: 'IR',
      },
    })),
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: az104.name,
      credentialCategory: 'certification',
      identifier: az104.identifier,
      url: az104.url,
      dateCreated: az104.earnedISO,
      expires: az104.expiresISO,
      recognizedBy: { '@type': 'Organization', name: 'Microsoft' },
    },
    // The strongest identity-resolution signal available: evidence that these
    // scattered profiles all describe the same person.
    sameAs: PERSON.links.map((l) => l.url),
  };
}

export const websiteNode = {
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: `${SITE.url}/`,
  name: `${PERSON.name} — ${PERSON.headline}`,
  inLanguage: 'en',
  publisher: personRef,
};

export function breadcrumbNode(trail: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}
