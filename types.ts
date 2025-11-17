// FIX: Add React import to resolve 'Cannot find namespace React' error.
import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin Master' | 'Sub Gerente' | 'Colaborador';
  avatar: string;
}

export enum FileType {
  Folder,
  Pdf,
  Docx,
  Xlsx,
  Jpg,
  Png,
  Zip,
  Link,
}

export interface DocumentItem {
  id: string;
  name: string;
  type: FileType;
  modified: string;
  modifiedBy: string;
  size?: string;
  url?: string;
  children?: DocumentItem[];
  status?: 'Rascunho' | 'Publicado';
  publicLink?: string;
}

export interface SubFolder {
    id: string;
    name: string;
    path: string;
}

export interface Module {
    id: string;
    name: string;
    icon: React.ReactNode;
    subFolders: SubFolder[];
    adminOnly: boolean;
    path: string;
}

export interface LogisticsEntry {
  id: string;
  date: string;
  item: string;
  type: 'Entrada' | 'Saída';
  quantity: number;
  responsible: string;
  notes?: string;
}