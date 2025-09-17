import { useState, useEffect } from "react";
import TextScramble from "@/components/TextScramble";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [currentImage, setCurrentImage] = useState("/hero.svg");

  const scrambleTexts = [
    "Poder Computacional",
    "Analises detalhadas",
    "Métricas em Tempo Real",
    "É I-Football"
  ];

  useEffect(() => {
    const images = ["/hero.svg", "/hero-2.svg"];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      setCurrentImage(images[index]);
    }, 5000); // troca a cada 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full z-20 h-screen text-white flex items-center justify-center text-center overflow-hidden bg-black">
      {/* Vídeo de fundo */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/video-bg.mp4" type="video/webm" />
          <source src="/video-bg.webm" type="video/mp4" />
          {/* Se chegar aqui, o navegador não suportou os formatos */}
        </video>

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/55 z-10" />
      </div>

      {/* Conteúdo sobreposto */}
      <div className="flex justify-between items-center relative z-30 w-11/12 max-w-xl bg-gradient-to-bl from-background to-slate-900/50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 mb-24 gap-8 animate-fade-in-up md:flex-row flex-col text-center">
        <div className="flex-1 text-white">
          <TextScramble texts={scrambleTexts} className="text-3xl mb-8 px-4" />
          <p className="text-lg text-gray-100">
            Descubra o poder da inteligência artificial aplicada ao futebol.
            Análises em tempo real, previsões precisas e insights estratégicos.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Button variant="default" size="lg" asChild>
              <a href="/teste-gratis">
                Começar Gratuitamente
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-orange-500 text-white hover:bg-orange-500/20 hover:text-white">
              <a href="/como-funciona">
                Saiba Mais
              </a>
            </Button>
          </div>
        </div>
        
      </div>
      <div>
        <div className="relative flex justify-center items-center">
          <img
              src={currentImage}
              alt="Mockup do Aplicativo iFootball"
              className="transition-opacity duration-700 ease-in-out"
            />
          </div>
      </div>

    </section>
    
  );
}
