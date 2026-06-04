export function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "name": "John Cox Memorial CSI Institute of Technology",
    "alternateName": "JCMCSIIT",
    "url": "https://www.jcmcsiit.ac.in/",
    "logo": "https://www.jcmcsiit.ac.in/img/logo3.jpg",
    "sameAs": [
      "https://www.facebook.com/jcmcsiit",
      "https://www.linkedin.com/school/jcmcsiit"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kannammoola",
      "addressLocality": "Trivandrum",
      "addressRegion": "Kerala",
      "postalCode": "695011",
      "addressCountry": "IN"
    },
    "telephone": "+919496981555",
    "description": "A premium engineering college in Trivandrum offering future-ready tech education and high placements."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CourseSchema({ courseName, description }: { courseName: string, description: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseName,
    "description": description,
    "provider": {
      "@type": "CollegeOrUniversity",
      "name": "JCMCSIIT",
      "sameAs": "https://www.jcmcsiit.ac.in/"
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function EventSchema({ name, description, startDate, endDate, image }: { name: string, description: string, startDate: string, endDate?: string, image?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "startDate": startDate,
    ...(endDate && { "endDate": endDate }),
    ...(image && { "image": image }),
    "location": {
      "@type": "Place",
      "name": "JCMCSIIT Campus",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Kannammoola",
        "addressLocality": "Trivandrum",
        "addressRegion": "Kerala",
        "postalCode": "695011",
        "addressCountry": "IN"
      }
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function BreadcrumbSchema({ items }: { items: { name: string, item: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function FAQSchema({ faqs }: { faqs: { question: string, answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
