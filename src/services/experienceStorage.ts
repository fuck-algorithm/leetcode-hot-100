/**
 * 经验值存储服务 - 用于保存用户经验值和宝箱开启状态
 */

import { dbService, STORES } from './dbService';

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
  /**
   * 获取数据库实例
   */
  private async getDb(): Promise<IDBDatabase> {
    return dbService.getDatabase();
  }

  /**
   * 获取总经验值
   */
  async getTotalExperience(): Promise<ExperienceRecord> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.EXPERIENCE], 'readonly');
      const store = transaction.objectStore(STORES.EXPERIENCE);
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
    const db = await this.getDb();
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
      const transaction = db.transaction([STORES.EXPERIENCE], 'readwrite');
      const store = transaction.objectStore(STORES.EXPERIENCE);
      const request = store.put(record);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(record);
    });
  }

  /**
   * 减少经验值（用于取消完成状态时）
   */
  async removeExperience(amount: number): Promise<ExperienceRecord> {
    const db = await this.getDb();
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
      const transaction = db.transaction([STORES.EXPERIENCE], 'readwrite');
      const store = transaction.objectStore(STORES.EXPERIENCE);
      const request = store.put(record);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(record);
    });
  }

  /**
   * 检查宝箱是否已开启
   */
  async isTreasureOpened(treasureId: string): Promise<boolean> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TREASURES], 'readonly');
      const store = transaction.objectStore(STORES.TREASURES);
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
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TREASURES], 'readonly');
      const store = transaction.objectStore(STORES.TREASURES);
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
    const db = await this.getDb();
    
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
      const transaction = db.transaction([STORES.TREASURES], 'readwrite');
      const store = transaction.objectStore(STORES.TREASURES);
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
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TREASURES], 'readonly');
      const store = transaction.objectStore(STORES.TREASURES);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // 过滤出已开启的宝箱
        const allTreasures = request.result as TreasureRecord[] || [];
        const openedTreasures = allTreasures.filter(t => t.opened);
        resolve(openedTreasures);
      };
    });
  }

  /**
   * 重置所有经验值和宝箱（用于重新开始）
   */
  async resetAll(): Promise<void> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.EXPERIENCE, STORES.TREASURES], 'readwrite');
      
      transaction.objectStore(STORES.EXPERIENCE).clear();
      transaction.objectStore(STORES.TREASURES).clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * 重置指定路径的宝箱（用于重新修炼单个类目）
   */
  async resetPathTreasures(pathId: string): Promise<void> {
    const db = await this.getDb();
    const treasures = await this.getAllOpenedTreasures();
    
    // 找出该路径相关的宝箱
    const pathTreasures = treasures.filter(t => 
      t.treasureId.includes(`path-${pathId}-`) || 
      t.treasureId.includes(`detail-${pathId}-`) ||
      t.treasureId.includes(`endpoint-${pathId}`)
    );
    
    if (pathTreasures.length === 0) return;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TREASURES], 'readwrite');
      const store = transaction.objectStore(STORES.TREASURES);
      
      pathTreasures.forEach(treasure => {
        store.delete(treasure.treasureId);
      });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

// 导出单例
export const experienceStorage = new ExperienceStorage();
export default experienceStorage;
