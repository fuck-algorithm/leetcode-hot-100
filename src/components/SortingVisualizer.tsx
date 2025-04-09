import React, { useState, useEffect } from 'react';

interface SortingVisualizerProps {
  arraySize?: number;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ arraySize = 50 }) => {
  const [array, setArray] = useState<number[]>([]);
  
  // 重置数组
  const resetArray = () => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(randomIntFromInterval(5, 500));
    }
    setArray(newArray);
  };
  
  // 组件挂载时初始化数组
  useEffect(() => {
    resetArray();
  }, []);
  
  // 生成随机数
  const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  // 执行冒泡排序
  const bubbleSort = () => {
    const newArray = [...array];
    for (let i = 0; i < newArray.length; i++) {
      for (let j = 0; j < newArray.length - i - 1; j++) {
        if (newArray[j] > newArray[j + 1]) {
          // 交换元素
          [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
        }
      }
    }
    setArray(newArray);
  };
  
  return (
    <div className="sorting-visualizer">
      <div className="array-container">
        {array.map((value, idx) => (
          <div 
            className="array-bar" 
            key={idx}
            style={{
              height: `${value}px`,
              width: '10px',
              backgroundColor: 'turquoise',
              margin: '0 1px',
              display: 'inline-block'
            }}
          ></div>
        ))}
      </div>
      <div className="controls">
        <button onClick={resetArray}>生成新数组</button>
        <button onClick={bubbleSort}>冒泡排序</button>
      </div>
    </div>
  );
};

export default SortingVisualizer; 