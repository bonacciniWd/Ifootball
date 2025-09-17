import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Exemplos de animações, você pode trocar os imports
import step1Animation from "../../public/lottie/1.json";
import step2Animation from "../../public/lottie/live.json";
import step3Animation from "../../public/lottie/2.json";
import step4Animation from "../../public/lottie/4.json";
import step5Animation from "../../public/lottie/track.json";
import step6Animation from "../../public/lottie/5.json";
import step7Animation from "../../public/lottie/3.json";

const steps = [
  {
    title: "Bem-vindo ao iFootball!",
    description: "Um novo jeito de acompanhar futebol em tempo real.",
    animation: step1Animation,
  },
  {
    title: "Análises em tempo real",
    description: "Receba insights instantâneos durante a partida.",
    animation: step2Animation,
  },
  {
    title: "Estatísticas avançadas",
    description: "Explore números que fazem diferença no jogo.",
    animation: step3Animation,
  },
  {
    title: "Alertas inteligentes",
    description: "Seja avisado sobre momentos decisivos.",
    animation: step4Animation,
  },
  {
    title: "Comparação de jogadores",
    description: "Veja o desempenho lado a lado em segundos.",
    animation: step5Animation,
  },
  {
    title: "Histórico detalhado",
    description: "Acompanhe o progresso de seus times favoritos.",
    animation: step6Animation,
  },
  {
    title: "Pronto para começar?",
    description: "Clique em concluir e explore tudo que o iFootball oferece!",
    animation: step7Animation,
  },
];

export function WelcomePopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setShowPopup(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  if (!showPopup) return null;

  const handleClose = () => {
    setShowPopup(false);
    setStep(0);
  };

  const isFirstStep = step === 0;
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-gray-950/90 text-card-foreground p-8 rounded-2xl shadow-2xl max-w-lg w-full relative">
        {/* Botão Fechar */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-amber-600 transition"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Conteúdo */}
        <div className="flex flex-col items-center text-center">
          {/* Lottie */}
          <div className="w-48 h-48 mb-6">
            <Lottie animationData={steps[step].animation} loop autoplay />
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold mb-3 text-primary">
            {steps[step].title}
          </h2>

          {/* Descrição */}
          <p className="text-muted-foreground mb-6 px-4">
            {steps[step].description}
          </p>

          {/* Botões */}
          <div className="flex justify-center gap-4">
            {/* Se não for o primeiro passo, exibe Voltar */}
            {!isFirstStep && (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Voltar
              </button>
            )}

            {/* Se for o primeiro passo → botão "Começar" central */}
            {isFirstStep && (
              <button
                onClick={() => setStep((prev) => prev + 1)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                Começar
              </button>
            )}

            {/* Se for último passo → botão "Concluir" */}
            {isLastStep && !isFirstStep && (
              <button
                onClick={handleClose}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Concluir
              </button>
            )}

            {/* Se não for o último → botão "Próximo" */}
            {!isLastStep && !isFirstStep && (
              <button
                onClick={() => setStep((prev) => prev + 1)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                Próximo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
