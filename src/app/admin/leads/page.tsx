'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AdminAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Download, LogOut, Loader2, Trash2 } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'converted';
  createdAt: string;
}

type LeadStatus = Lead['status'];

export default function LeadsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<LeadStatus>('new');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string>('');

  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/leads', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'new':
        return 'default';
      case 'contacted':
        return 'secondary';
      case 'converted':
        return 'outline';
      default:
        return 'default';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Created At'];
    const csvData = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.status,
      formatDate(lead.createdAt),
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const openLeadModal = (lead: Lead) => {
    setSelectedLead(lead);
    setStatusDraft(lead.status);
    setStatusUpdateError('');
    setIsLeadModalOpen(true);
  };

  const closeLeadModal = () => {
    setIsLeadModalOpen(false);
  };

  const updateLeadStatus = async () => {
    if (!selectedLead) return;

    setIsUpdatingStatus(true);
    setStatusUpdateError('');

    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id: selectedLead.id, status: statusDraft }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to update status');
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLead.id ? { ...lead, status: statusDraft } : lead
        )
      );
      setSelectedLead((prev) => (prev ? { ...prev, status: statusDraft } : prev));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update status';
      setStatusUpdateError(message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const openDeleteConfirm = (lead: Lead) => {
    setDeleteTarget(lead);
    setDeleteError('');
    setIsDeleteConfirmOpen(true);
  };

  const deleteLead = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError('');

    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/leads', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id: deleteTarget.id }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to delete lead');
      }

      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));

      if (selectedLead?.id === deleteTarget.id) {
        setIsLeadModalOpen(false);
        setSelectedLead(null);
      }

      setIsDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete lead';
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Dialog
        open={isDeleteConfirmOpen}
        onOpenChange={(open) => {
          setIsDeleteConfirmOpen(open);
          if (!open) {
            setDeleteTarget(null);
            setDeleteError('');
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Delete lead</DialogTitle>
            <DialogDescription>
              This will permanently delete the lead record.
            </DialogDescription>
          </DialogHeader>

          {deleteTarget ? (
            <div className="grid gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>{' '}
                <span className="font-medium">{deleteTarget.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{' '}
                <span className="font-medium">{deleteTarget.email}</span>
              </div>
              {deleteError ? (
                <div className="text-destructive">{deleteError}</div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteLead}
              disabled={isDeleting || !deleteTarget}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isLeadModalOpen}
        onOpenChange={(open) => {
          setIsLeadModalOpen(open);
          if (!open) {
            setSelectedLead(null);
            setStatusUpdateError('');
          }
        }}
      >
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Lead details</DialogTitle>
            <DialogDescription>
              {selectedLead ? `Submitted ${formatDate(selectedLead.createdAt)}` : ' '}
            </DialogDescription>
          </DialogHeader>

          {selectedLead ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{selectedLead.name || '-'}</div>
              </div>

              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Email</div>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {selectedLead.email || '-'}
                </a>
              </div>

              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium">{selectedLead.phone || '-'}</div>
              </div>

              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Company</div>
                <div className="font-medium">{selectedLead.company || '-'}</div>
              </div>

              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="flex items-center gap-3">
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value as LeadStatus)}
                    className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isUpdatingStatus}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                  <Badge variant={getStatusVariant(statusDraft)} className="uppercase text-xs">
                    {statusDraft}
                  </Badge>
                </div>

                {statusUpdateError ? (
                  <div className="text-sm text-destructive">{statusUpdateError}</div>
                ) : null}
              </div>
            </div>
          ) : null}

          <DialogFooter>
            {selectedLead ? (
              <Button
                variant="destructive"
                onClick={() => openDeleteConfirm(selectedLead)}
                disabled={isUpdatingStatus}
              >
                Delete
              </Button>
            ) : null}
            {selectedLead ? (
              <Button
                onClick={updateLeadStatus}
                disabled={isUpdatingStatus || !selectedLead || statusDraft === selectedLead.status}
              >
                {isUpdatingStatus ? 'Saving…' : 'Save status'}
              </Button>
            ) : null}
            {selectedLead?.email ? (
              <Button asChild>
                <a href={`mailto:${selectedLead.email}`}>Email</a>
              </Button>
            ) : null}
            <Button variant="outline" onClick={closeLeadModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-card">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-black tracking-widest text-primary">COHORT</Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-semibold">Leads Dashboard</h1>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: leads.length, delay: 0.1 },
            { label: 'New', value: leads.filter(l => l.status === 'new').length, delay: 0.2 },
            { label: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, delay: 0.3 },
            { label: 'Converted', value: leads.filter(l => l.status === 'converted').length, delay: 0.4 },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
            >
              <Card className="bg-gradient-to-br from-secondary/80 to-secondary/40 border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-extrabold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary border-white/10"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
          <Button onClick={exportToCSV} className="gap-2 bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-white/10">
            <CardContent className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No leads found</h3>
              <p className="text-muted-foreground">Leads will appear here when users submit the brochure form.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="border-white/10 hover:bg-primary/5 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={() => openLeadModal(lead)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLeadModal(lead);
                      }
                    }}
                  >
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.email}
                      </a>
                    </TableCell>
                    <TableCell>{lead.phone || '-'}</TableCell>
                    <TableCell>{lead.company || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(lead.status)} className="uppercase text-xs">
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(lead.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirm(lead);
                        }}
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </main>
    </div>
  );
}
