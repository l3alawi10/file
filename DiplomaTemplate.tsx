import { forwardRef } from 'react';
import { type Diploma } from '@/types/diploma';

interface DiplomaTemplateProps {
  diploma: Diploma;
  size?: 'preview' | 'full';
}

const DiplomaTemplate = forwardRef<HTMLDivElement, DiplomaTemplateProps>(
  ({ diploma, size = 'full' }, ref) => {
    const isPreview = size === 'preview';

    return (
      <div
        ref={ref}
        className={`diploma-certificate relative bg-white overflow-hidden ${
          isPreview ? 'w-[600px] min-h-[420px]' : 'w-[800px] min-h-[550px]'
        }`}
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          boxShadow: '0 0 30px rgba(0,0,0,0.15)',
        }}
      >
        {/* Outer Border */}
        <div className="absolute inset-3 border-4 border-slate-800 pointer-events-none" />
        {/* Inner Border */}
        <div className="absolute inset-5 border-2 border-slate-600 pointer-events-none" />

        {/* Corner Ornaments */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-amber-500 pointer-events-none" />
        <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-amber-500 pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-amber-500 pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-amber-500 pointer-events-none" />

        {/* Content */}
        <div className={`relative z-10 flex flex-col items-center justify-center text-center ${
          isPreview ? 'p-10 pt-12' : 'p-14 pt-16'
        }`}>
          {/* Header */}
          <div className="mb-2">
            <div className={`text-amber-600 font-bold tracking-widest uppercase ${
              isPreview ? 'text-xs' : 'text-sm'
            }`}>
              Republique Francaise
            </div>
            <div className="w-32 h-0.5 bg-amber-500 mx-auto mt-1" />
          </div>

          {/* Title */}
          <h1 className={`text-slate-800 font-bold uppercase tracking-wide mt-4 ${
            isPreview ? 'text-3xl' : 'text-5xl'
          }`}
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Certificat
          </h1>
          <h2 className={`text-slate-600 font-medium uppercase tracking-widest mt-1 ${
            isPreview ? 'text-base' : 'text-xl'
          }`}>
            de Reussite
          </h2>

          <div className={`w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent my-4 ${
            isPreview ? 'my-3' : 'my-5'
          }`} />

          {/* Subtitle */}
          <p className={`text-slate-500 italic ${isPreview ? 'text-sm' : 'text-base'}`}>
            Decerne officiellement a
          </p>

          {/* Student Name */}
          <div className={`mt-3 mb-2 ${isPreview ? 'mt-2 mb-1' : 'mt-4 mb-3'}`}>
            <span
              className={`text-red-600 font-bold border-b-2 border-red-500 inline-block pb-1 ${
                isPreview ? 'text-2xl' : 'text-4xl'
              }`}
              style={{ fontFamily: "'Brush Script MT', 'Georgia', cursive" }}
            >
              {diploma.nom_etudiant}
            </span>
          </div>

          {/* Details */}
          <p className={`text-slate-600 mt-3 ${isPreview ? 'text-sm mt-2' : 'text-lg mt-4'}`}>
            Pour avoir complete avec succes la formation :
          </p>
          <p className={`text-slate-800 font-bold mt-1 ${isPreview ? 'text-base' : 'text-xl'}`}>
            {diploma.formation}
          </p>

          {/* Date & Number */}
          <div className={`mt-6 text-slate-500 ${isPreview ? 'mt-4 text-xs' : 'mt-8 text-sm'}`}>
            <p>Fait le : <span className="text-slate-700 font-medium">{diploma.date_obtention}</span></p>
            <p className="mt-1">Numero officiel : <span className="text-slate-700 font-medium font-mono">{diploma.numero_diplome}</span></p>
          </div>

          {/* QR Code Section */}
          <div className={`absolute bottom-10 right-10 text-center ${isPreview ? 'bottom-8 right-8' : 'bottom-12 right-12'}`}>
            <img
              src={diploma.qrCodeDataUrl}
              alt="QR Code verification"
              className={`border-2 border-slate-300 bg-white ${
                isPreview ? 'w-20 h-20 p-1' : 'w-28 h-28 p-2'
              }`}
            />
            <p className={`text-slate-400 mt-1 max-w-[120px] leading-tight ${
              isPreview ? 'text-[8px]' : 'text-[10px]'
            }`}>
              Scannez ce QR Code pour verifier l'authenticite de ce diplome.
            </p>
          </div>

          {/* Signature Section */}
          <div className={`absolute bottom-10 left-10 text-center ${isPreview ? 'bottom-8 left-8' : 'bottom-12 left-12'}`}>
            <div className={`border-b border-slate-400 mb-1 ${isPreview ? 'w-24' : 'w-32'}`} />
            <p className={`text-slate-500 ${isPreview ? 'text-[10px]' : 'text-xs'}`}>Le Directeur</p>
          </div>
        </div>
      </div>
    );
  }
);

DiplomaTemplate.displayName = 'DiplomaTemplate';
export default DiplomaTemplate;
