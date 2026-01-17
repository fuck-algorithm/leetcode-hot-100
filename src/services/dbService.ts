/**
 * 统一的 IndexedDB 数据库服务
 * 所有存储服务都应该通过这个服务来访问数据库
 */

const DB_NAME = 'leetcode-hot-100-progress';
const DB_VERSION = 5;

// Object Store 名称常量
export const STORES = {
  COMPLETIONS: 'completions',
  PREFERENCES: 'preferences',
  EXPERIENCE: 'experience',
  TREASURES: 'treasures'
} as const;

class DatabaseService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  /**
   * 初始化数据库（单例模式）
   */
  async getDatabase(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB 打开失败:', request.error);
        this.initPromise = null;
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        
        // 监听数据库意外关闭
        this.db.onversionchange = () => {
          this.db?.close();
          this.db = null;
          this.initPromise = null;
        };
        
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建完成状态对象存储
        if (!db.objectStoreNames.contains(STORES.COMPLETIONS)) {
          const store = db.createObjectStore(STORES.COMPLETIONS, { keyPath: 'problemId' });
          store.createIndex('completed', 'completed', { unique: false });
          store.createIndex('completedAt', 'completedAt', { unique: false });
        }
        
        // 创建用户偏好对象存储
        if (!db.objectStoreNames.contains(STORES.PREFERENCES)) {
          db.createObjectStore(STORES.PREFERENCES, { keyPath: 'key' });
        }
        
        // 创建经验值对象存储
        if (!db.objectStoreNames.contains(STORES.EXPERIENCE)) {
          db.createObjectStore(STORES.EXPERIENCE, { keyPath: 'id' });
        }
        
        // 创建宝箱对象存储
        if (!db.objectStoreNames.contains(STORES.TREASURES)) {
          const store = db.createObjectStore(STORES.TREASURES, { keyPath: 'treasureId' });
          store.createIndex('opened', 'opened', { unique: false });
        }
      };

      request.onblocked = () => {
        console.warn('IndexedDB 升级被阻止，请关闭其他标签页');
      };
    });

    return this.initPromise;
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }

  /**
   * 删除数据库（用于测试或重置）
   */
  static async deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => {
        console.warn('删除数据库被阻止，请关闭其他标签页');
      };
    });
  }
}

// 导出单例
export const dbService = new DatabaseService();
export default dbService;
