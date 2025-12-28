/**
 * 经验值存储服务 - 用于保存用户经验值和宝箱开启状态
 */

const DB_NAME = 'leetcode-hot-100-progress';
const DB_VERSION = 4; // 升级版本以添加新的存储
const EXPERIENCE_STORE = 'experience';
const TREASURE_STORE = 'treasures';

// 难度对应的经验值
export const DIFFICULTY_EXP = {
  EASY: 10,
  MEDIUM: 20,
  HARD: 30
} as const;

// 宝箱奖励经验值（每个阶段的宝箱）
export const TREASURE_EXP = 50;

// 经验值记录
export interface ExperienceRecord {
  id: string; // 'total' 或其他标识
  totalExp: number;
  level: number;
  lastUpdated: number;
}

// 宝箱记录
export interface TreasureRecord {
  treasureId: string; // 格式: 'path-{pathId}-stage-{stageIndex}' 或 'detail-{pathId}-stage-{stageIndex}'
  opened: boolean;
  openedAt: number | null;
  expAwarded: number;
}

// 计算等级（每100经验升一级）
export const calculateLevel = (exp: number): number => {
  return Math.floor(exp / 100) + 1;
};

// 计算当前等级进度百分比
export const calculateLevelProgress = (exp: number): number => {
  return (exp % 100);
};

class ExperienceStorage {
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
        
        // 创建经验值对象存储
        if (!db.objectStoreNames.contains(EXPERIENCE_STORE)) {
          db.createObjectStore(EXPERIENCE_STORE, { keyPath: 'id' });
        }
        
        // 创建宝箱对象存储
        if (!db.objectStoreNames.contains(TREASURE_STORE)) {
          const store = db.createObjectStore(TREASURE_STORE, { keyPath: 'treasureId' });
          store.createIndex('opened', 'opened', { unique: false });
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
   * 获取总经验值
   */
  async getTotalExperience(): Promise<ExperienceRecord> {
    const db = await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([EXPERIENCE_STORE], 'readonly');
      const store = transaction.objectStore(EXPERIENCE_STORE);
      const request = store.get('total');
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as ExperienceRecord | undefined;
        if (result) {
          resolve(result);
        } else {
          // 返回默认值
          resolve({
            id: 'total',
            totalExp: 0,
            level: 1,
            lastUpdated: Date.now()
          });
        }
      };
    });
  }

  /**
   * 增加经验值
   */
  async addExperience(amount: number): Promise<ExperienceRecord> {
    const db = await this.ensureDb();
    const current = await this.getTotalExperience();
    
    const newExp = current.totalExp + amount;
    const newLevel = calculateLevel(newExp);
    
    const record: ExperienceRecord = {
      id: 'total',
      totalExp: newExp,
      level: newLevel,
      lastUpdated: Date.now()
    };
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([EXPERIENCE_STORE], 'readwrite');
      const store = transaction.objectStore(EXPERIENCE_STORE);
      const request = store.put(record);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(record);
    });
  }

  /**
   * 减少经验值（用于取消完成状态时）
   */
  async removeExperience(amount: number): Promise<ExperienceRecord> {
    const db = await this.ensureDb();
    const current = await this.getTotalExperience();
    
    const newExp = Math.max(0, current.totalExp - amount);
    const newLevel = calculateLevel(newExp);
    
    const record: ExperienceRecord = {
      id: 'total',
      totalExp: newExp,
      level: newLevel,
      lastUpdated: Date.now()
    };
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([EXPERIENCE_STORE], 'readwrite');
      const store = transaction.objectStore(EXPERIENCE_STORE);
      const request = store.put(record);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(record);
    });
  }

  /**
   * 检查宝箱是否已开启
   */
  async isTreasureOpened(treasureId: string): Promise<boolean> {
    const db = await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TREASURE_STORE], 'readonly');
      const store = transaction.objectStore(TREASURE_STORE);
      const request = store.get(treasureId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as TreasureRecord | undefined;
        resolve(result?.opened ?? false);
      };
    });
  }

  /**
   * 获取宝箱记录
   */
  async getTreasure(treasureId: string): Promise<TreasureRecord | null> {
    const db = await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TREASURE_STORE], 'readonly');
      const store = transaction.objectStore(TREASURE_STORE);
      const request = store.get(treasureId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result || null);
      };
    });
  }

  /**
   * 开启宝箱并获取经验值
   */
  async openTreasure(treasureId: string): Promise<{ treasure: TreasureRecord; newExp: ExperienceRecord }> {
    const db = await this.ensureDb();
    
    // 检查是否已开启
    const existing = await this.getTreasure(treasureId);
    if (existing?.opened) {
      const currentExp = await this.getTotalExperience();
      return { treasure: existing, newExp: currentExp };
    }
    
    // 创建宝箱记录
    const treasure: TreasureRecord = {
      treasureId,
      opened: true,
      openedAt: Date.now(),
      expAwarded: TREASURE_EXP
    };
    
    // 保存宝箱记录
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([TREASURE_STORE], 'readwrite');
      const store = transaction.objectStore(TREASURE_STORE);
      const request = store.put(treasure);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
    
    // 增加经验值
    const newExp = await this.addExperience(TREASURE_EXP);
    
    return { treasure, newExp };
  }

  /**
   * 获取所有已开启的宝箱
   */
  async getAllOpenedTreasures(): Promise<TreasureRecord[]> {
    const db = await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TREASURE_STORE], 'readonly');
      const store = transaction.objectStore(TREASURE_STORE);
      const index = store.index('opened');
      const request = index.getAll(IDBKeyRange.only(true));
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result || []);
      };
    });
  }

  /**
   * 重置所有经验值和宝箱（用于重新开始）
   */
  async resetAll(): Promise<void> {
    const db = await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([EXPERIENCE_STORE, TREASURE_STORE], 'readwrite');
      
      transaction.objectStore(EXPERIENCE_STORE).clear();
      transaction.objectStore(TREASURE_STORE).clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

// 导出单例
export const experienceStorage = new ExperienceStorage();
export default experienceStorage;
