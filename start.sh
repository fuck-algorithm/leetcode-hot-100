#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目名称（用于识别进程）
PROJECT_NAME="leetcode-visualization"

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 查找并杀死之前的进程
kill_previous_process() {
    log_info "检查是否有正在运行的服务..."
    
    # 查找 react-scripts start 进程
    PIDS=$(ps aux | grep "react-scripts start" | grep -v grep | awk '{print $2}')
    
    if [ -z "$PIDS" ]; then
        log_info "没有发现正在运行的服务"
        return 0
    fi
    
    log_warn "发现正在运行的服务进程: $PIDS"
    
    # 杀死所有找到的进程
    for PID in $PIDS; do
        log_info "正在终止进程 $PID..."
        kill -9 $PID 2>/dev/null
        
        if [ $? -eq 0 ]; then
            log_info "进程 $PID 已成功终止"
        else
            log_warn "无法终止进程 $PID (可能已经停止)"
        fi
    done
    
    # 等待进程完全终止
    sleep 2
    
    # 再次检查是否还有残留进程
    REMAINING=$(ps aux | grep "react-scripts start" | grep -v grep | wc -l)
    if [ $REMAINING -gt 0 ]; then
        log_error "仍有进程未能终止，请手动检查"
        return 1
    fi
    
    log_info "所有旧进程已清理完毕"
    return 0
}

# 检查端口占用
check_port() {
    PORT=${1:-3000}
    log_info "检查端口 $PORT 是否被占用..."
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        log_warn "端口 $PORT 被占用，正在尝试释放..."
        PID=$(lsof -Pi :$PORT -sTCP:LISTEN -t)
        kill -9 $PID 2>/dev/null
        sleep 1
        log_info "端口 $PORT 已释放"
    else
        log_info "端口 $PORT 可用"
    fi
}

# 启动服务
start_service() {
    log_info "正在启动 $PROJECT_NAME 服务..."
    
    # 检查 node_modules 是否存在
    if [ ! -d "node_modules" ]; then
        log_warn "node_modules 不存在，正在安装依赖..."
        npm install
        if [ $? -ne 0 ]; then
            log_error "依赖安装失败"
            exit 1
        fi
    fi
    
    # 启动服务
    log_info "执行 npm start..."
    npm start
}

# 主函数
main() {
    echo ""
    log_info "=========================================="
    log_info "  $PROJECT_NAME 启动脚本"
    log_info "=========================================="
    echo ""
    
    # 1. 杀死之前的进程
    kill_previous_process
    if [ $? -ne 0 ]; then
        log_error "清理旧进程失败"
        exit 1
    fi
    
    # 2. 检查端口
    check_port 3000
    
    # 3. 启动服务
    echo ""
    start_service
}

# 捕获 Ctrl+C 信号
trap 'log_warn "收到中断信号，正在停止服务..."; exit 0' INT TERM

# 执行主函数
main
