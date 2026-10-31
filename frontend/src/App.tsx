import React, { useState, useEffect } from 'react';
import { Scheme, LanguageCode } from './types';
import { fetchSchemes, checkBackendHealth } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ChatPage } from './components/ChatPage';
import { SchemeExplorer } from './components/SchemeExplorer';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { EligibilityPage } from './components/EligibilityPage';
import { ChecklistPage } from './components/ChecklistPage';
import { AdminPage } from './components/AdminPage';
import { AboutPage } from './components/AboutPage';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<LanguageCode>('mr'); // Default to Marathi for Maharashtra
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [checklistSchemeId, setChecklistSchemeId] = useState<string | undefined>(undefined);
  const [chatInitialQuery, setChatInitialQuery] = useState<string | undefined>(undefined);
  const [selectedCategoryForExplorer, setSelectedCategoryForExplorer] = useState<string>('All');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [health, fetchedSchemes] = await Promise.all([
        checkBackendHealth().catch(() => null),
        fetchSchemes().catch(() => [])
      ]);

      if (health && health.status === 'healthy') {
        setBackendOnline(true);
      }
      setSchemes(fetchedSchemes);
    } catch (err) {
      console.warn('Backend connection warning:', err);
    }
  };

  const handleNavigate = (tab: string, initialQuery?: string, categoryFilter?: string) => {
    if (initialQuery) {
      setChatInitialQuery(initialQuery);
    }
    if (categoryFilter) {
      setSelectedCategoryForExplorer(categoryFilter);
    } else if (tab === 'schemes' && !categoryFilter) {
      setSelectedCategoryForExplorer('All');
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChecklist = (schemeId: string) => {
    setChecklistSchemeId(schemeId);
    setCurrentTab('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSchemeById = (schemeId: string) => {
    const s = schemes.find(item => item.id === schemeId || item.slug === schemeId);
    if (s) {
      setSelectedScheme(s);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-slate-900 font-sans">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setChatInitialQuery(undefined);
          handleNavigate(tab);
        }}
        language={language}
        setLanguage={setLanguage}
        backendOnline={backendOnline}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            schemes={schemes}
            language={language}
            onNavigate={handleNavigate}
            onSelectScheme={setSelectedScheme}
          />
        )}

        {currentTab === 'chat' && (
          <ChatPage
            language={language}
            initialQuery={chatInitialQuery}
            onSelectSchemeById={handleSelectSchemeById}
            onOpenChecklist={handleOpenChecklist}
          />
        )}

        {currentTab === 'schemes' && (
          <SchemeExplorer
            schemes={schemes}
            language={language}
            initialCategory={selectedCategoryForExplorer}
            onSelectScheme={setSelectedScheme}
            onOpenChecklist={handleOpenChecklist}
          />
        )}

        {currentTab === 'eligibility' && (
          <EligibilityPage
            language={language}
            onOpenSchemeModal={handleSelectSchemeById}
            onOpenChecklist={handleOpenChecklist}
          />
        )}

        {currentTab === 'checklist' && (
          <ChecklistPage
            schemes={schemes}
            language={language}
            selectedSchemeId={checklistSchemeId}
            onSelectSchemeId={setChecklistSchemeId}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPage
            schemes={schemes}
            language={language}
            onRefreshSchemes={loadInitialData}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            language={language}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Modal View for Scheme Details */}
      <SchemeDetailModal
        scheme={selectedScheme}
        language={language}
        onClose={() => setSelectedScheme(null)}
        onOpenChecklist={handleOpenChecklist}
      />

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default App;
