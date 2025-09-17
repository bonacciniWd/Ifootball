import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { testimonialService } from '@/services/testimonialService'; // Import the new service
import { Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function PublishTestimonialForm({
  onTestimonialSubmitted
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para publicar um depoimento.',
        variant: 'destructive'
      });
      return;
    }

    if (!quote.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, escreva seu depoimento.',
        variant: 'destructive'
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma avaliação.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await testimonialService.submitTestimonial({
        user_id: user.id,
        quote: quote,
        rating: rating
      });

      setQuote('');
      setRating(0);
      toast({
        title: 'Sucesso',
        description: 'Seu depoimento foi publicado com sucesso!',
        variant: 'success'
      });
      if (onTestimonialSubmitted) {
        onTestimonialSubmitted();
      }
    } catch (error) {
      console.error('Erro ao publicar depoimento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível publicar seu depoimento.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="testimonial-quote">Seu Depoimento</Label>
        <Textarea
          id="testimonial-quote"
          placeholder="Compartilhe sua experiência com o iFootball..."
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={5}
          maxLength={500}
        />
      </div>
      <div className="space-y-2">
        <Label>Avaliação</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Publicando...
          </>
        ) : (
          'Publicar Depoimento'
        )}
      </Button>
    </motion.form>
  );
}


