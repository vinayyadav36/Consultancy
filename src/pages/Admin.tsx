import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateAdminNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ admin_notes: notes })
        .eq('id', id);

      if (error) throw error;
      fetchInquiries();
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const sendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  if (loading) {
    return <div className="container py-20">Loading...</div>;
  }

  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
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
              value={inquiry.admin_notes || ''}
              onChange={(e) => updateAdminNotes(inquiry.id, e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
              rows={3}
            />
            
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