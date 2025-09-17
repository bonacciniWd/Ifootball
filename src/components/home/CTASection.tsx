import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl w-full">

  <div 
    className="absolute inset-0 z-0 opacity-50 bg-black"
    style={{ 
      backgroundImage: `url('/fundo1.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  ></div>
  <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mx-auto"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
        Pronto para <span className="text-primary">revolucionar</span> suas análises?
      </h2>
      <p className="text-primary-foreground text-xl py-8 mx-auto max-w-2xl">
        Junte-se a milhares de profissionais que já estão usando o iFootball para 
        tomar decisões mais inteligentes no mundo do futebol.
      </p>
      <Button 
        size="lg"
        asChild
        className="relative z-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <Link to="/teste-gratis">Começar Agora</Link>
      </Button>
    </motion.div>
  </div>
</section>

  );
}
