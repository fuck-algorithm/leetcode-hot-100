/**
 * IndexedDB存储服务 - 用于保存题目完成状态和用户偏好
 */

import { dbService, STORES } from './dbService';

export interface CompletionRecord {
  problemId: string;
  completed: boolean;
  completedAt: number | null;
}

// 完成状态筛选类型
export type CompletionFilterType = 'all' | 'completed' | 'incomplete';

// 用户偏好设置
export interface UserPreferences {
  key: string;
  value: string | number | boolean | object;
}

class CompletionStorage {
  /**
   * 获取数据库实例
   */
  private async getDb(): Promise<IDBDatabase> {
    return dbService.getDatabase();
  }

  /**
   * 设置题目完成状态
   */
  async setCompletion(problemId: string, completed: boolean): Promise<void> {
    try {
      const db = await this.getDb();
      
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([STORES.COMPLETIONS], 'readwrite');
          const store = transaction.objectStore(STORES.COMPLETIONS);
          
          const record: CompletionRecord = {
            problemId,
            completed,
            completedAt: completed ? Date.now() : null
          };
          
          const request = store.put(record);
          
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      console.error('数据库获取失败:', error);
      throw error;
    }
  }

  /**
   * 获取单个题目的完成状态
   */
  async getCompletion(problemId: string): Promise<CompletionRecord | null> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.COMPLETIONS], 'readonly');
      const store = transaction.objectStore(STORES.COMPLETIONS);
      const request = store.get(problemId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  /**
   * 获取所有题目的完成状态
   */
  async getAllCompletions(): Promise<Map<string, CompletionRecord>> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.COMPLETIONS], 'readonly');
      const store = transaction.objectStore(STORES.COMPLETIONS);
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
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.COMPLETIONS], 'readwrite');
      const store = transaction.objectStore(STORES.COMPLETIONS);
      const request = store.clear();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * 批量设置完成状态
   */
  async setCompletions(records: { problemId: string; completed: boolean }[]): Promise<void> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.COMPLETIONS], 'readwrite');
      const store = transaction.objectStore(STORES.COMPLETIONS);
      
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

  /**
   * 保存用户偏好设置
   */
  async setPreference<T>(key: string, value: T): Promise<void> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.PREFERENCES], 'readwrite');
      const store = transaction.objectStore(STORES.PREFERENCES);
      
      const request = store.put({ key, value });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * 获取用户偏好设置
   */
  async getPreference<T>(key: string, defaultValue: T): Promise<T> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.PREFERENCES], 'readonly');
      const store = transaction.objectStore(STORES.PREFERENCES);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as UserPreferences | undefined;
        resolve(result ? (result.value as T) : defaultValue);
      };
    });
  }
}

// 导出单例
export const completionStorage = new CompletionStorage();
export default completionStorage;
