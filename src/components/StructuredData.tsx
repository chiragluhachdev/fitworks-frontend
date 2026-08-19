import React from "react";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://fitworks.in/#organization",
        "name": "FitWorks",
        "url": "https://fitworks.in",
        "logo": {
          "@type": "ImageObject",
          "url": "https://fitworks.in/icon.png",
          "width": "512",
          "height": "512"
        },
        "description": "India's trusted marketplace connecting gyms and fitness clubs with verified personal trainers, coaches and fitness specialists.",
        "sameAs": [
          "https://www.instagram.com/fitworks_india",
          "https://www.linkedin.com/company/fitworks"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://fitworks.in/#website",
        "url": "https://fitworks.in",
        "name": "FitWorks",
        "description": "Find and hire verified fitness trainers and coaches across India.",
        "publisher": {
          "@id": "https://fitworks.in/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://fitworks.in/find-trainers?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "EmploymentAgency",
        "@id": "https://fitworks.in/#employmentAgency",
        "name": "FitWorks Fitness Recruitment Platform",
        "url": "https://fitworks.in",
        "description": "Specialized hiring and placement platform for gyms and verified fitness trainers in India.",
        "parentOrganization": {
          "@id": "https://fitworks.in/#organization"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
