/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { useApp } from './context/AppContext';

// Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingInfo from './screens/OnboardingInfo';
import OnboardingForm from './screens/OnboardingForm';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import UserTypeSelection from './screens/UserTypeSelection';
import AuthScreen from './screens/AuthScreen';
import GuestListPage from './screens/GuestListPage';

// Dashboards
import AdminLogin from './dashboards/AdminLogin';
import VendorDashboard from './dashboards/VendorDashboard';
import PlannerDashboard from './dashboards/PlannerDashboard';

// Layout
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import MegaMenu from './components/MegaMenu';
import ExpertChatModal from './components/ExpertChatModal';
import SideMenuDrawer from './components/SideMenuDrawer';
import NotificationsDrawer from './components/NotificationsDrawer';

// Tabs
import HomeTab from './tabs/HomeTab';
import ChecklistTab from './tabs/ChecklistTab';
import InspirationTab from './tabs/InspirationTab';
import PackagesTab from './tabs/PackagesTab';
import BudgetTab from './tabs/BudgetTab';
import ProfileTab from './tabs/ProfileTab';
import CategoryPage from './tabs/CategoryPage';
import { RealWeddingsPage, BlogsPage, BookingsPage, SavedVendorsPage, SettingsPage, HelpSupportPage, AboutVivahPage } from './tabs/Pages';

const SECONDARY_SCREENS = ['bookings', 'saved_vendors', 'settings', 'help_support', 'about_vivah', 'guest_list'];
const MAIN_SCREENS = ['dashboard', 'checklist', 'inspiration', 'packages', 'profile', 'category_page', 'real_weddings', 'blogs', ...SECONDARY_SCREENS];

export default function App() {
  const { state, activeTab, showSplash, setShowSplash, isExpertChatOpen, setIsExpertChatOpen } = useApp();
  const [chatMessages, setChatMessages] = useState([{ id: 'initial', role: 'expert' as const, text: "Hi! 👋 I'm your Vivah Wedding Expert. How can I help you today?" }]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto h-[100dvh] bg-ivory overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {/* Splash */}
        {showSplash && <SplashScreen key="splash" onDone={() => setShowSplash(false)} />}

        {/* Onboarding */}
        {!showSplash && state.screen === 'onboarding_info' && <OnboardingInfo key="info" />}
        {!showSplash && state.screen === 'user_type' && <UserTypeSelection key="user_type" />}
        {!showSplash && state.screen === 'role_selection' && <RoleSelectionScreen key="role" />}
        {!showSplash && state.screen === 'auth' && <AuthScreen key="auth" />}
        {!showSplash && state.screen === 'onboarding_form' && <OnboardingForm key="form" />}

        {/* Dashboards */}
        {!showSplash && state.screen === 'admin_login' && <AdminLogin key="admin_login" />}
        {!showSplash && state.screen === 'vendor_dashboard' && <VendorDashboard key="vendor" />}
        {!showSplash && state.screen === 'planner_dashboard' && <PlannerDashboard key="planner" />}

        {/* Main App */}
        {!showSplash && MAIN_SCREENS.includes(state.screen) && (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col relative overflow-hidden h-full">
            {!SECONDARY_SCREENS.includes(state.screen) && <TopBar />}
            <MegaMenu />

            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              <AnimatePresence mode="wait">
                {/* Full pages */}
                {state.screen === 'category_page' && <motion.div key="cp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-50"><CategoryPage /></motion.div>}
                {state.screen === 'real_weddings' && <motion.div key="rw" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-50"><RealWeddingsPage /></motion.div>}
                {state.screen === 'blogs' && <motion.div key="bl" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-50"><BlogsPage /></motion.div>}
                {state.screen === 'bookings' && <motion.div key="bk" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><BookingsPage /></motion.div>}
                {state.screen === 'saved_vendors' && <motion.div key="sv" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><SavedVendorsPage /></motion.div>}
                {state.screen === 'settings' && <motion.div key="st" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><SettingsPage /></motion.div>}
                {state.screen === 'help_support' && <motion.div key="hs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><HelpSupportPage /></motion.div>}
                {state.screen === 'about_vivah' && <motion.div key="av" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><AboutVivahPage /></motion.div>}
                {state.screen === 'guest_list' && <motion.div key="gl" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><GuestListPage /></motion.div>}

                {/* Bottom nav tabs */}
                {activeTab === 'home' && state.screen === 'dashboard' && <motion.div key="h" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><HomeTab /></motion.div>}
                {activeTab === 'checklist' && state.screen === 'dashboard' && <motion.div key="c" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><ChecklistTab /></motion.div>}
                {activeTab === 'inspiration' && state.screen === 'dashboard' && <motion.div key="i" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><InspirationTab /></motion.div>}
                {activeTab === 'packages' && state.screen === 'dashboard' && <motion.div key="p" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><PackagesTab /></motion.div>}
                {activeTab === 'budget' && state.screen === 'dashboard' && <motion.div key="b" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><BudgetTab /></motion.div>}
                {activeTab === 'profile' && state.screen === 'dashboard' && <motion.div key="pr" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><ProfileTab /></motion.div>}
              </AnimatePresence>
            </div>

            {!SECONDARY_SCREENS.includes(state.screen) && <BottomNav />}
            <SideMenuDrawer />
            <NotificationsDrawer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <AnimatePresence>
        {!showSplash && !isExpertChatOpen && (
          <motion.div key="chat-button" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsExpertChatOpen(true)} className="absolute bottom-20 right-4 z-[150] bg-white rounded-full shadow-2xl p-3 flex items-center gap-3 border border-slate-100 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center text-ivory"><MessageCircle size={24} /></div>
            <span className="text-xs font-bold text-slate-700 pr-2">How may we help you?</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expert Chat Modal */}
      <ExpertChatModal
        isOpen={isExpertChatOpen}
        onClose={() => setIsExpertChatOpen(false)}
        messages={chatMessages}
        setMessages={setChatMessages}
        input={chatInput}
        setInput={setChatInput}
        isTyping={isTyping}
        setIsTyping={setIsTyping}
      />
    </div>
  );
}
