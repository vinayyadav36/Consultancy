import { useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
}

const Admin = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [notesDrafts, setNotesDrafts] = useState<Record<string, string>>({});
  const [savingNoteForId, setSavingNoteForId] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured. Admin dashboard is unavailable.');
      setLoading(false);
      return;
    }

    try {
      setErrorMessage('');
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const safeData = data || [];
      setInquiries(safeData);
      setNotesDrafts(
        safeData.reduce<Record<string, string>>((acc, inquiry) => {
          acc[inquiry.id] = inquiry.admin_notes || '';
          return acc;
        }, {})
      );
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setErrorMessage('Unable to load inquiries. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInquiries();
  }, [fetchInquiries]);

  const updateInquiryStatus = async (id: string, status: string) => {
    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured.');
      return;
    }

    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
      setErrorMessage('Unable to update inquiry status.');
    }
  };

  const updateAdminNotes = async (id: string) => {
    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured.');
      return;
    }

    const notes = notesDrafts[id] || '';

    try {
      setSavingNoteForId(id);
      const { error } = await supabase
        .from('inquiries')
        .update({ admin_notes: notes })
        .eq('id', id);

      if (error) throw error;
      await fetchInquiries();
    } catch (error) {
      console.error('Error updating notes:', error);
      setErrorMessage('Unable to save admin notes.');
    } finally {
      setSavingNoteForId(null);
    }
  };

  const sendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  if (loading) {
    return <div className="container py-20">Loading...</div>;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="container py-20">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-yellow-400">
          Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable admin features.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-yellow-300">
          {errorMessage}
        </div>
      )}

      {inquiries.length === 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-gray-300">
          No inquiries found yet.
        </div>
      )}
      
      <div className="grid gap-6">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="bg-gray-900 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{inquiry.name}</h3>
                <p className="text-gray-400">{inquiry.email}</p>
              </div>
              <button
                onClick={() => sendEmail(inquiry.email)}
                className="btn btn-primary"
              >
                Reply via Email
              </button>
            </div>
            
            <p className="mb-4">{inquiry.message}</p>
            
            <div className="flex gap-4 mb-4">
              <select
                value={inquiry.status}
                onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                className="bg-gray-800 rounded-lg px-4 py-2"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <span className={`px-3 py-1 rounded-full text-sm ${
                inquiry.status === 'new' ? 'bg-yellow-500/20 text-yellow-500' :
                inquiry.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' :
                'bg-green-500/20 text-green-500'
              }`}>
                {inquiry.status.replace('_', ' ')}
              </span>
            </div>
            
            <textarea
              placeholder="Admin notes..."
              value={notesDrafts[inquiry.id] || ''}
              onChange={(e) =>
                setNotesDrafts((prev) => ({
                  ...prev,
                  [inquiry.id]: e.target.value,
                }))
              }
              className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
              rows={3}
            />

            <div className="mt-3 flex justify-end">
              <button
                onClick={() => updateAdminNotes(inquiry.id)}
                disabled={savingNoteForId === inquiry.id}
                className="btn btn-primary disabled:opacity-60"
              >
                {savingNoteForId === inquiry.id ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
            
            <div className="text-sm text-gray-400 mt-4">
              Received: {new Date(inquiry.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;