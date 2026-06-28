export type DiplomaStatus = 'valide' | 'revoque' | 'expire';

export interface Diploma {
  id: string;
  token_verification: string;
  nom_etudiant: string;
  numero_diplome: string;
  formation: string;
  date_obtention: string;
  statut: DiplomaStatus;
  date_creation: string;
  cree_par: string;
  qrCodeDataUrl: string;
}

export interface DiplomaFormData {
  nom_etudiant: string;
  formation: string;
  date_obtention: string;
  statut: DiplomaStatus;
  cree_par: string;
}

export const generateToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export const generateDiplomaNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}-ESGI-${random}`;
};

export const getStatusColor = (statut: DiplomaStatus): string => {
  switch (statut) {
    case 'valide':
      return 'bg-emerald-500';
    case 'revoque':
      return 'bg-red-500';
    case 'expire':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusText = (statut: DiplomaStatus): string => {
  switch (statut) {
    case 'valide':
      return 'Valide';
    case 'revoque':
      return 'Revoke';
    case 'expire':
      return 'Expire';
    default:
      return statut;
  }
};

export const getStatusLabelColor = (statut: DiplomaStatus): string => {
  switch (statut) {
    case 'valide':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'revoque':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'expire':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};
