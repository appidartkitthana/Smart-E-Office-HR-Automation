
import { API_CONFIG } from '../config';

export type ConnectionStatus = 'Online' | 'Offline' | 'Syncing' | 'Error';

interface ConnectionState {
  status: ConnectionStatus;
  lastSync: Date | null;
  errorCount: number;
}

let connectionState: ConnectionState = {
  status: 'Online',
  lastSync: null,
  errorCount: 0
};

const listeners: ((state: ConnectionState) => void)[] = [];
const notify = () => listeners.forEach(l => l({ ...connectionState }));

export const db = {
  subscribe(callback: (state: ConnectionState) => void) {
    listeners.push(callback);
    callback({ ...connectionState });
    return () => {
      const idx = listeners.indexOf(callback);
      if (idx > -1) listeners.splice(idx, 1);
    };
  },

  getState() {
    return { ...connectionState };
  },

  async request(url: string, options?: RequestInit) {
    connectionState.status = 'Syncing';
    notify();

    try {
      // สำหรับ Google Apps Script การทำ POST จำเป็นต้องใช้ Mode: cors หรือ no-cors 
      // แต่เราต้องการผลลัพธ์ JSON ดังนั้นต้องมั่นใจว่า Script ปลายทางอนุญาต CORS
      const response = await fetch(url, {
        ...options,
        // redirect: 'follow' เป็นสิ่งจำเป็นสำหรับ GAS Web App
        redirect: 'follow',
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      connectionState.status = 'Online';
      connectionState.lastSync = new Date();
      connectionState.errorCount = 0;
      notify();
      
      return data;
    } catch (error) {
      console.warn(`[DB API Service] Request failed for: ${url}`, error);
      connectionState.status = 'Error';
      connectionState.errorCount++;
      notify();
      // ไม่ต้องโยน Error เพื่อให้ App ไม่พัง แต่คืนค่า null
      return null;
    }
  },

  async getAll(sheetName: string) {
    const data = await this.request(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=read&sheet=${sheetName}`);
    return Array.isArray(data) ? data : [];
  },

  async create(sheetName: string, data: any) {
    const payload = {
      action: 'create',
      sheet: sheetName,
      data: { ...data, id: data.id || `ID-${Date.now()}` }
    };
    
    return await this.request(API_CONFIG.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async update(sheetName: string, id: string, data: any) {
    const payload = {
      action: 'update',
      sheet: sheetName,
      id: id,
      data: data
    };
    
    return await this.request(API_CONFIG.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async delete(sheetName: string, id: string) {
    const payload = {
      action: 'delete',
      sheet: sheetName,
      id: id
    };
    
    return await this.request(API_CONFIG.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getConfig(key: string) {
    try {
      const configs = await this.getAll('CONFIG');
      const config = configs.find((c: any) => c.id === key);
      return config ? JSON.parse(config.value) : null;
    } catch (e) { return null; }
  },

  async setConfig(key: string, value: any) {
    return await this.create('CONFIG', { id: key, value: JSON.stringify(value) });
  }
};
