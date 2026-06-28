import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Shield, CheckCircle, XCircle, AlertTriangle, ArrowLeft,
  GraduationCap, Calendar, Hash, BookOpen, ShieldCheck, Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type Diploma, getStatusText } from '@/types/diploma';

const VerificationPage = () => {
  const { token } = useParams<{ token: string }>();
  const [diploma, setDiploma] = useState<Diploma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyTime, setVerifyTime] = useState<string>('');

  useEffect(() => {
    setVerifyTime(new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }));

    if (!token) {
      setError('Invalid verification link');
      setLoading(false);
      return;
    }

    // Simulate server lookup with a small delay
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('diploma_verify_pro_data');
        if (!stored) {
          setError('Document not found or invalid link');
          setLoading(false);
          return;
        }

        const diplomas: Diploma[] = JSON.parse(stored);
        const found = diplomas.find(d => d.token_verification === token);

        if (!found) {
          setError('Document not found or invalid link');
          setLoading(false);
          return;
        }

        setDiploma(found);
        setLoading(false);
      } catch {
        setError('Verification system error');
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-500">Verifying diploma authenticity...</p>
        </div>
      </div>
    );
  }

  if (error || !diploma) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Verification Failed</h2>
            <p className="text-slate-500 mb-6">{error || 'Document not found'}</p>
            <p className="text-xs text-slate-400 mb-6">
              The QR code scanned may be invalid, expired, or the diploma may have been removed from our system.
            </p>
            <Link to="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isValid = diploma.statut === 'valide';
  const isRevoked = diploma.statut === 'revoque';

  const statusConfig = {
    valide: {
      icon: CheckCircle,
      title: 'Diploma Valid',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      message: 'This diploma has been verified successfully through the official verification system.',
    },
    revoque: {
      icon: XCircle,
      title: 'Diploma Revoked',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      message: 'This diploma has been revoked by the issuing institution. It is no longer valid.',
    },
    expire: {
      icon: AlertTriangle,
      title: 'Diploma Expired',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      message: 'This diploma has expired. Please contact the issuing institution for more information.',
    },
  };

  const status = statusConfig[diploma.statut];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-semibold text-slate-700">DiplomaVerify Pro</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Official Verification</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Status Banner */}
        <Card className={`mb-6 ${status.borderColor} ${status.bgColor}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${status.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <StatusIcon className={`w-7 h-7 ${status.color}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${status.color}`}>{status.title}</h1>
                <p className="text-slate-600 text-sm mt-1">{status.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diploma Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-500" />
              Diploma Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Student Name</p>
                  <p className="text-lg font-semibold text-slate-800">{diploma.nom_etudiant}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Formation</p>
                  <p className="text-base font-medium text-slate-800">{diploma.formation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Hash className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Diploma Number</p>
                    <p className="text-sm font-mono text-slate-700">{diploma.numero_diplome}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Date of Completion</p>
                    <p className="text-sm text-slate-700">{diploma.date_obtention}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Shield className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Current Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isValid ? 'bg-emerald-100 text-emerald-700' :
                    isRevoked ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {getStatusText(diploma.statut)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Reference */}
        <Card className="mb-6">
          <CardContent className="p-6 flex items-center gap-4">
            <img
              src={diploma.qrCodeDataUrl}
              alt="Verification QR Code"
              className="w-24 h-24 border-2 border-slate-200 rounded p-1"
            />
            <div>
              <p className="text-sm text-slate-600">
                This QR code was scanned to verify this diploma. The verification token is securely
                stored in our database and cannot be forged.
              </p>
              <p className="text-xs text-slate-400 mt-1 font-mono break-all">
                Token: {diploma.token_verification}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verification Metadata */}
        <Card className="bg-slate-100 border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-400" />
            <p className="text-xs text-slate-500">
              Verified on {verifyTime} &bull; This verification was performed securely via the official verification portal.
            </p>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secured with 256-bit token encryption</span>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
