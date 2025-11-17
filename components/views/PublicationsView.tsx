import React, { useState } from 'react';
import { DocumentItem, User } from '../../types';
import { getIconForFileType } from '../../constants';

interface PublicationsViewProps {
  user: User;
  initialData: DocumentItem[];
  onUpdate: (newData: DocumentItem[]) => void;
}

const Toast: React.FC<{ message: string }> = ({ message }) => (
    <div className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
        {message}
    </div>
);

const PublishModal: React.FC<{
    item: DocumentItem;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ item, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-frp-petroleo mb-4">Confirmar Publicação</h2>
            <p className="text-gray-600 mb-2">Você está prestes a tornar o documento <span className="font-semibold">{item.name}</span> acessível publicamente através de um link.</p>
            <p className="text-gray-600 mb-6">Esta ação pode ser desfeita posteriormente.</p>
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">Cancelar</button>
                <button type="button" onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-frp-brasil rounded-md hover:bg-frp-petroleo">Publicar Agora</button>
            </div>
        </div>
    </div>
);

const PublicationsView: React.FC<PublicationsViewProps> = ({ user, initialData, onUpdate }) => {
    const [notification, setNotification] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToPublish, setItemToPublish] = useState<DocumentItem | null>(null);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleOpenPublishModal = (item: DocumentItem) => {
        setItemToPublish(item);
        setIsModalOpen(true);
    };

    const handleConfirmPublish = () => {
        if (!itemToPublish) return;
        const publicLink = `https://www.frpbrasil.com/public/${itemToPublish.id}-${itemToPublish.name.split('.')[0].toLowerCase().replace(/\s/g, '-')}`;
        
        const updatedData = initialData.map(item =>
            item.id === itemToPublish.id
                ? { ...item, status: 'Publicado' as const, publicLink }
                : item
        );
        onUpdate(updatedData);
        setIsModalOpen(false);
        setItemToPublish(null);
        showNotification('Documento publicado com sucesso!');
    };
    
    const handleUnpublish = (id: string) => {
        const updatedData = initialData.map(item =>
            item.id === id
                ? { ...item, status: 'Rascunho' as const, publicLink: undefined }
                : item
        );
        onUpdate(updatedData);
        showNotification('Publicação desfeita.');
    };

    const handleRemove = (id: string) => {
        if (window.confirm("Isso removerá o item da lista de publicações, mas não o excluirá do sistema. Deseja continuar?")) {
            onUpdate(initialData.filter(item => item.id !== id));
            showNotification('Item removido da lista de publicações.');
        }
    };
    
    const copyToClipboard = (link: string) => {
        navigator.clipboard.writeText(link).then(() => {
            showNotification('Link copiado para a área de transferência!');
        }, (err) => {
            console.error('Could not copy text: ', err);
            showNotification('Erro ao copiar link.');
        });
    };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-frp-petroleo">Publicações</h1>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Arquivo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link Público</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {initialData.length > 0 ? initialData.map(item => (
                <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="w-6 h-6 mr-4 text-frp-brasil flex-shrink-0">{getIconForFileType(item.type)}</div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Publicado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {item.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.publicLink ? (
                            <a href={item.publicLink} target="_blank" rel="noopener noreferrer" className="text-frp-brasil hover:underline hover:text-frp-petroleo truncate">{item.publicLink}</a>
                        ) : '--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {item.status === 'Rascunho' && (
                            <button onClick={() => handleOpenPublishModal(item)} className="text-frp-brasil hover:text-frp-petroleo">Publicar</button>
                        )}
                        {item.status === 'Publicado' && item.publicLink && (
                           <>
                            <button onClick={() => copyToClipboard(item.publicLink!)} className="text-frp-brasil hover:text-frp-petroleo">Copiar Link</button>
                            <button onClick={() => handleUnpublish(item.id)} className="text-yellow-600 hover:text-yellow-800">Desfazer</button>
                           </>
                        )}
                        <button onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-800">Remover</button>
                    </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                        Nenhum documento na área de publicações. <br/>
                        Para adicionar, vá para um módulo de arquivos e use a opção "Publicar".
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isModalOpen && itemToPublish && <PublishModal item={itemToPublish} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmPublish} />}
        {notification && <Toast message={notification} />}
    </div>
  );
};

export default PublicationsView;
