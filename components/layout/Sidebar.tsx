import React, { useState } from 'react';
import { User, Module as ModuleType } from '../../types';
import { adminModules, DashboardIcon, SettingsIcon, LogoutIcon } from '../../constants';

interface SidebarProps {
  user: User;
  onNavigate: (path: string) => void;
  activePath: string;
  onLogout: () => void;
  modules: ModuleType[];
}

const Sidebar: React.FC<SidebarProps> = ({ user, onNavigate, activePath, onLogout, modules }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>({});

  const isAdmin = user.role === 'Admin Master';
  const visibleModules = modules.filter(m => isAdmin || !m.adminOnly);

  const handleModuleClick = (path: string) => {
    setOpenModules(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const NavLink: React.FC<{ path: string; icon: React.ReactNode; label: string; isSubLink?: boolean; }> = ({ path, icon, label, isSubLink = false }) => {
    const isActive = activePath === path;
    const baseClasses = `flex items-center p-2 text-base font-normal rounded-lg hover:bg-frp-brasil hover:text-white transition-colors duration-200`;
    const activeClasses = `bg-frp-brasil text-white`;
    const inactiveClasses = `text-gray-200`;
    const sublinkClasses = isSubLink ? 'pl-11' : '';

    return (
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onNavigate(path); }}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${sublinkClasses}`}
      >
        {!isSubLink && <span className="w-6 h-6">{icon}</span>}
        <span className={`ml-3 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
      </a>
    );
  };
  
  const ModuleLink: React.FC<{ module: Omit<ModuleType, 'id'> }> = ({ module }) => {
    const hasSubFolders = module.subFolders && module.subFolders.length > 0;
    const isOpen = openModules[module.path];
    const isParentActive = activePath.startsWith(module.path);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const isCurrentlyOpen = !!openModules[module.path];

        if (hasSubFolders) {
            // Always toggle the open/closed state
            handleModuleClick(module.path);
            
            // If we are OPENING the module, navigate to its first sub-folder.
            // This provides immediate feedback to the user.
            if (!isCurrentlyOpen) {
                onNavigate(module.subFolders[0].path);
            }
        } else {
            onNavigate(module.path);
        }
    };
    
    return (
        <li>
            <a
              href="#"
              onClick={handleClick}
              className={`flex items-center justify-between p-2 text-base font-normal rounded-lg hover:bg-frp-brasil hover:text-white transition-colors duration-200 ${isParentActive ? 'bg-frp-brasil/50 text-white' : 'text-gray-200'}`}
            >
              <div className="flex items-center">
                <span className="w-6 h-6">{module.icon}</span>
                <span className={`ml-3 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{module.name}</span>
              </div>
              {hasSubFolders && isSidebarOpen && (
                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              )}
            </a>
            {hasSubFolders && isOpen && isSidebarOpen && (
                <ul className="py-2 space-y-2">
                    {module.subFolders.map(sub => (
                        <li key={sub.path}>
                            <NavLink path={sub.path} icon={<span></span>} label={sub.name} isSubLink />
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
  };

  return (
    <>
      <div className={`flex flex-col h-full bg-frp-petroleo text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-frp-brasil">
          <img src="https://www.frpbrasil.com/wp-content/uploads/2023/10/logo-frp-brasil-branca-1.png" alt="Logo" className={`transition-opacity duration-200 ${isSidebarOpen ? 'w-32' : 'w-0 opacity-0'}`} />
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white rounded-md hover:bg-frp-brasil">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
                <li><NavLink path="/dashboard" icon={<DashboardIcon />} label="Dashboard" /></li>
                <li className="pt-4 pb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase"><span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Módulos</span></li>
                {visibleModules.map((mod) => (
                    <ModuleLink key={mod.path} module={mod} />
                ))}
                {isAdmin && (
                    <>
                        <li className="pt-4 pb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase"><span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Admin</span></li>
                        {adminModules.map((mod) => (
                           <ModuleLink key={mod.path} module={mod} />
                        ))}
                    </>
                )}
            </ul>
        </div>
        <div className="p-4 border-t border-frp-brasil">
            <ul className="space-y-2">
                <li><NavLink path="/settings" icon={<SettingsIcon />} label="Configurações" /></li>
                <li>
                     <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="flex items-center p-2 text-base font-normal text-gray-200 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200">
                        <span className="w-6 h-6"><LogoutIcon /></span>
                        <span className={`ml-3 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Sair</span>
                    </a>
                </li>
            </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;