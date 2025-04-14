import React from 'react';
import CategoryCard from '../components/CategoryCard';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <CategoryCard title="Pepinière" subtitle="U7 / U9 / U11" route="/category/Pepinière" />
        <CategoryCard title="Academie" subtitle="U13 / U15" route="/category/Academie" />
        <CategoryCard title="Fabrique" subtitle="U18 Sénior" route="/category/Fabrique" />
      </div>
    </div>
  );
};

export default HomePage;