import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Shield, 
  Lock, 
  UserCheck, 
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const RoleAccessModule = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch role data from API
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/roles');
        const data = response.data;
        
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(r => ({
            roleName: r.RoleName || r.roleName || 'Unnamed Role',
            permissions: typeof r.Permissions === 'string'
              ? r.Permissions.split(',').map(p => p.trim())
              : (Array.isArray(r.permissions) ? r.permissions : (Array.isArray(r.Permissions) ? r.Permissions : []))
          }));
          setRoles(formatted);
          setError('');
        } else if (Array.isArray(data.roles)) {
          const formatted = data.roles.map(r => ({
            roleName: r.roleName || r.RoleName || 'Unnamed Role',
            permissions: Array.isArray(r.permissions) ? r.permissions : []
          }));
          setRoles(formatted);
          setError('');
        } else {
          throw new Error('No roles found in database');
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        setError('Failed to load roles. Using fallback data.');
        // Fallback data if API fails
        setRoles([
          { roleName: 'Admin', permissions: ['all_access', 'manage_users', 'view_reports', 'delete_salesman_user'] },
          { roleName: 'Manager', permissions: ['view_reports', 'approve_quotes', 'manage_leads'] },
          { roleName: 'Salesman', permissions: ['own_work_process', 'manage_own_leads', 'view_own_deals'] }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="p-4 space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Role Access Management
          </h2>
          <p className="text-slate-400 text-xs mt-1">Configure role-based permissions and access controls for system users.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Roles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span className="text-xs uppercase font-bold tracking-widest mt-2">Loading Roles...</span>
          </div>
        ) : roles.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-600 bg-slate-900/10 border border-slate-800/60 rounded-2xl border-dashed">
            <Lock className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <span className="text-xs uppercase font-bold tracking-wider">No roles configured.</span>
          </div>
        ) : (
          roles.map((role, index) => (
            <div key={index} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-purple-500/30 transition duration-150 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] pointer-events-none rounded-full"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition duration-150">{role.roleName}</h4>
                    <p className="text-xs text-slate-500">Access Level</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((perm, pIdx) => (
                    <span key={pIdx} className="px-2.5 py-1 bg-slate-800/60 border border-slate-700/50 rounded-md text-xs text-slate-300 font-medium">
                      {perm.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoleAccessModule;

