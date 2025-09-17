import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';

import HomePage from '@/pages/HomePage';
import GameAnalysisPage from '@/pages/GameAnalysisPage';
import GameSelectionPage from '@/pages/GameSelectionPage';
import LoginPage from '@/pages/LoginPage';
import FreeTrialPage from '@/pages/FreeTrialPage';
import LicensePage from '@/pages/LicensePage';
import InvitePage from '@/pages/InvitePage';
import AdminPage from '@/pages/AdminPage';
import SearchPage from '@/pages/SearchPage';
import LiveTrackingPage from '@/pages/LiveTrackingPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPageSimple';
import ProfilePage from '@/pages/ProfilePage';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { WelcomePopup } from './components/WelcomePopup';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider> {/* Envolver com AuthProvider */}
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game-analysis" element={<GameAnalysisPage />} />
              <Route path="/analise-jogo" element={<GameAnalysisPage />} />
              <Route path="/selecionar-jogo" element={<GameSelectionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/teste-gratis" element={<FreeTrialPage />} />
              <Route path="/licenca" element={<LicensePage />} />
              <Route path="/license" element={<LicensePage />} />
              <Route path="/invite" element={<InvitePage />} />
              <Route path="/convite" element={<InvitePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/busca" element={<SearchPage />} />
              <Route path="/pesquisa" element={<SearchPage />} />
              <Route path="/live" element={<LiveTrackingPage />} />
              <Route path="/ao-vivo" element={<LiveTrackingPage />} />
              <Route path="/tracking" element={<LiveTrackingPage />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/termos" element={<TermsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <GameSelectionPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <WelcomePopup />
          </Layout>
          <Toaster />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
