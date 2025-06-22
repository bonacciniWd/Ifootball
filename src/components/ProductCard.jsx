import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/components/ui/use-toast';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { toast } = useToast();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
    } else {
      toast({
        title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product.id);
    } else {
      toast({
        title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
      });
    }
  };

  return (
    <Card className="glass-card hover-lift transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="gradient-text text-lg mb-2">{product.name}</CardTitle>
            <CardDescription className="text-blue-200/80">
              {product.category}
            </CardDescription>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8 text-blue-300 hover:text-blue-100 hover:bg-blue-500/20"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-red-300 hover:text-red-100 hover:bg-red-500/20"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {product.image && (
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        
        <div className="space-y-2">
          <p className="text-blue-100/90 text-sm leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-2xl font-bold gradient-text">
              R$ {product.price}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              product.status === 'available' 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`}>
              {product.status === 'available' ? 'Disponível' : 'Em Produção'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;