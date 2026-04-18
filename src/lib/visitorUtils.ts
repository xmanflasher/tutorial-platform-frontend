export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  
  // Try Cookie first
  const cookies = document.cookie.split('; ');
  const visitorCookie = cookies.find(row => row.startsWith('visitor_id='));
  if (visitorCookie) {
    return visitorCookie.split('=')[1];
  }

  // Try LocalStorage
  let vid = localStorage.getItem('visitor_id');
  if (!vid) {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      vid = crypto.randomUUID();
    } else {
      vid = Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    localStorage.setItem('visitor_id', vid);
  }

  // Ensure Cookie is set for Backend access
  document.cookie = `visitor_id=${vid}; path=/; max-age=31536000; SameSite=Lax`;
  return vid;
}

export function logVisitorIdentity(category: 'GUEST' | 'PASSERBY') {
  const visitorId = getVisitorId();
  const { API_BASE_URL } = require('@/lib/api-config');
  
  fetch(`${API_BASE_URL}/visitor/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, visitorId })
  }).catch(err => console.error('[VisitorLog] Failed', err));
}
