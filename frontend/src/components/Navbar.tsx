import React, { useState } from 'react';
import { LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { ShieldCheck, Globe, Menu, X, Bot, Landmark, FileText, CheckCircle2, UserCheck, Settings } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  backendOnline
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_TRANSLATIONS[language];

  const navItems = [
    { id: 'home', label: t.nav_home, icon: Landmark },
    { id: 'chat', label: t.nav_chat, icon: Bot, highlight: true },
    { id: 'schemes', label: t.nav_schemes, icon: FileText },
    { id: 'eligibility', label: t.nav_eligibility, icon: UserCheck },
    { id: 'checklist', label: t.nav_checklist, icon: CheckCircle2 },
    { id: 'admin', label: t.nav_admin, icon: Settings },
    { id: 'about', label: t.nav_about, icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#14263D] text-white shadow-md border-b border-[#1E385B]">
      {/* Top micro-bar for official status */}
      <div className="bg-[#0D1A2B] text-xs px-4 py-1.5 flex justify-between items-center text-slate-300 border-b border-[#1A2D46]">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span className="font-medium text-slate-200">
            {language === 'mr' ? 'महाराष्ट्र शासन जनकल्याण उपक्रम' : language === 'hi' ? 'महाराष्ट्र शासन जनकल्याण पहल' : 'Government of Maharashtra Welfare Initiative'}
          </span>
          <span className="hidden sm:inline text-slate-400">• Seva First Innovation Challenge 2026</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className="text-[11px] text-slate-300">
              {backendOnline ? 'RAG Engine Grounded' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center space-x-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#167D83] to-[#2099A0] flex items-center justify-center shadow-md border border-teal-400/30 group-hover:scale-105 transition-transform">
              <span className="text-xl font-bold text-white tracking-wider">स</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  {t.app_title}
                </span>
                <span className="text-[10px] bg-[#E3A64A]/20 text-[#E3A64A] font-semibold px-1.5 py-0.5 rounded border border-[#E3A64A]/40 uppercase tracking-wider">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-none">
                {language === 'mr' ? 'नागरिक सेवा व स्मार्ट गव्हर्नन्स' : language === 'hi' ? 'नागरिक सेवा व स्मार्ट गवर्नेंस' : 'Citizen Services & Smart Governance'}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#167D83] text-white shadow-sm'
                      : item.highlight
                      ? 'text-teal-300 hover:bg-[#1E385B] hover:text-white'
                      : 'text-slate-200 hover:bg-[#1E385B] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Selector & Mobile Menu Toggle */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="relative flex items-center bg-[#1E385B] border border-slate-600 rounded-lg p-0.5 text-xs">
              <Globe className="w-3.5 h-3.5 text-teal-400 ml-2 mr-1" />
              <button
                onClick={() => setLanguage('mr')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'mr' ? 'bg-[#167D83] text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'hi' ? 'bg-[#167D83] text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'en' ? 'bg-[#167D83] text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#1E385B] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1E30] border-t border-[#1E385B] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium ${
                  isActive
                    ? 'bg-[#167D83] text-white'
                    : 'text-slate-200 hover:bg-[#1E385B]'
                }`}
              >
                <Icon className="w-5 h-5 text-teal-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

