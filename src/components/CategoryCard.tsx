import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  subtitle: string;
  route: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, subtitle, route }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(route)}
      className="cursor-pointer bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition-shadow"
    >
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

export default CategoryCard;