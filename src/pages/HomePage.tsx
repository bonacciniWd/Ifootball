import { Helmet } from 'react-helmet-async';
import {
  HeroSection,
  TestimonialsSection,
  CTASection,
  Grid
} from '@/components/home';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>iFootball - Análise de Jogos em Tempo Real com IA</title>
        <meta 
          name="description" 
          content="Descubra o poder da IA na análise de jogos de futebol. Métricas em tempo real, probabilidades e insights estratégicos."
        />
      </Helmet>

      <div className="min-h-screen">
        <HeroSection />
        <Grid />
        <TestimonialsSection />
        <CTASection />
       
      </div>
    </>
  );
}
