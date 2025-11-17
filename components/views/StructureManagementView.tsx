import React, { useState } from 'react';
import { Module } from '../../types';
import { availableIcons } from '../../constants';

interface StructureManagementViewProps {
    modules: Module[];
    onUpdate: (newModules: Module[]) => void;
}

const IconPicker: React.FC<{ selected: React.ReactNode; onSelect: (icon: React.ReactNode, iconKey: string) => void; }> = ({ selected, onSelect }) => {
    // This is a simplified way to compare React nodes. Not foolproof but works for this case.
    const selectedKey = Object.keys(availableIcons).find(key => String(availableIcons[key].type) === String(selected?.type));

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ícone do Módulo</label>
            <div className="grid grid-cols-6 gap-2 p-2 border rounded-md">
                {Object.entries(availableIcons).map(([key, icon]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onSelect(icon, key)}
                        className={`p-2 rounded-md flex items-center justify-center ${selectedKey === key ? 'bg-frp-brasil text-white ring-2 ring-frp-petroleo' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        title={key}
                    >
                        <span className="w-6 h-6">{icon}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}


const StructureManagementView: React.FC<StructureManagementViewProps> = ({ modules, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Partial<Module> & { iconKey?: string } | null>(null);

    const openModal = (module?: Module) => {
        if (module) {
            const iconKey = Object.keys(availableIcons).find(key => String(availableIcons[key].type) === String(module.icon.type));
            setEditingModule({ ...module, iconKey });
        } else {
            setEditingModule({ name: '', adminOnly: false, icon: Object.values(availableIcons)[0], iconKey: Object.keys(availableIcons)[0] });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingModule(null);
        setIsModalOpen(false);
    };

    const handleSave = () => {
        if (!editingModule || !editingModule.name) return;

        let newModules;
        if (editingModule.id) { // Editing existing
            newModules = modules.map(m => m.id === editingModule.id ? { ...m, ...editingModule, icon: availableIcons[editingModule.iconKey!] } as Module : m);
        } else { // Creating new
            const newModule: Module = {
                id: editingModule.name!.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'e'),
                name: editingModule.name!,
                icon: availableIcons[editingModule.iconKey!],
                adminOnly: editingModule.adminOnly || false,
                path: `/${editingModule.name!.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'e')}`,
                subFolders: []
            };
            newModules = [...modules, newModule];
        }
        onUpdate(newModules);
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja deletar este módulo? A ação não pode ser desfeita.")) {
            onUpdate(modules.filter(m => m.id !== id));
        }
    };
    
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-frp-petroleo">Gerenciar Estrutura de Módulos</h1>
                <button onClick={() => openModal()} className="px-4 py-2 text-sm font-medium text-white bg-frp-brasil rounded-md hover:bg-frp-petroleo">
                    Criar Módulo
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Módulo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acesso</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {modules.map(mod => (
                            <tr key={mod.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 mr-4 text-frp-brasil">{mod.icon}</span>
                                        <div className="text-sm font-medium text-gray-900">{mod.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mod.adminOnly ? 'Apenas Admin' : 'Todos'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => openModal(mod)} className="text-frp-brasil hover:text-frp-petroleo">Editar</button>
                                    <button onClick={() => handleDelete(mod.id)} className="text-red-600 hover:text-red-800">Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingModule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold text-frp-petroleo mb-4">{editingModule.id ? 'Editar Módulo' : 'Criar Novo Módulo'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Módulo</label>
                                <input type="text" name="name" id="name" value={editingModule.name} onChange={e => setEditingModule({ ...editingModule, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-frp-brasil focus:ring-frp-brasil" />
                            </div>
                            <IconPicker
                                selected={availableIcons[editingModule.iconKey!]}
                                onSelect={(icon, iconKey) => setEditingModule({ ...editingModule, icon, iconKey })}
                            />
                            <div className="flex items-center">
                                <input id="adminOnly" name="adminOnly" type="checkbox" checked={editingModule.adminOnly} onChange={e => setEditingModule({ ...editingModule, adminOnly: e.target.checked })} className="h-4 w-4 text-frp-brasil focus:ring-frp-brasil border-gray-300 rounded" />
                                <label htmlFor="adminOnly" className="ml-2 block text-sm text-gray-900">Visível apenas para Administradores</label>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">Cancelar</button>
                            <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-frp-brasil rounded-md hover:bg-frp-petroleo">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default StructureManagementView;