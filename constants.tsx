import React from 'react';
import { User, Module, DocumentItem, FileType, LogisticsEntry } from './types';
import { FileIcon, FolderIcon, LinkIcon, PdfIcon, PngIcon, XlsxIcon, ZipIcon, DocxIcon, JpgIcon } from './components/ui/FileIcon';

// Icons
export const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
export const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7c2.76 0 5-2.24 5-5H7c0 2.76 2.24 5 5 5z"/><path d="M17 12h3V9h-3v3zM4 12h3V9H4v3z"/><path d="M20 15.34c0 .84-.33 1.63-.92 2.22l-1.42 1.42c-.6.6-1.39.92-2.22.92H8.58c-.83 0-1.62-.32-2.22-.92L4.94 17.56c-.59-.59-.92-1.38-.92-2.22V12h16v3.34z"/></svg>;
export const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>;
export const ProjectsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
export const DocsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
export const MarketingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
export const FinanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
export const QualityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
export const LogisticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
export const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
export const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
export const SSTIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>;
export const ComercialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
export const JuridicoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 14-7.5 7.5"/><path d="m18 10 3.5 3.5"/><path d="M2 6c.3.3.3 1.2 0 1.5-.3.3-1.2.3-1.5 0-.3-.3-.3-1.2 0-1.5.3-.3 1.2-.3 1.5 0Z"/><path d="m15 3 6 6"/><path d="m8 8 6 6"/><path d="m21.5 11.5-1.5 1.5"/><path d="m12.5 2.5 1.5-1.5"/><path d="M3 21l6-6"/><path d="m8.5 8.5 7-7"/></svg>;
export const OperacionalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;


export const mockUsers: User[] = [
  { id: '1', name: 'Admin Master', email: 'admin@frpbrasil.com', role: 'Admin Master', avatar: 'https://i.pravatar.cc/150?u=admin@frpbrasil.com' },
  { id: '2', name: 'Carlos Silva', email: 'carlos.silva@frpbrasil.com', role: 'Sub Gerente', avatar: 'https://i.pravatar.cc/150?u=carlos.silva@frpbrasil.com' },
  { id: '3', name: 'Ana Pereira', email: 'ana.pereira@frpbrasil.com', role: 'Colaborador', avatar: 'https://i.pravatar.cc/150?u=ana.pereira@frpbrasil.com' },
  { id: '4', name: 'Contato FRP', email: 'contato@frpbrasil.com', role: 'Colaborador', avatar: 'https://i.pravatar.cc/150?u=contato@frpbrasil.com' },
];

export const initialModules: Module[] = [
  {
    id: 'admin-geral',
    name: 'Administração Geral',
    icon: <AdminIcon />,
    subFolders: [],
    adminOnly: true,
    path: '/admin-geral',
  },
  {
    id: 'projetos-engenharia',
    name: 'Projetos & Engenharia',
    icon: <ProjectsIcon />,
    subFolders: [
        { id: 'proj-ativos', name: 'Projetos Ativos', path: '/projetos-engenharia/ativos' },
        { id: 'proj-concluidos', name: 'Projetos Concluídos', path: '/projetos-engenharia/concluidos' },
    ],
    adminOnly: false,
    path: '/projetos-engenharia',
  },
  {
    id: 'operacional',
    name: 'Operacional',
    icon: <OperacionalIcon />,
    subFolders: [],
    adminOnly: false,
    path: '/operacional',
  },
  {
    id: 'comercial',
    name: 'Comercial',
    icon: <ComercialIcon />,
    subFolders: [],
    adminOnly: false,
    path: '/comercial',
  },
  {
    id: 'documentos',
    name: 'Documentos',
    icon: <DocsIcon />,
    subFolders: [],
    adminOnly: false,
    path: '/documentos',
  },
   {
    id: 'rh',
    name: 'Recursos Humanos',
    icon: <UsersIcon />,
    subFolders: [],
    adminOnly: false,
    path: '/rh',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: <MarketingIcon />,
    subFolders: [],
    adminOnly: false,
    path: '/marketing',
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    icon: <FinanceIcon />,
    subFolders: [],
    adminOnly: true,
    path: '/financeiro',
  },
  {
    id: 'sst',
    name: 'Segurança do Trabalho (SST)',
    icon: <SSTIcon />,
    subFolders: [],
    adminOnly: false,
    path: '/sst',
  },
  {
    id: 'qualidade',
    name: 'Qualidade',
    icon: <QualityIcon />,
    subFolders: [],
    adminOnly: false,
    path: '/qualidade',
  },
  {
    id: 'juridico',
    name: 'Jurídico',
    icon: <JuridicoIcon />,
    subFolders: [],
    adminOnly: true,
    path: '/juridico',
  },
  {
    id: 'logistica',
    name: 'Logística e Suprimentos',
    icon: <LogisticsIcon />,
    subFolders: [],
    adminOnly: false,
    path: '/logistica',
  },
  {
    id: 'image-editor',
    name: 'Editor de Imagem IA',
    icon: <ImageIcon />,
    subFolders: [],
    adminOnly: false,
    path: '/image-editor',
  },
  {
    id: 'publications',
    name: 'Publicações',
    icon: <GlobeIcon />,
    subFolders: [],
    adminOnly: false,
    path: '/publications',
  },
];

export const adminModules: Module[] = [
    { 
        id: 'admin-users', 
        name: 'Gerenciar Usuários', 
        icon: <UsersIcon />, 
        subFolders: [], 
        adminOnly: true,
        path: '/admin/users' 
    },
    { 
        id: 'admin-structure', 
        name: 'Gerenciar Estrutura', 
        icon: <AdminIcon />, 
        subFolders: [], 
        adminOnly: true,
        path: '/admin/structure'
    }
];

export const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
export const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

export const availableIcons: { [key: string]: React.ReactNode } = {
  'Projetos': <ProjectsIcon />,
  'Documentos': <DocsIcon />,
  'RH': <UsersIcon />,
  'Marketing': <MarketingIcon />,
  'Financeiro': <FinanceIcon />,
  'Qualidade': <QualityIcon />,
  'Logística': <LogisticsIcon />,
  'Imagens': <ImageIcon />,
  'Publicações': <GlobeIcon />,
  'Segurança': <SSTIcon />,
  'Comercial': <ComercialIcon />,
  'Jurídico': <JuridicoIcon />,
  'Operacional': <OperacionalIcon />,
  'Admin': <AdminIcon />,
};

export const getIconForFileType = (type: FileType) => {
  switch (type) {
    case FileType.Folder: return <FolderIcon />;
    case FileType.Pdf: return <PdfIcon />;
    case FileType.Docx: return <DocxIcon />;
    case FileType.Xlsx: return <XlsxIcon />;
    case FileType.Jpg: return <JpgIcon />;
    case FileType.Png: return <PngIcon />;
    case FileType.Zip: return <ZipIcon />;
    case FileType.Link: return <LinkIcon />;
    default: return <FileIcon />;
  }
};

const commonDocs: DocumentItem[] = [
    { id: 'doc-1', name: 'Manual do Colaborador.pdf', type: FileType.Pdf, modified: '2024-01-15', modifiedBy: 'Admin Master', size: '1.2 MB', children: undefined },
    { id: 'doc-2', name: 'Política de Férias.docx', type: FileType.Docx, modified: '2024-03-20', modifiedBy: 'Admin Master', size: '340 KB', children: undefined },
];

export const mockModuleFileSystem: { [key: string]: DocumentItem[] } = {
    '/projetos-engenharia/ativos': [
        { id: 'proj-a-1', name: 'Projeto Alpha', type: FileType.Folder, modified: '2024-05-20', modifiedBy: 'Carlos Silva', children: [
            { id: 'proj-a-1-1', name: 'Cronograma.xlsx', type: FileType.Xlsx, modified: '2024-05-20', modifiedBy: 'Carlos Silva', size: '88 KB' },
            { id: 'proj-a-1-2', name: 'Apresentação Kick-off.pdf', type: FileType.Pdf, modified: '2024-04-10', modifiedBy: 'Carlos Silva', size: '2.3 MB' },
        ]},
        { id: 'proj-a-2', name: 'Desenvolvimento Beta', type: FileType.Folder, modified: '2024-05-18', modifiedBy: 'Ana Pereira', children: []},
    ],
    '/projetos-engenharia/concluidos': [
        { id: 'proj-c-1', name: 'Implantação ERP', type: FileType.Folder, modified: '2023-12-10', modifiedBy: 'Admin Master', children: [] },
    ],
    '/documentos': commonDocs,
    '/rh': commonDocs,
    '/marketing': [
        { id: 'mkt-1', name: 'Campanha Q2 2024', type: FileType.Folder, modified: '2024-04-01', modifiedBy: 'Ana Pereira', children: [
            { id: 'mkt-1-1', name: 'Logo Principal.png', type: FileType.Png, modified: '2024-04-02', modifiedBy: 'Ana Pereira', size: '450 KB' },
            { id: 'mkt-1-2', name: 'Guia de Marca.pdf', type: FileType.Pdf, modified: '2024-04-05', modifiedBy: 'Ana Pereira', size: '3.1 MB' },
        ]},
    ],
    '/financeiro': [
         { id: 'fin-1', name: 'Relatórios Mensais', type: FileType.Folder, modified: '2024-05-01', modifiedBy: 'Admin Master', children: [] },
    ],
    '/qualidade': [],
    '/admin-geral': [],
    '/sst': [],
    '/comercial': [],
    '/juridico': [],
    '/operacional': [],
};

export const mockLogisticsData: LogisticsEntry[] = [
    { id: '1', date: '2024-05-20', item: 'Resina Poliéster', type: 'Entrada', quantity: 50, responsible: 'Carlos Silva', notes: 'Fornecedor XYZ' },
    { id: '2', date: '2024-05-21', item: 'Fibra de Vidro (m²)', type: 'Entrada', quantity: 200, responsible: 'Carlos Silva' },
    { id: '3', date: '2024-05-22', item: 'Resina Poliéster', type: 'Saída', quantity: 10, responsible: 'Ana Pereira', notes: 'Produção Lote A' },
    { id: '4', date: '2024-05-23', item: 'Catalisador MEK', type: 'Entrada', quantity: 10, responsible: 'Carlos Silva' },
];

export const mockPublicationsData: DocumentItem[] = [
  {
    id: 'pub-1',
    name: 'Apresentação Institucional.pdf',
    type: FileType.Pdf,
    modified: '2024-05-10',
    modifiedBy: 'Carlos Silva',
    size: '2.1 MB',
    status: 'Rascunho',
  },
  {
    id: 'pub-2',
    name: 'Relatório Anual 2023.docx',
    type: FileType.Docx,
    modified: '2024-05-09',
    modifiedBy: 'Admin Master',
    size: '850 KB',
    status: 'Publicado',
    publicLink: 'https://www.frpbrasil.com/public/doc-rel-2023'
  },
];