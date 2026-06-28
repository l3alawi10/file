import { useState, useEffect, useCallback } from 'react';
import { type Diploma, type DiplomaFormData, generateToken, generateDiplomaNumber } from '@/types/diploma';
import QRCode from 'qrcode';

const STORAGE_KEY = 'diploma_verify_pro_data';

const getStoredDiplomas = (): Diploma[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const storeDiplomas = (diplomas: Diploma[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diplomas));
};

export const useDiplomaStore = () => {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDiplomas(getStoredDiplomas());
    setLoading(false);
  }, []);

  const createDiploma = useCallback(async (formData: DiplomaFormData): Promise<Diploma> => {
    const token = generateToken();
    const numero = generateDiplomaNumber();
    const verificationUrl = `${window.location.origin}/verify/${token}`;

    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    });

    const newDiploma: Diploma = {
      id: crypto.randomUUID(),
      token_verification: token,
      nom_etudiant: formData.nom_etudiant,
      numero_diplome: numero,
      formation: formData.formation,
      date_obtention: formData.date_obtention,
      statut: formData.statut,
      date_creation: new Date().toISOString(),
      cree_par: formData.cree_par,
      qrCodeDataUrl,
    };

    setDiplomas(prev => {
      const updated = [newDiploma, ...prev];
      storeDiplomas(updated);
      return updated;
    });

    return newDiploma;
  }, []);

  const updateDiploma = useCallback((id: string, updates: Partial<DiplomaFormData>): void => {
    setDiplomas(prev => {
      const updated = prev.map(d =>
        d.id === id
          ? { ...d, ...updates, date_creation: d.date_creation }
          : d
      );
      storeDiplomas(updated);
      return updated;
    });
  }, []);

  const revokeDiploma = useCallback((id: string): void => {
    setDiplomas(prev => {
      const updated = prev.map(d =>
        d.id === id ? { ...d, statut: 'revoque' as const } : d
      );
      storeDiplomas(updated);
      return updated;
    });
  }, []);

  const deleteDiploma = useCallback((id: string): void => {
    setDiplomas(prev => {
      const updated = prev.filter(d => d.id !== id);
      storeDiplomas(updated);
      return updated;
    });
  }, []);

  const getDiplomaByToken = useCallback((token: string): Diploma | undefined => {
    return diplomas.find(d => d.token_verification === token);
  }, [diplomas]);

  const getDiplomaById = useCallback((id: string): Diploma | undefined => {
    return diplomas.find(d => d.id === id);
  }, [diplomas]);

  const regenerateQRCode = useCallback(async (id: string): Promise<string> => {
    const diploma = diplomas.find(d => d.id === id);
    if (!diploma) throw new Error('Diploma not found');

    const verificationUrl = `${window.location.origin}/verify/${diploma.token_verification}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    });

    setDiplomas(prev => {
      const updated = prev.map(d =>
        d.id === id ? { ...d, qrCodeDataUrl } : d
      );
      storeDiplomas(updated);
      return updated;
    });

    return qrCodeDataUrl;
  }, [diplomas]);

  return {
    diplomas,
    loading,
    createDiploma,
    updateDiploma,
    revokeDiploma,
    deleteDiploma,
    getDiplomaByToken,
    getDiplomaById,
    regenerateQRCode,
  };
};
