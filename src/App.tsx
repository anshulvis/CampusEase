/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AuthPage } from './components/AuthPage';
import { MyRequests } from './components/MyRequests';
import { Navbar } from './components/Navbar';
import { ProfileView } from './components/ProfileView';
import { ProviderModal } from './components/ProviderModal';
import { ServiceCatalog } from './components/ServiceCatalog';
import { SERVICE_PROVIDERS } from './data/providers';
import { NavTab, RequestStatus, ServiceProvider, ServiceRequest, StudentUser } from './types';
import {
  getCurrentUser,
  getUserRequests,
  initializeStorage,
  logoutUser,
  updateRequestStatus,
} from './utils/storage';

export default function App() {
  const [user, setUser] = useState<StudentUser | null>(() => {
    initializeStorage();
    return getCurrentUser();
  });

  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [prefillNotes, setPrefillNotes] = useState<string>('');

  useEffect(() => {
    if (user) {
      setRequests(getUserRequests(user.id));
    } else {
      setRequests([]);
    }
  }, [user]);

  const handleAuthenticated = (authenticatedUser: StudentUser) => {
    setUser(authenticatedUser);
    setActiveTab('explore');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setSelectedProvider(null);
    setPrefillNotes('');
    setActiveTab('explore');
  };

  const handleSelectProvider = (provider: ServiceProvider) => {
    setPrefillNotes('');
    setSelectedProvider(provider);
  };

  const handleRequestCreated = (newRequest: ServiceRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  };

  const handleUpdateStatus = (requestId: string, status: RequestStatus) => {
    updateRequestStatus(requestId, status);
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status } : req))
    );
  };

  const handleRequestAgain = (pastRequest: ServiceRequest) => {
    const provider = SERVICE_PROVIDERS.find((p) => p.id === pastRequest.providerId);
    if (!provider) return;
    setPrefillNotes(pastRequest.serviceNotes);
    setSelectedProvider(provider);
  };

  if (!user) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  const activeRequestCount = requests.filter((r) => r.status !== 'Completed').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeRequestCount={activeRequestCount}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-24 md:pb-12">
        {activeTab === 'explore' && (
          <ServiceCatalog user={user} onSelectProvider={handleSelectProvider} />
        )}

        {activeTab === 'requests' && (
          <MyRequests
            requests={requests}
            onRequestAgain={handleRequestAgain}
            onUpdateStatus={handleUpdateStatus}
            onExploreServices={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            totalRequests={requests.length}
            activeRequests={activeRequestCount}
            onUserUpdated={setUser}
            onLogout={handleLogout}
          />
        )}
      </main>

      <footer className="hidden md:block border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between text-xs text-slate-500">
          <p>CampusEase · Local student services for DBS Global University (DGU), Dehradun</p>
          <p>Direct cash / UPI to local provider on delivery · No online payment gateway</p>
        </div>
      </footer>

      <ProviderModal
        provider={selectedProvider}
        user={user}
        initialNotes={prefillNotes}
        onClose={() => {
          setSelectedProvider(null);
          setPrefillNotes('');
        }}
        onRequestCreated={handleRequestCreated}
        onGoToRequests={() => setActiveTab('requests')}
      />
    </div>
  );
}
