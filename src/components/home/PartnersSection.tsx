import React from 'react';

interface Partner {
  name: string;
  logo: string;
  url: string;
}

interface PartnersSectionProps {
  partners: Partner[];
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partners }) => {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
          Our Partners
        </h2>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {partners.map((partner, index) => (
            <div key={index} className="flex justify-center items-center">
              <a href={partner.url} target="_blank" rel="noopener noreferrer">
                <img src={partner.logo} alt={partner.name} className="h-16 w-auto object-contain" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
