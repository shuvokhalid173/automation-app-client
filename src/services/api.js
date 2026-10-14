const API_BASE = process.env.REACT_APP_API_URL || '/api';
// const API_BASE = 'https://christina-pseudomoral-unpractically.ngrok-free.dev'

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const domainApi = {
  getAll: () => request('/domains'),
  create: (data) => request('/domains', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/domains/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/domains/${id}`, { method: 'DELETE' }),
};

export const mailboxApi = {
  getAll: () => request('/mailboxes'),
  getByDomain: (domainId) => request(`/mailboxes?domain_id=${domainId}`),
  create: (data) => request('/mailboxes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/mailboxes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/mailboxes/${id}`, { method: 'DELETE' }),
};

export const fileApi = {
  getAll: (params = {}) => {
    const cleanParams = Object.entries(params).reduce((acc, [k, v]) => {
      if (v !== undefined && v !== '') acc[k] = v;
      return acc;
    }, {});
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/files?${query}`);
  },
  getById: (id) => request(`/files/${id}`),
  viewFile: (id) => `${API_BASE}/files/${id}/view`,
  upload: (id, destination) =>
    request(`/files/${id}/upload`, {
      method: 'POST',
      body: JSON.stringify({ destination }),
    }),
};

export const manualUploadApi = {
  uploadFile: async (destination, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Using standard fetch since we need to omit Content-Type for FormData
    const response = await fetch(`${API_BASE}/manual-upload/${destination}`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload file');
    }
    return data;
  }
};
