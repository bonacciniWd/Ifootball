import { motion } from 'framer-motion';
import { Play, Star, Bell, Video, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BarChart, Zap, ShieldCheck } from 'lucide-react';
import MetricCard from '@/components/ui/metric-card';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '../ui/button';



interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const videoDetails = {
  videoThumbnail: '/video.png',
  videoUrl: '/video-bg.mp4',
};

const quotes = [
  {
    quote: "A tecnologia é a arte de tornar o invisível visível.",
    author: "Ada Lovelace",
    role: "Poetisa",
  },
  {
    quote: "A verdadeira questão não é se as máquinas pensam, mas se os humanos o fazem.",
    author: "Alan Turing",
    role: "Matemático",
  },
  {
    quote: "Qualquer tecnologia suficientemente avançada é indistinguível de magia.",
    author: "Arthur C. Clarke",
    role: "Escritor de Ficção Científica",
  },
  {
    quote: "Nós moldamos nossas ferramentas, e depois nossas ferramentas nos moldam.",
    author: "Marshall McLuhan",
    role: "Filósofo",
  },
  {
    quote: "A tecnologia é melhor quando une as pessoas.",
    author: "Matt Mullenweg",
    role: "Empreendedor",
  },
  {
    quote: "O espírito humano deve prevalecer sobre a tecnologia.",
    author: "Albert Einstein",
    role: "Físico",
  },
  {
    quote: "Computadores são como uma bicicleta para a nossa mente.",
    author: "Steve Jobs",
    role: "Visionário",
  },
  {
    quote: "A tecnologia da informação e os negócios estão intrinsecamente entrelaçados.",
    author: "Bill Gates",
    role: "Filantropo",
  },
  {
    quote: "O grande mito dos nossos tempos é que a tecnologia é comunicação.",
    author: "Libby Larsen",
    role: "Compositora",
  },
  {
    quote: "A tecnologia permite aos humanos, o que sempre quiseram: estender nossas mentes.",
    author: "Ray Kurzweil",
    role: "Futurista",
  },
];

const features = [
  {
    icon: <BarChart size={32} />,
    title: "Análises Detalhadas",
    description: "Aproveite métricas avançadas e probabilidades calculadas por IA para uma visão completa e aprofundada de cada jogo.",
    color: "text-primary",
    value: "Informações Completas",
    unit: "",
    delay: 0
  },
  {
    icon: <Zap size={32} />,
    title: "Tempo Real",
    description: "Receba estatísticas e insights ao vivo, permitindo que você acompanhe o desenrolar do jogo e tome decisões instantâneas.",
    color: "text-yellow-400",
    value: "Atualizações Constantes",
    unit: "",
    delay: 0.1
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Confiabilidade",
    description: "Nossos algoritmos são rigorosamente testados e validados por especialistas, garantindo resultados precisos e confiáveis para suas estratégias.",
    color: "text-green-400",
    value: "Dados Verificados",
    unit: "",
    delay: 0.2
  },
  {
    icon: <Bell size={32} />,
    title: "Alertas de Probabilidades",
    description: "Receba notificações instantâneas sobre mudanças cruciais nas probabilidades, otimizando suas decisões de aposta.",
    color: "text-red-500",
    value: "Notificações Práticas",
    unit: "",
    delay: 0.3
  },
  {
    icon: <Video size={32} />,
    title: "Integração de Vídeo",
    description: "Análise de vídeo avançada com IA para identificar padrões e otimizar estratégias de jogo, com suporte a Python.",
    color: "text-blue-400",
    value: "Análise Visual",
    unit: "",
    delay: 0.4
  },
  {
    icon: <TrendingUp size={32} />,
    title: "Sugestões de Apostas",
    description: "Obtenha sugestões inteligentes baseadas em IA para suas apostas esportivas, aumentando suas chances de sucesso.",
    color: "text-indigo-400",
    value: "Dicas Inteligentes",
    unit: "",
    delay: 0.5
  },
] as const;


export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 15000); // Change quote every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const mainTestimonial = quotes[currentQuoteIndex];

  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          id,
          quote,
          rating,
          user_profiles ( 
            name,
            avatar_url
          )
        `);

      if (error) {
        console.error('Error fetching testimonials:', error);
        return;
      }

      if (data) {
        const formattedTestimonials: Testimonial[] = data.map((item: any) => ({
          id: item.id,
          quote: item.quote,
          rating: item.rating,
          author: item.user_profiles.name || 'Anonymous',
          avatar: item.user_profiles.avatar_url || '/placeholder.svg',
          role: 'User', // Default role for fetched testimonials
        }));
        setTestimonials(formattedTestimonials);
      }
    }

    fetchTestimonials();
  }, []);

  const cardWidth = 320;
  const gap = 24;
  const totalWidth = testimonials.length * (cardWidth + gap);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-full sm:px-4 md:px-6 lg:px-8 py-0 sm:py-4 md:py-0 min-h-screen bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('/fundobg.jpg')" }}>
      <section className="pt-10 md:pt-32  min-h-[500px] justify-center items-center">
      
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
        </motion.div>

        

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <div className="h-full">
                <MetricCard
                  title={feature.title}
                  value={feature.value}
                  unit={feature.unit}
                  icon={feature.icon}
                  description={feature.description}
                  delay={feature.delay}
                  className="h-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
      <div className=" rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-10 lg:p-16 shadow-sm">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-start mb-8 sm:mb-10 lg:mb-12">
          <div>
            <h1 className="text-2xl px-8 sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
              Real stories. Real results.
            </h1>
          </div>
          
        </div>

        <div className="flex flex-col xl:flex-row justify-between gap-4 sm:gap-6">
          <div className="grid md:grid-cols-2 bg-gradient-to-tr from-background to-slate-900/75 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-16">
            <div className="flex flex-col relative group cursor-pointer w-full aspect-video rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                controls={isPlaying} // Show controls only when playing
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
                src={videoDetails.videoUrl}
                poster={isPlaying ? "" : videoDetails.videoThumbnail}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>

              {!isPlaying && (
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <div className="bg-black/80 hover:bg-green-500/40 backdrop-blur-sm rounded-full px-4 sm:px-6 py-1.5 sm:py-4 flex items-center space-x-1.5 sm:space-x-2 text-white hover:text-green-400">
                    <Play className="w-6 h-8 sm:w-8 sm:h-8 text-white fill-white" />
                    <span className="font-medium text-sm sm:text-base text-white">Assistir Video</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5 flex flex-col justify-between">
              <div className="inline-flex justify-start">
              <p className="text-sm text-white space-x-2 py-1.5 mr-2 font-mono">Status do Sistema: </p>
                  <div className="inline-flex items-center space-x-2 bg-amber-900/20 text-amber-400 px-3 py-1.5 rounded-full text-sm font-medium w-fit">
                    <div className="relative flex items-center justify-center">
                      <div className="w-4 h-4 bg-amber-500/50 rounded-full animate-ping absolute"></div>
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    </div>
                    <span className="px-1">Fase de testes</span>
                  </div>
              </div> 
              
              <div className="p-2 text-center bg-gray-950/90 border-[1px] border-primary shadow-xl shadow-primary/10 rounded-sm">
                <blockquote className="font-medium text-base sm:text-base text-neutral-200">
                  “{mainTestimonial.quote}”
                </blockquote>
                <div className="space-y-1">
                  <p className="font-semibold text-white text-lg sm:text-base">
                  — {mainTestimonial.author}
                  </p>
                  <p className="text-white text-sm">
                    {mainTestimonial.role}
                  </p>
                
                <div>
              </div>
              </div>
              </div>
              <p className="text-sm font-thin sm:text-base md:text-lg text-white leading-relaxed">
              O sistema está em fase de desenvolvimento e logo revolucionará a forma de acompanhar e analisar o futebol. Enquanto preparamos a experiência completa, você pode garantir seu acesso antecipado cadastrando-se em nossa whitelist. 
                </p>
              <div className="relative flex  items-center gap-4 pt-4">
                <img src="/badges/pre-reg-go.png" alt="Pre-Registration Badge" className="h-12 w-auto hover:scale-105 hover:border-green-500 border-[1.5px] rounded-lg" />
                <img src="/badges/black.svg" alt="Pre-Registration Badge Apple" className="h-12 w-auto hover:scale-105 hover:border-green-500 border-[1.5px] rounded-lg" />
                <Button className="h-12 rounded-lg border-2 bg-black flex-shrink-0">
                  <img src="/badges/discord.svg" alt="discord" className="h-8 p-1 w-auto " />
                  <p className="p-2">Discord </p>
                </Button>
                <Button className="h-12 border-2 bg-black">
                  <img src="/badges/telegram.svg" alt="discord" className="h-6 w-auto " />
                  <p className="p-2">Telegram </p>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative py-8 overflow-hidden">
          <motion.div
            className="flex space-x-4 sm:space-x-6"
            animate={{ x: [-totalWidth, 0] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 30,
                ease: 'linear',
              },
            }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
                className="flex-shrink-0 max-w-lg"
              >
                <Card className="bg-gradient-to-tr from-background to-slate-900/50 rounded-xl border-none p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-sm min-h-[180px] sm:min-h-[200px]">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 !text-amber-400 !fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-neutral-200 leading-relaxed text-base sm:text-lg min-h-12 sm:min-h-16">
                    “{testimonial.quote}”
                  </p>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <img
                      width={20}
                      height={20}
                      loading="lazy"
                      src={testimonial.avatar || '/placeholder.svg'}
                      alt={testimonial.author}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-neutral-600"
                    />
                    <div>
                      <p className="font-semibold text-white">
                        {testimonial.author}
                      </p>
                      
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
