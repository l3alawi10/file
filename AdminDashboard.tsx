import { useState, useRef } from 'react';
import {
  Search, Plus, Download, Trash2, Eye, QrCode, X, ChevronLeft, ChevronRight,
  GraduationCap, FileText, Shield, Award, AlertTriangle, CheckCircle, XCircle, Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { type Diploma, type DiplomaFormData, type DiplomaStatus, getStatusLabelColor, getStatusText } from '@/types/diploma';
import { useDiplomaStore } from '@/hooks/useDiplomaStore';
import DiplomaTemplate from './DiplomaTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AdminDashboard = () => {
  const {
    diplomas, createDiploma, revokeDiploma, deleteDiploma, regenerateQRCode
  } = useDiplomaStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDiploma, setSelectedDiploma] = useState<Diploma | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [diplomaToDelete, setDiplomaToDelete] = useState<string | null>(null);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [diplomaToRevoke, setDiplomaToRevoke] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const diplomaRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<DiplomaFormData>({
    nom_etudiant: '',
    formation: '',
    date_obtention: new Date().toISOString().split('T')[0],
    statut: 'valide',
    cree_par: 'Admin',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof DiplomaFormData, string>>>({});

  const itemsPerPage = 6;

  const filteredDiplomas = diplomas.filter(d => {
    const matchesSearch =
      d.nom_etudiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.numero_diplome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.formation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDiplomas.length / itemsPerPage);
  const paginatedDiplomas = filteredDiplomas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: diplomas.length,
    valide: diplomas.filter(d => d.statut === 'valide').length,
    revoque: diplomas.filter(d => d.statut === 'revoque').length,
    expire: diplomas.filter(d => d.statut === 'expire').length,
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof DiplomaFormData, string>> = {};
    if (!formData.nom_etudiant.trim()) errors.nom_etudiant = 'Student name is required';
    if (!formData.formation.trim()) errors.formation = 'Formation is required';
    if (!formData.date_obtention) errors.date_obtention = 'Date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateDiploma = async () => {
    if (!validateForm()) return;
    setCreating(true);
    try {
      await createDiploma(formData);
      setFormData({
        nom_etudiant: '',
        formation: '',
        date_obtention: new Date().toISOString().split('T')[0],
        statut: 'valide',
        cree_par: 'Admin',
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleExportPDF = async (diploma: Diploma) => {
    if (!diplomaRef.current) return;
    try {
      const canvas = await html2canvas(diplomaRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${diploma.numero_diplome}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  };

  const openPreview = (diploma: Diploma) => {
    setSelectedDiploma(diploma);
  };

  const confirmDelete = (id: string) => {
    setDiplomaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (diplomaToDelete) {
      deleteDiploma(diplomaToDelete);
      setDeleteDialogOpen(false);
      setDiplomaToDelete(null);
    }
  };

  const confirmRevoke = (id: string) => {
    setDiplomaToRevoke(id);
    setRevokeDialogOpen(true);
  };

  const handleRevoke = () => {
    if (diplomaToRevoke) {
      revokeDiploma(diplomaToRevoke);
      setRevokeDialogOpen(false);
      setDiplomaToRevoke(null);
    }
  };

  const handleRegenerateQR = async (id: string) => {
    try {
      await regenerateQRCode(id);
    } catch (err) {
      console.error('QR regeneration failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">DiplomaVerify Pro</h1>
              <p className="text-xs text-slate-500">Secure Certificate Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>System Secure</span>
            </div>
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600">A</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Diplomas</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-slate-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Valid</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.valide}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Revoked</p>
                <p className="text-2xl font-bold text-red-600">{stats.revoque}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Expired</p>
                <p className="text-2xl font-bold text-amber-600">{stats.expire}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, number, formation..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="valide">Valid</SelectItem>
                <SelectItem value="revoque">Revoked</SelectItem>
                <SelectItem value="expire">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-slate-800 hover:bg-slate-700">
            <Plus className="w-4 h-4 mr-2" /> Create Diploma
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-6 border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Create New Diploma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Student Name *</Label>
                  <Input
                    id="nom"
                    value={formData.nom_etudiant}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom_etudiant: e.target.value }))}
                    placeholder="Jean Dupont"
                    className={formErrors.nom_etudiant ? 'border-red-300' : ''}
                  />
                  {formErrors.nom_etudiant && <p className="text-xs text-red-500 mt-1">{formErrors.nom_etudiant}</p>}
                </div>
                <div>
                  <Label htmlFor="formation">Formation *</Label>
                  <Input
                    id="formation"
                    value={formData.formation}
                    onChange={(e) => setFormData(prev => ({ ...prev, formation: e.target.value }))}
                    placeholder="Master Informatique"
                    className={formErrors.formation ? 'border-red-300' : ''}
                  />
                  {formErrors.formation && <p className="text-xs text-red-500 mt-1">{formErrors.formation}</p>}
                </div>
                <div>
                  <Label htmlFor="date">Date of Completion *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date_obtention}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_obtention: e.target.value }))}
                    className={formErrors.date_obtention ? 'border-red-300' : ''}
                  />
                  {formErrors.date_obtention && <p className="text-xs text-red-500 mt-1">{formErrors.date_obtention}</p>}
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, statut: v as DiplomaStatus }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valide">Valid</SelectItem>
                      <SelectItem value="revoque">Revoked</SelectItem>
                      <SelectItem value="expire">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 mt-4 justify-end">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleCreateDiploma} disabled={creating} className="bg-emerald-600 hover:bg-emerald-700">
                  {creating ? 'Creating...' : 'Create Diploma'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diplomas Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Diploma Registry</CardTitle>
          </CardHeader>
          <CardContent>
            {paginatedDiplomas.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No diplomas found</p>
                <p className="text-sm">Create your first diploma to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Formation</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Number</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDiplomas.map((diploma) => (
                      <tr key={diploma.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                              {diploma.nom_etudiant.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-800">{diploma.nom_etudiant}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{diploma.formation}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-slate-500">{diploma.numero_diplome}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-500">{diploma.date_obtention}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusLabelColor(diploma.statut)}`}>
                            {getStatusText(diploma.statut)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openPreview(diploma)}>
                                  <Eye className="w-4 h-4 text-slate-500" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>Diploma Preview</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col items-center gap-4 py-4">
                                  {selectedDiploma && (
                                    <DiplomaTemplate diploma={selectedDiploma} ref={diplomaRef} size="full" />
                                  )}
                                  <div className="flex gap-3">
                                    <Button onClick={() => selectedDiploma && handleExportPDF(selectedDiploma)} variant="outline">
                                      <Download className="w-4 h-4 mr-2" /> Export PDF
                                    </Button>
                                    <DialogClose asChild>
                                      <Button variant="outline">Close</Button>
                                    </DialogClose>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRegenerateQR(diploma.id)}>
                              <QrCode className="w-4 h-4 text-slate-500" />
                            </Button>

                            {diploma.statut === 'valide' && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmRevoke(diploma.id)}>
                                <Edit3 className="w-4 h-4 text-amber-500" />
                              </Button>
                            )}

                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(diploma.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDiplomas.length)} of {filteredDiplomas.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="flex items-center px-3 text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification URL Info */}
        <Card className="mt-6 bg-slate-800 text-white border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-400 mb-2">Verification System</h3>
                <p className="text-sm text-slate-300 mb-3">
                  Each diploma has a unique QR code linking to the verification page.
                  When scanned, the system validates the token against the database and displays
                  the official status in real-time.
                </p>
                <div className="bg-slate-900 rounded p-3 font-mono text-xs text-emerald-400">
                  {window.location.origin}/verify/&#123;TOKEN&#125;
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Diploma</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The diploma will be permanently removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Diploma</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the diploma as revoked. The verification page will show "Revoked" status.
              The diploma holder will be notified upon next verification scan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevoke} className="bg-amber-600 hover:bg-amber-700">
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
