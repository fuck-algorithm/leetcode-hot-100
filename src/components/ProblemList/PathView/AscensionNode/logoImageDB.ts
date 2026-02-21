// IndexedDB service for storing custom company logo images

const DB_NAME = 'leetcode-hot-100-db';
const DB_VERSION = 1;
const STORE_NAME = 'logo-images';

interface LogoImageRecord {
  id: string;
  imageData: string; // base64 encoded image
  timestamp: number;
}

class LogoImageDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async saveLogoImage(id: string, imageData: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Failed to initialize IndexedDB');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const record: LogoImageRecord = {
        id,
        imageData,
        timestamp: Date.now(),
      };

      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getLogoImage(id: string): Promise<string | null> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Failed to initialize IndexedDB');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result as LogoImageRecord | undefined;
        resolve(result?.imageData || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteLogoImage(id: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Failed to initialize IndexedDB');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const logoImageDB = new LogoImageDB();

// Helper function to convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper function to validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: '只支持 JPEG, PNG, GIF, WebP 格式的图片' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: '图片大小不能超过 2MB' };
  }

  return { valid: true };
}
