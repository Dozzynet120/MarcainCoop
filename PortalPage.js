import React, { useState, useEffect } from 'react';
import {
  getApplications,
  getStats,
  updateStatus,
  getCurrentUser,
  logout,
  isAuthenticated,
  hasRole
} from '../services/api';
import {
  initSocket,
  joinAdminRoom,
  leaveAdminRoom,
  onNewApplication,
  onStatusUpdate,
  offNewApplication,
  offStatusUpdate
} from '../services/socket';

const colors = {
  primary: '#1a0a3e',
  primaryLight: '#2d1b5e',
  accent: '#d4a843',
  white: '#ffffff',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8'
};

const statusColors = {
  'Submitted': colors.warning,
  'Under Staff Verification': colors.info,
  'Verified by Staff': colors.info,
  'Reviewed by Secretary': colors.info,
  'Awaiting Chairman Approval': colors.accent,
  'Approved': colors.success,
  'Declined': colors.danger,
  'Active': colors.success,
  'Suspended': colors.warning
};

function PortalPage({ setPage }) {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ totalApplications: 0, pending: 0, forApproval: 0, approved: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notification, setNotification] = useState(null);
  const user = getCurrentUser();

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const result = await getApplications(params);
      if (result.success) {
        setApplications(result.data);
      }
    } catch (err) {
      setError(err.message);
      if (err.message.includes('token') || err.message.includes('Unauthorized')) {
        logout();
        setPage('login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const result = await getStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  // Initial load
  useEffect(() => {
    if (!isAuthenticated()) {
      setPage('login');
      return;
    }
    fetchApplications();
    fetchStats();
  }, []);

  // Socket.io real-time updates
  useEffect(() => {
    if (!isAuthenticated()) return;

    initSocket();
    joinAdminRoom();

    const handleNewApp = (data) => {
      setNotification({
        type: 'new',
        message: `New application from ${data.name} (${data.ref})`
      });
      fetchApplications();
      fetchStats();
      setTimeout(() => setNotification(null), 5000);
    };

    const handleStatusUpdate = (data) => {
      setNotification({
        type: 'update',
        message: `Application ${data.ref} updated to ${data.newStatus}`
      });
      fetchApplications();
      fetchStats();
      setTimeout(() => setNotification(null), 5000);
    };

    onNewApplication(handleNewApp);
    onStatusUpdate(handleStatusUpdate);

    return () => {
      offNewApplication(handleNewApp);
      offStatusUpdate(handleStatusUpdate);
      leaveAdminRoom();
    };
  }, []);

  // Handle status update
  const handleStatusChange = async () => {
    if (!selectedApp || !newStatus) return;

    setUpdatingStatus(true);
    try {
      await updateStatus(selectedApp._id, newStatus, statusNote);
      setShowDetailModal(false);
      setNewStatus('');
      setStatusNote('');
      fetchApplications();
      fetchStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Get available next statuses based on role and current status
  const getAvailableStatuses = (currentStatus) => {
    const role = user?.role;
    const flows = {
      'Cooperative Staff': {
        'Submitted': ['Under Staff Verification']
      },
      'Secretary': {
        'Under Staff Verification': ['Verified by Staff']
      },
      'Chairman': {
        'Reviewed by Secretary': ['Awaiting Chairman Approval'],
        'Awaiting Chairman Approval': ['Approved', 'Declined']
      },
      'Admin': {
        'Submitted': ['Under Staff Verification', 'Declined'],
        'Under Staff Verification': ['Verified by Staff', 'Declined'],
        'Verified by Staff': ['Reviewed by Secretary', 'Declined'],
        'Reviewed by Secretary': ['Awaiting Chairman Approval', 'Declined'],
        'Awaiting Chairman Approval': ['Approved', 'Declined']
      }
    };

    return flows[role]?.[currentStatus] || [];
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    setPage('login');
  };

  if (!isAuthenticated()) {
    setPage('login');
    return null;
  }

  return (
    <div className="portal-dashboard">
      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: notification.type === 'new' ? '#d4edda' : '#e7f3ff',
          color: notification.type === 'new' ? '#155724' : '#004085',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease',
          maxWidth: '350px'
        }}>
          <strong>{notification.type === 'new' ? 'New Application!' : 'Status Updated'}</strong>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>{notification.message}</p>
        </div>
      )}

      {/* Sidebar */}
      <div className="portal-sidebar">
        <div className="portal-brand">
          <img src="/Marcainlogo.png" alt="MARCAIN" className="portal-sidebar-logo-img" />
          <span>MARCAIN Portal</span>
        </div>
        <div className="portal-role">{user?.role}</div>
        <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#d4a843' }}>{user?.name}</p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.7rem', color: '#888' }}>{user?.email}</p>
        </div>
        <nav className="portal-nav">
          <button onClick={() => setActiveTab('applications')} className={activeTab === 'applications' ? 'active' : ''}>
            Applications
          </button>
          <button onClick={() => setActiveTab('stats')} className={activeTab === 'stats' ? 'active' : ''}>
            Statistics
          </button>
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>
            Profile
          </button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="portal-content">
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {error}
            <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h2 className="portal-title">
              {user?.role === 'Cooperative Staff' ? 'Staff Verification Dashboard' :
               user?.role === 'Secretary' ? 'Secretary Review Dashboard' :
               user?.role === 'Chairman' ? 'Chairman Approval Dashboard' :
               'All Applications'}
            </h2>

            {/* Stats Bar */}
            <div className="stats-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-box" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 700, color: colors.primary }}>{stats.totalApplications || 0}</div>
                <div className="stat-name" style={{ fontSize: '0.8rem', color: '#666' }}>Total Applications</div>
              </div>
              <div className="stat-box" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 700, color: colors.warning }}>{stats.pending || 0}</div>
                <div className="stat-name" style={{ fontSize: '0.8rem', color: '#666' }}>Pending</div>
              </div>
              <div className="stat-box" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 700, color: colors.accent }}>{stats.forApproval || 0}</div>
                <div className="stat-name" style={{ fontSize: '0.8rem', color: '#666' }}>For Approval</div>
              </div>
              <div className="stat-box" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 700, color: colors.success }}>{stats.approved || 0}</div>
                <div className="stat-name" style={{ fontSize: '0.8rem', color: '#666' }}>Approved</div>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Search by name, ref, phone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && fetchApplications()}
                style={{ flex: 1, padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '6px' }}
              />
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); fetchApplications(); }}
                style={{ padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '6px' }}
              >
                <option value="">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Staff Verification">Under Staff Verification</option>
                <option value="Verified by Staff">Verified by Staff</option>
                <option value="Reviewed by Secretary">Reviewed by Secretary</option>
                <option value="Awaiting Chairman Approval">Awaiting Chairman Approval</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
              </select>
              <button
                onClick={fetchApplications}
                style={{ padding: '0.6rem 1.2rem', background: colors.primary, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Search
              </button>
            </div>

            {/* Table */}
            <div className="table-card" style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading applications...</div>
              ) : (
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: colors.primary, color: '#fff' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem' }}>Ref</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem' }}>Name</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem' }}>Phone</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem' }}>Date</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                          No applications found
                        </td>
                      </tr>
                    ) : (
                      applications.map(app => (
                        <tr key={app._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                            <strong>{app.applicationRef}</strong>
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                            {app.surname} {app.firstName}
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{app.phone}</td>
                          <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              background: (statusColors[app.status] || '#888') + '20',
                              color: statusColors[app.status] || '#888',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              {app.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <button
                              onClick={() => { setSelectedApp(app); setShowDetailModal(true); }}
                              style={{
                                padding: '0.4rem 0.8rem',
                                background: colors.primary,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                              }}
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="portal-title">Dashboard Statistics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: colors.primary, fontSize: '0.9rem' }}>Total Applications</h3>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: colors.primary }}>{stats.totalApplications}</p>
              </div>
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: colors.warning, fontSize: '0.9rem' }}>Pending Review</h3>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: colors.warning }}>{stats.pending}</p>
              </div>
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: colors.success, fontSize: '0.9rem' }}>Approved</h3>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: colors.success }}>{stats.approved}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-card" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 className="portal-title">My Profile</h2>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: colors.primary,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <h3 style={{ margin: '0 0 0.25rem 0' }}>{user?.name}</h3>
            <p style={{ margin: '0 0 1rem 0', color: colors.accent, fontWeight: 600 }}>{user?.role}</p>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#888' }}>Email</span>
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#888' }}>Role</span>
                <span>{user?.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: '#888' }}>Last Login</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApp && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: colors.primary }}>Application Details</h3>
              <button onClick={() => setShowDetailModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div><strong>Reference:</strong> {selectedApp.applicationRef}</div>
              <div><strong>Status:</strong>
                <span style={{
                  background: (statusColors[selectedApp.status] || '#888') + '20',
                  color: statusColors[selectedApp.status] || '#888',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  marginLeft: '0.5rem'
                }}>{selectedApp.status}</span>
              </div>
              <div><strong>Name:</strong> {selectedApp.surname} {selectedApp.firstName} {selectedApp.otherName}</div>
              <div><strong>Phone:</strong> {selectedApp.phone}</div>
              <div><strong>Email:</strong> {selectedApp.email}</div>
              <div><strong>DOB:</strong> {new Date(selectedApp.dob).toLocaleDateString()}</div>
              <div><strong>Gender:</strong> {selectedApp.gender}</div>
              <div><strong>Marital:</strong> {selectedApp.maritalStatus}</div>
              <div><strong>Occupation:</strong> {selectedApp.occupation}</div>
              <div><strong>Employment:</strong> {selectedApp.employmentType}</div>
              <div><strong>State:</strong> {selectedApp.state}</div>
              <div><strong>LGA:</strong> {selectedApp.lga}</div>
              <div><strong>Nominator:</strong> {selectedApp.nominatorName}</div>
              <div><strong>Nominator Phone:</strong> {selectedApp.nominatorPhone}</div>
              <div><strong>Submitted:</strong> {new Date(selectedApp.submittedAt).toLocaleString()}</div>
            </div>

            {/* Documents */}
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: colors.primary }}>Documents</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {selectedApp.passportPhotoUrl && (
                  <div>
                    <p style={{ fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>Passport Photo</p>
                    <img
                      src={`http://localhost:5000${selectedApp.passportPhotoUrl}`}
                      alt="Passport"
                      style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e0e0e0' }}
                    />
                  </div>
                )}
                {selectedApp.govtIdUrl && (
                  <div>
                    <p style={{ fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>Government ID</p>
                    <a
                      href={`http://localhost:5000${selectedApp.govtIdUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: colors.primary,
                        color: '#fff',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.8rem'
                      }}
                    >
                      View ID Document
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Status History */}
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: colors.primary }}>Status History</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {selectedApp.statusHistory?.map((h, i) => (
                  <div key={i} style={{ padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px', fontSize: '0.8rem' }}>
                    <strong>{h.status}</strong> — by {h.updatedBy}
                    <span style={{ color: '#888', marginLeft: '0.5rem' }}>{new Date(h.updatedAt).toLocaleString()}</span>
                    {h.note && <p style={{ margin: '0.25rem 0 0 0', color: '#666' }}>{h.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update */}
            {getAvailableStatuses(selectedApp.status).length > 0 && (
              <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: colors.primary }}>Update Status</h4>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    style={{ flex: 1, padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '6px' }}
                  >
                    <option value="">Select new status...</option>
                    {getAvailableStatuses(selectedApp.status).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Add a note (optional)..."
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  rows="2"
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '0.75rem' }}
                />
                <button
                  onClick={handleStatusChange}
                  disabled={!newStatus || updatingStatus}
                  style={{
                    padding: '0.6rem 1.5rem',
                    background: !newStatus || updatingStatus ? '#ccc' : colors.success,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: !newStatus || updatingStatus ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PortalPage;
