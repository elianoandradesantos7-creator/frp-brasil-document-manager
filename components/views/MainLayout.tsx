import React, { useState, useCallback } from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import ModuleView from './ModuleView';
import ImageEditorView from './ImageEditorView';
import LogisticsView from './LogisticsView';
import UserManagementView from './UserManagementView';
import PublicationsView from './PublicationsView';
import StructureManagementView from './StructureManagementView';
import { User, DocumentItem, LogisticsEntry, Module } from '../../types';
import { initialModules, mockModuleFileSystem, mockLogisticsData, mockPublicationsData } from '../../constants';

interface MainLayoutProps {
  user: User;
  onLogout: () => void;
}

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-8">
        <h1 className="text-3xl font-bold text-frp-petroleo">{title}</h1>
        <p className="mt-4 text-gray-600">Conteúdo para {title} em desenvolvimento.</p>
    </div>
);


const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('/dashboard');
  const [appModules, setAppModules] = useState<Module[]>(initialModules);
  const [fileSystemData, setFileSystemData] = useState<{ [key: string]: DocumentItem[] }>(mockModuleFileSystem);
  const [logisticsData, setLogisticsData] = useState<LogisticsEntry[]>(mockLogisticsData);
  const [publicationsData, setPublicationsData] = useState<DocumentItem[]>(mockPublicationsData);

  const handleNavigate = useCallback((path: string) => {
    setActiveView(path);
  }, []);

  const handleFileSystemUpdate = useCallback((modulePath: string, newFileSystemSlice: DocumentItem[]) => {
      setFileSystemData(prevFileSystem => ({
          ...prevFileSystem,
          [modulePath]: newFileSystemSlice,
      }));
  }, []);
  
  const handleLogisticsUpdate = useCallback((newData: LogisticsEntry[]) => {
    setLogisticsData(newData);
  }, []);

  const handlePublicationsUpdate = useCallback((newData: DocumentItem[]) => {
    setPublicationsData(newData);
  }, []);

  const handleStructureUpdate = useCallback((newModules: Module[]) => {
      const oldModules = appModules;
      setAppModules(newModules);
      
      setFileSystemData(prevFs => {
          const newFs = { ...prevFs };
          newModules.forEach(mod => {
              if (!newFs[mod.path]) {
                  newFs[mod.path] = [];
              }
          });
          oldModules.forEach(mod => {
              const stillExists = newModules.some(newMod => newMod.id === mod.id);
              if (!stillExists) {
                  delete newFs[mod.path];
              }
          });
          return newFs;
      });

  }, [appModules]);

  const handlePublishRequest = useCallback((itemToPublish: DocumentItem) => {
    setPublicationsData(prev => {
        if (prev.some(p => p.id === itemToPublish.id)) {
            // Item already exists, maybe just navigate to publications?
            handleNavigate('/publications');
            return prev;
        }
        const newPublicationItem: DocumentItem = {
            ...itemToPublish,
            children: undefined, // Publications are files, not folders
            status: 'Rascunho',
            publicLink: undefined
        };
        handleNavigate('/publications');
        return [newPublicationItem, ...prev];
    });
  }, [handleNavigate]);

  const renderContent = () => {
    if (activeView === '/dashboard') return <PlaceholderView title="Dashboard" />;
    if (activeView === '/image-editor') return <ImageEditorView />;
    if (activeView === '/logistica') return <LogisticsView key={logisticsData.length} user={user} initialData={logisticsData} onUpdate={handleLogisticsUpdate} />;
    if (activeView === '/publications') return <PublicationsView user={user} initialData={publicationsData} onUpdate={handlePublicationsUpdate} />;
    if (activeView === '/admin/users') return <UserManagementView />;
    if (activeView === '/admin/structure') return <StructureManagementView modules={appModules} onUpdate={handleStructureUpdate} />;
    if (activeView === '/settings') return <PlaceholderView title="Configurações" />;

    const allModules = [...appModules];
    let currentModule, currentSubFolder;

    for (const mod of allModules) {
        if (activeView.startsWith(mod.path)) {
            currentModule = mod;
            if (mod.subFolders) {
                currentSubFolder = mod.subFolders.find(sub => sub.path === activeView);
            }
            break;
        }
    }

    if (currentModule) {
        const moduleFileSystem = fileSystemData[currentSubFolder?.path || currentModule.path] || [];
        return <ModuleView 
            key={activeView} // IMPORTANT: Re-mounts component on navigation to reset state
            moduleName={currentModule.name} 
            subFolderName={currentSubFolder?.name} 
            user={user} 
            initialFileSystem={moduleFileSystem}
            onFileSystemUpdate={(newSlice) => handleFileSystemUpdate(currentSubFolder?.path || currentModule!.path, newSlice)}
            onPublishRequest={handlePublishRequest}
        />;
    }

    return <PlaceholderView title="Página não encontrada" />;
  }

  return (
    <div className="flex h-screen bg-frp-cinza-light text-frp-grafite">
      <Sidebar user={user} onNavigate={handleNavigate} activePath={activeView} onLogout={onLogout} modules={appModules} />
      <div className="flex flex-col flex-1">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 p-4 overflow-y-auto md:p-6 lg:p-8">
            {renderContent()}
        </main>
        <footer className="py-2 text-center text-xs text-frp-cinza-dark bg-white border-t border-frp-cinza">
            <a href="https://www.frpbrasil.com/" target="_blank" rel="noopener noreferrer" className="hover:text-frp-brasil">www.frpbrasil.com</a>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;