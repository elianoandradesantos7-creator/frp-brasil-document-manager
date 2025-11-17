import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DocumentItem, FileType } from '../../types';
import { getIconForFileType } from '../../constants';
import { User } from '../../types';

interface ModuleViewProps {
  moduleName: string;
  subFolderName?: string;
  user: User;
  initialFileSystem: DocumentItem[];
  onFileSystemUpdate: (newFileSystem: DocumentItem[]) => void;
  onPublishRequest: (item: DocumentItem) => void;
}

const AddItemModal: React.FC<{
    type: 'folder' | 'link' | 'file';
    onClose: () => void;
    onSave: (name: string, url?: string) => void;
}> = ({ type, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    const getTitle = () => {
        if (type === 'folder') return 'Criar Nova Pasta';
        if (type === 'link') return 'Adicionar Novo Link';
        return 'Enviar Arquivo';
    };

    const handleSave = () => {
        if (name) {
            onSave(name, url);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-frp-petroleo mb-4">{getTitle()}</h2>
                <div className="space-y-4">
                    {type !== 'file' && (
                        <div>
                            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Nome</label>
                            <input type="text" id="itemName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-frp-brasil focus:ring-frp-brasil" autoFocus />
                        </div>
                    )}
                    {type === 'link' && (
                        <div>
                            <label htmlFor="itemUrl" className="block text-sm font-medium text-gray-700">URL</label>
                            <input type="url" id="itemUrl" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://exemplo.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-frp-brasil focus:ring-frp-brasil" />
                        </div>
                    )}
                    {type === 'file' && (
                        <div>
                             <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Selecione o arquivo</label>
                             <input type="file" id="fileUpload" onChange={(e) => setName(e.target.files?.[0]?.name || '')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-frp-brasil file:text-white hover:file:bg-frp-petroleo"/>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">Cancelar</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-frp-brasil rounded-md hover:bg-frp-petroleo">Salvar</button>
                </div>
            </div>
        </div>
    );
};

const Toast: React.FC<{ message: string }> = ({ message }) => (
    <div className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
        {message}
    </div>
);


const ModuleView: React.FC<ModuleViewProps> = ({ moduleName, subFolderName, user, initialFileSystem, onFileSystemUpdate, onPublishRequest }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [path, setPath] = useState<DocumentItem[]>([]);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DocumentItem | null>(null);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [addItemType, setAddItemType] = useState<'folder' | 'link' | 'file' | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const currentFolderContents = useMemo(() => {
    let currentLevel = initialFileSystem;
    for (const folder of path) {
        const found = currentLevel.find(item => item.id === folder.id);
        currentLevel = found?.children || [];
    }
    return currentLevel;
  }, [initialFileSystem, path]);
  
  // FIX: This effect synchronizes the internal path state with the external file system prop.
  // When an item is edited, the initialFileSystem prop changes, but the 'path' state held old
  // object references. This ensures the path is rebuilt with fresh references from the new prop,
  // preventing navigation from breaking after an edit.
  useEffect(() => {
    if (path.length > 0) {
      const refreshedPath: DocumentItem[] = [];
      let currentLevel = initialFileSystem;
      
      for (const pathItem of path) {
        const foundItem = currentLevel.find(item => item.id === pathItem.id);
        if (foundItem && foundItem.type === FileType.Folder) {
          refreshedPath.push(foundItem);
          currentLevel = foundItem.children || [];
        } else {
          // A folder in the path no longer exists or is not a folder, so stop.
          setPath(refreshedPath);
          return;
        }
      }
    }
  }, [initialFileSystem]);


  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
        setNotification(null);
    }, 3000);
  };

  const findParentFolder = (docs: DocumentItem[], itemPath: DocumentItem[]): DocumentItem[] | null => {
      let currentLevel = docs;
      for (let i = 0; i < itemPath.length; i++) {
        const folderInPath = itemPath[i];
        const found = currentLevel.find(item => item.id === folderInPath.id);
        if (found && found.type === FileType.Folder) {
            currentLevel = found.children!;
        } else {
            return null; // Path is invalid
        }
      }
      return currentLevel;
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openEditModal = (item: DocumentItem) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setIsEditModalOpen(false);
  };

  const handleSaveItem = () => {
    if (editingItem) {
        const newFileSystem = JSON.parse(JSON.stringify(initialFileSystem));
        const parentPath = path.slice(0, path.length - (editingItem.type === FileType.Folder ? 1 : 0));
        const parentFolder = findParentFolder(newFileSystem, path);

        if (parentFolder) {
            const itemIndex = parentFolder.findIndex(item => item.id === editingItem.id);
            if (itemIndex > -1) {
                const originalItem = parentFolder[itemIndex];
                parentFolder[itemIndex] = { 
                    ...originalItem, // Preserve original properties like 'children'
                    name: editingItem.name, 
                    modified: new Date().toISOString().split('T')[0],
                    modifiedBy: user.name,
                };
                onFileSystemUpdate(newFileSystem);
                closeEditModal();
                showNotification('Item atualizado com sucesso!');
            }
        }
    }
  };
  
  const handleDeleteItem = (itemId: string) => {
    if (window.confirm("Tem certeza que deseja deletar este item? A ação não pode ser desfeita.")) {
        const newFileSystem = JSON.parse(JSON.stringify(initialFileSystem));
        const parentFolder = findParentFolder(newFileSystem, path);
        if (parentFolder) {
            const itemIndex = parentFolder.findIndex(item => item.id === itemId);
            if (itemIndex > -1) {
                parentFolder.splice(itemIndex, 1);
                onFileSystemUpdate(newFileSystem);
                showNotification('Item deletado com sucesso!');
            }
        }
    }
    setOpenMenuId(null);
  };
  
  const openAddItemModal = (type: 'folder' | 'link' | 'file') => {
    setAddItemType(type);
    setIsAddItemModalOpen(true);
  };

  const handleAddItem = (name: string, url?: string) => {
    if (!addItemType) return;
    
    const fileTypeMap = {
        'folder': FileType.Folder,
        'link': FileType.Link,
        'file': name.endsWith('.pdf') ? FileType.Pdf : name.endsWith('.docx') ? FileType.Docx : name.endsWith('.xlsx') ? FileType.Xlsx : name.endsWith('.zip') ? FileType.Zip : name.endsWith('.png') ? FileType.Png : FileType.Jpg
    };

    const newItem: DocumentItem = {
        id: Date.now().toString(),
        name,
        type: fileTypeMap[addItemType],
        modified: new Date().toISOString().split('T')[0],
        modifiedBy: user.name,
        url: url,
        size: addItemType === 'file' ? `${(Math.random() * 5).toFixed(1)} MB` : undefined,
        children: addItemType === 'folder' ? [] : undefined,
    };
    
    const newFileSystem = JSON.parse(JSON.stringify(initialFileSystem));
    const parentFolder = findParentFolder(newFileSystem, path);
    if(parentFolder) {
        parentFolder.unshift(newItem); // Add to the top
        onFileSystemUpdate(newFileSystem);
    } else if (path.length === 0) {
        onFileSystemUpdate([newItem, ...initialFileSystem]);
    }
    
    setIsAddItemModalOpen(false);
    setAddItemType(null);
    showNotification(addItemType === 'folder' ? 'Pasta criada com sucesso!' : 'Item adicionado com sucesso!');
  };

  const handleNavigate = (item: DocumentItem) => {
    if (item.type === FileType.Folder) {
        setPath([...path, item]);
    } else if (item.type === FileType.Link && item.url) {
        window.open(item.url, '_blank');
    } else {
        // Placeholder for file opening logic
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setPath(path.slice(0, index));
  };
  
  const Breadcrumbs = () => (
    <nav className="flex items-center text-sm text-gray-500 mb-4 flex-wrap">
        <a href="#" onClick={(e) => { e.preventDefault(); handleBreadcrumbClick(0); }} className="hover:text-frp-brasil">
            {moduleName}{subFolderName && ` / ${subFolderName}`}
        </a>
        {path.map((folder, index) => (
            <React.Fragment key={folder.id}>
                <span className="mx-2">/</span>
                <a href="#" onClick={(e) => { e.preventDefault(); handleBreadcrumbClick(index + 1); }} className="hover:text-frp-brasil truncate">
                    {folder.name}
                </a>
            </React.Fragment>
        ))}
    </nav>
  );

  const ActionMenu = ({ item }: { item: DocumentItem }) => (
    <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
        <a href="#" onClick={(e) => { e.preventDefault(); openEditModal(item); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Renomear</a>
        {item.type !== FileType.Folder && item.type !== FileType.Link && (
             <a href="#" onClick={(e) => { e.preventDefault(); onPublishRequest(item); setOpenMenuId(null); showNotification('Enviado para Publicações!'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Publicar</a>
        )}
        <div className="border-t my-1"></div>
        <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteItem(item.id); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Deletar</a>
    </div>
  );

  const renderItem = (item: DocumentItem) => {
    const itemSize = item.type === FileType.Folder ? `${item.children?.length || 0} itens` : item.size || 'Link';

    if (viewMode === 'grid') {
      return (
        <div key={item.id} onDoubleClick={() => handleNavigate(item)} className="relative group flex flex-col items-center p-4 text-center bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-16 h-16 text-frp-brasil mb-2">{getIconForFileType(item.type)}</div>
          <p className="font-semibold text-sm break-words w-full">{item.name}</p>
          <p className="text-xs text-gray-500 mt-1">{itemSize}</p>
          <div className="absolute top-2 right-2">
            <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === item.id ? null : item.id); }} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            {openMenuId === item.id && <ActionMenu item={item} />}
          </div>
        </div>
      );
    } else {
      return (
        <tr key={item.id} onDoubleClick={() => handleNavigate(item)} className="hover:bg-gray-50 border-b cursor-pointer">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-4 text-frp-brasil">{getIconForFileType(item.type)}</div>
              <span className="font-medium text-gray-800">{item.name}</span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.modifiedBy}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.modified}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{itemSize}</td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
             <div className="relative">
                <button onClick={(e) => {e.stopPropagation(); setOpenMenuId(openMenuId === item.id ? null : item.id)}} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-frp-petroleo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
                {openMenuId === item.id && <ActionMenu item={item} />}
             </div>
          </td>
        </tr>
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <h1 className="text-3xl font-bold text-frp-petroleo truncate">
            {moduleName}
            {subFolderName && <span className="text-frp-brasil"> / {subFolderName}</span>}
        </h1>
        <div className="flex items-center space-x-2 mt-4 md:mt-0 flex-wrap">
          <button onClick={() => openAddItemModal('link')} className="px-4 py-2 text-sm font-medium text-frp-brasil border border-frp-brasil rounded-md hover:bg-frp-brasil hover:text-white transition-colors">Adicionar Link</button>
          <button onClick={() => openAddItemModal('folder')} className="px-4 py-2 text-sm font-medium text-white bg-frp-brasil rounded-md hover:bg-frp-petroleo">Nova Pasta</button>
          <button onClick={() => openAddItemModal('file')} className="px-4 py-2 text-sm font-medium text-white bg-frp-brasil rounded-md hover:bg-frp-petroleo">Enviar Arquivo</button>
          <div className="p-1 bg-gray-200 rounded-lg">
            <button onClick={() => setViewMode('grid')} className={`px-2 py-1 rounded-md ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button onClick={() => setViewMode('list')} className={`px-2 py-1 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </div>
      <Breadcrumbs />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {currentFolderContents.map(renderItem)}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modificado por</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modificado em</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamanho</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentFolderContents.map(renderItem)}
            </tbody>
          </table>
        </div>
      )}
      
      {isAddItemModalOpen && addItemType && <AddItemModal type={addItemType} onClose={() => setIsAddItemModalOpen(false)} onSave={handleAddItem} />}

      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-frp-petroleo mb-4">Renomear Item</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Nome do item</label>
                        <input 
                            type="text" 
                            name="itemName" 
                            id="itemName" 
                            value={editingItem.name} 
                            onChange={(e) => setEditingItem(prev => prev ? {...prev, name: e.target.value} : null)} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-frp-brasil focus:ring-frp-brasil" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={closeEditModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">Cancelar</button>
                    <button type="button" onClick={handleSaveItem} className="px-4 py-2 text-sm font-medium text-white bg-frp-brasil rounded-md hover:bg-frp-petroleo">Salvar Alterações</button>
                </div>
            </div>
        </div>
       )}
       {notification && <Toast message={notification} />}
    </div>
  );
};

export default ModuleView;