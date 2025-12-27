/**
 * IndexedDB存储服务 - 用于保存题目完成状态
 */

const DB_NAME = 'leetcode-hot-100-progress';
const DB_VERSION = 1;
const STORE_NAME = 'completions';

export interface CompletionRecord {
  problemId: string;
  completed: boolean;
  completedAt: number | null;
}

class CompletionStorage {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    if (this.db) return;
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB打开失败:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建对象存储
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'problemId' });
          store.createIndex('completed', 'completed', { unique: false });
          store.createIndex('completedAt', 'completedAt', { unique: false });
        }
      };
    });

    return this.initPromise;
  }


  /**
   * 确保数据库已初始化
   */
  private async ensureDb(): Promise<IDBDatabase> {
    await this.init();
    if (!this.db) {
      throw new Error('数据库未初始化');
    }
    return this.db;
  }

  /**
   * 设置题目完成状态
   */
  async setCompletion(problemId: string, completed: boolean): Promise<void> {
    const db = await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const record: CompletionRecord = {
        problemId,
        completed,
        completedAt: completed ? Date.now() : null
      };
      
      const request = store.put(record);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * 获取单个题目的完成状态
   */
  async getCompletion(problemId: string): Promise<CompletionRecord | null> {
    const db = await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(problemId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  /**
   * 获取所有题目的完成状态
   */
  async getAllCompletions(): Promise<Map<string, CompletionRecord>> {
    const db = await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const map = new Map<string, CompletionRecord>();
        (request.result as CompletionRecord[]).forEach(record => {
          map.set(record.problemId, record);
        });
        resolve(map);
      };
    });
  }

  /**
   * 检查题目是否已完成
   */
  async isCompleted(problemId: string): Promise<boolean> {
    const record = await this.getCompletion(problemId);
    return record?.completed ?? false;
  }

  /**
   * 获取已完成题目的数量
   */
  async getCompletedCount(): Promise<number> {
    const completions = await this.getAllCompletions();
    let count = 0;
    completions.forEach(record => {
      if (record.completed) count++;
    });
    return count;
  }

  /**
   * 清空所有完成状态（重新开始）
   */
  async clearAll(): Promise<void> {
    const db = await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * 批量设置完成状态
   */
  async setCompletions(records: { problemId: string; completed: boolean }[]): Promise<void> {
    const db = await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      records.forEach(({ problemId, completed }) => {
        const record: CompletionRecord = {
          problemId,
          completed,
          completedAt: completed ? Date.now() : null
        };
        store.put(record);
      });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

// 导出单例
export const completionStorage = new CompletionStorage();
export default completionStorage;
