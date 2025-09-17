
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './grid.css'; // Import the new CSS file
import { ChevronsLeftRightEllipsisIcon } from '../ui/Animated/ChevronsLeftRightEllipsisIcon';
import { BrainIcon } from '../ui/Animated/BrainIcon';
import { Button } from '../ui/button';

interface Partner {
  name: string;
  logo: string;
  url: string;
  category: string;
}

const partnersData: Partner[] = [
    // ROW 1 → Mundo do Futebol
    {
      name: "Top Players",
      logo: "./images/card1.svg",
      url: "#",
      category: "Top Players",
    },
    {
      name: "Global Leagues",
      logo: "./images/card2.svg",
      url: "#",
      category: "Ligas Mundiais",
    },
    {
      name: "Seleções",
      logo: "./images/card3.svg",
      url: "#",
      category: "Seleções",
    },
    {
      name: "Football Legends",
      logo: "./images/card4.svg",
      url: "#",
      category: "Infrações",
    },
  
    // ROW 2 → Funcionalidades do App
    {
      name: "Odds Pro",
      logo: "./images/card5.svg",
      url: "#",
      category: "Odds",
    },
    {
      name: "Match Stats",
      logo: "./images/card6.svg",
      url: "#",
      category: "Estatisticas",
    },
    {
      name: "AI Insights",
      logo: "./images/card7.svg",
      url: "#",
      category: "AI Insights",
    },
    {
      name: "Live Tracker",
      logo: "./images/card8.svg",
      url: "#",
      category: "Live Tracker",
    },
  ];
  
const PartnersSection = () => {
  const partnersGridRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animation for section title
    const titleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".section-title",
        start: "top bottom-=100",
        toggleActions: "play none none none"
      }
    });

    titleTimeline
      .from(".section-title", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .from(".section-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

    // Animation for partner cards
    gsap.from(".partner-card", {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".partners-grid",
        start: "top bottom-=50",
        toggleActions: "play none none none"
      },
      onComplete: () => {
        // Make cards visible after animation
        gsap.to(".partner-card", {
          opacity: 1,
          y: 0
        });
      }
    });

    // Add better hover animations for the partner cards
    document.querySelectorAll('.partner-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.partner-logo'), {
          y: -10,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.partner-logo'), {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // Subtle rotation on mouse move (3D effect)
    document.querySelectorAll('.partner-card').forEach(card => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(card, {
          rotationX: -rotateX,
          rotationY: rotateY,
          duration: 0.5,
          ease: "power2.out"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)"
        });
      });
    });

  }, []);

  return (
    <section className="partners-section">
      <div className="grid-background"></div>

      <div className="container">
        <div className="section-header header-glass">
        <div className="flex mb-4 flex-row">
            <h1
                className="text-5xl pb-2 font-black"
                style={{
                background: "linear-gradient(30deg, #fff, #40b557)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "solid",
                backgroundClip: "text",
                color: "transparent"
                }}
            >
                A Revolução da IA no Futebol
            </h1>
            <BrainIcon size={40} className="ml-6 text-slate-100  shadow-inner shadow-primary rounded-full bg-primary/10 p-2" />
          </div>  
          
          <p className="text-slate-100 text-lg mr-16">
           O iFootball usa inteligência artificial em tempo real para prever tendências, indicar probabilidades e melhorar suas apostas, elevando suas chances de vitória nas melhores odds do mercado.
          </p>
         
        
        </div>
        <div className="partners-grid" ref={partnersGridRef}>
          {partnersData.map((partner, index) => (
            <div className="partner-card min-h-[350px]" key={index}>
              <div className="card-shine"></div>
              
              <img src={partner.logo} alt={partner.name} className="partner-logo bottom-0" />
               <Button className="z-0 bottom-0 absolute bg-slate-950 font-black partner-category">{partner.category}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { PartnersSection as Grid }; 


"use client";


