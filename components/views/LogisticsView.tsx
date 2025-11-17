import React, { useState, useMemo } from 'react';
import { LogisticsEntry, User } from '../../types';

interface LogisticsViewProps {
  user: User;
  initialData: LogisticsEntry[];
  onUpdate: (newData: LogisticsEntry[]) => void;
}

const LogisticsView: React.FC<LogisticsViewProps> = ({ user, initialData, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new-entrada' | 'new-saida' | 'edit'>('new-entrada');
  const [editingEntry, setEditingEntry] = useState<LogisticsEntry | null>(null);
  
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    notes: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'Todos' | 'Entrada' | 'Saída'>('Todos');

  const itemFilteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialData;
    }
    return initialData.filter(entry =>
      entry.item.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [initialData, searchQuery]);

  const { totalIn, totalOut } = useMemo(() => {
    return itemFilteredData.reduce((acc, entry) => {
      if (entry.type === 'Entrada') {
        acc.totalIn += entry.quantity;
      } else {
        acc.totalOut += entry.quantity;
      }
      return acc;
    }, { totalIn: 0, totalOut: 0 });
  }, [itemFilteredData]);

  const stock = totalIn - totalOut;
  
  const displayData = useMemo(() => {
    if (filterType === 'Todos') {
      return itemFilteredData;
    }
    return itemFilteredData.filter(entry => entry.type === filterType);
  }, [itemFilteredData, filterType]);


  const openNewModal = (type: 'Entrada' | 'Saída') => {
    setModalMode(type === 'Entrada' ? 'new-entrada' : 'new-saida');
    setEditingEntry(null);
    setFormData({ item: '', quantity: '', notes: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (entry: LogisticsEntry) => {
    setModalMode('edit');
    setEditingEntry(entry);
    setFormData({
        item: entry.item,
        quantity: String(entry.quantity),
        notes: entry.notes || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({ item: '', quantity: '', notes: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este lançamento?")) {
        onUpdate(initialData.filter(entry => entry.id !== id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'edit' && editingEntry) {
        const updatedEntry: LogisticsEntry = {
            ...editingEntry,
            item: formData.item,
            quantity: Number(formData.quantity),
            notes: formData.notes,
        };
        onUpdate(initialData.map(entry => entry.id === editingEntry.id ? updatedEntry : entry));
    } else {
        const newEntry: LogisticsEntry = {
            id: String(Date.now()),
            date: new Date().toISOString().split('T')[0],
            item: formData.item,
            type: modalMode === 'new-entrada' ? 'Entrada' : 'Saída',
            quantity: Number(formData.quantity),
            responsible: user.name,
            notes: formData.notes,
        };
        onUpdate([newEntry, ...initialData]);
    }
    closeModal();
  };

  const getModalTitle = () => {
    if (modalMode === 'edit') return 'Editar Lançamento';
    if (modalMode === 'new-entrada') return 'Registrar Entrada';
    return 'Registrar Saída';
  };
  
  const StatCard: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-frp-petroleo">Logística & Suprimentos</h1>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button onClick={() => openNewModal('Entrada')} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Nova Entrada</button>
          <button onClick={() => openNewModal('Saída')} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Nova Saída</button>
        </div>
      </div>
      
       <div className="mb-6 p-4 bg-gray-50 border rounded-lg">
        <label htmlFor="search-item" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar Dashboard por Item
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            id="search-item"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-frp-brasil focus:border-frp-brasil sm:text-sm"
            placeholder="Ex: Resina, Fibra de Vidro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title={`Total de Entradas ${searchQuery ? `(${searchQuery})` : ''}`} value={totalIn} color="text-green-600" />
        <StatCard title={`Total de Saídas ${searchQuery ? `(${searchQuery})` : ''}`} value={totalOut} color="text-red-600" />
        <StatCard title={`Estoque Atual ${searchQuery ? `(${searchQuery})` : ''}`} value={stock} color="text-frp-brasil" />
      </div>

      <div className="flex items-center space-x-2 mb-4">
        {(['Todos', 'Entrada', 'Saída'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filterType === type
                  ? 'bg-frp-brasil text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {type === 'Entrada' ? 'Entradas' : type === 'Saída' ? 'Saídas' : 'Todos'}
            </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th>
                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayData.length > 0 ? displayData.map(entry => (
                <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${entry.type === 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {entry.type}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.responsible}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.notes || '--'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => openEditModal(entry)} className="text-frp-brasil hover:text-frp-petroleo">Editar</button>
                        <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:text-red-800">Deletar</button>
                    </td>
                </tr>
              )) : (
                 <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                        Nenhum lançamento encontrado para os filtros aplicados.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold text-frp-petroleo mb-4">{getModalTitle()}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="item" className="block text-sm font-medium text-gray-700">Nome do Item</label>
                                <input type="text" name="item" id="item" value={formData.item} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-frp-brasil focus:ring-frp-brasil" />
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade</label>
                                <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-frp-brasil focus:ring-frp-brasil" />
                            </div>
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Observações (opcional)</label>
                                <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-frp-brasil focus:ring-frp-brasil"></textarea>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">Cancelar</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-frp-brasil rounded-md hover:bg-frp-petroleo">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default LogisticsView;