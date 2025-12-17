/**
 * SSE (Server-Sent Events) 通知服務
 * 用於接收後端推送的即時通知
 */
class NotificationSSEService {
  constructor() {
    this.eventSource = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000 // 3秒
    this.isManualClose = false
    this.onNotificationCallback = null
    this.onErrorCallback = null
    this.onConnectionStateChangeCallback = null
    this.reconnectTimer = null
    this.isOnline = navigator.onLine
    this.connectionState = 'disconnected' // 'disconnected' | 'connecting' | 'connected' | 'error'

    // 初始化網路狀態監聽
    this.initNetworkListeners()
  }

  /**
   * 初始化網路狀態監聽器
   */
  initNetworkListeners() {
    // 監聽網路連線
    window.addEventListener('online', () => {
      console.log('🌐 網路已恢復')
      this.isOnline = true

      // 如果之前有連線且不是手動關閉，則自動重連
      if (!this.isManualClose && !this.isConnected()) {
        console.log('🔄 網路恢復，嘗試重新連線...')
        this.reconnectAttempts = 0 // 重置重連次數
        this.connect(this.onNotificationCallback, this.onErrorCallback)
      }
    })

    // 監聽網路斷線
    window.addEventListener('offline', () => {
      console.log('🌐 網路已斷開')
      this.isOnline = false
      this.updateConnectionState('error')

      // 清除重連計時器
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
    })
  }

  /**
   * 更新連線狀態並觸發回調
   * @param {string} state - 連線狀態
   */
  updateConnectionState(state) {
    if (this.connectionState !== state) {
      this.connectionState = state
      console.log(`📡 連線狀態變更: ${state}`)

      if (this.onConnectionStateChangeCallback) {
        this.onConnectionStateChangeCallback(state)
      }
    }
  }

  /**
   * 建立 SSE 連線
   * @param {Function} onNotification - 收到通知時的回調函數
   * @param {Function} onError - 發生錯誤時的回調函數
   * @param {Function} onConnectionStateChange - 連線狀態變更時的回調函數
   */
  connect(onNotification, onError, onConnectionStateChange) {
    // 檢查網路狀態
    if (!this.isOnline) {
      console.warn('⚠️ 網路未連線，無法建立 SSE 連線')
      this.updateConnectionState('error')
      return
    }

    // 改進的重複連線檢查 - 頁面 reload 時強制重新建立連線
    if (this.eventSource) {
      const state = this.eventSource.readyState
      console.log('🔍 檢測到現有連線，readyState:', state, '(0=CONNECTING, 1=OPEN, 2=CLOSED)')

      // 🔥 關鍵修改：無論狀態如何，都強制關閉舊連線並重新建立
      // 這樣可以解決頁面 reload 時的連線殘留問題
      console.log('🧹 強制關閉舊連線並重新建立')
      try {
        this.eventSource.close()
      } catch (e) {
        console.warn('⚠️ 關閉舊連線時發生錯誤:', e)
      }
      this.eventSource = null
    }

    // 儲存回調函數供重連使用
    this.onNotificationCallback = onNotification
    this.onErrorCallback = onError
    this.onConnectionStateChangeCallback = onConnectionStateChange

    // 更新狀態為連線中
    this.updateConnectionState('connecting')

    const url = 'http://localhost:8080/api/notifications/stream'

    try {
      this.eventSource = new EventSource(url, {
        withCredentials: true // 自動帶上 Cookie
      })
      this.isManualClose = false

      // 監聽連線成功事件
      this.eventSource.addEventListener('connected', (event) => {
        console.log('✅ SSE 通知連線成功:', event.data)
        this.reconnectAttempts = 0 // 重置重連次數
        this.updateConnectionState('connected')
      })

      // 監聽通知事件
      this.eventSource.addEventListener('notification', (event) => {
        try {
          const notification = JSON.parse(event.data)
          console.log('📬 收到新通知:', notification)

          if (this.onNotificationCallback) {
            this.onNotificationCallback(notification)
          }
        } catch (error) {
          console.error('❌ 解析通知資料失敗:', error, event.data)
        }
      })

      // 監聽心跳事件（可選）
      this.eventSource.addEventListener('heartbeat', (event) => {
        console.log('💓 收到心跳:', event.data)
      })

      // 監聽錯誤事件
      this.eventSource.onerror = (error) => {
        console.error('❌ SSE 連線錯誤:', error)

        // 更新連線狀態
        this.updateConnectionState('error')

        // 觸發錯誤回調
        if (this.onErrorCallback) {
          this.onErrorCallback({
            type: 'connection_error',
            message: 'SSE 連線發生錯誤',
            error,
            readyState: this.eventSource?.readyState
          })
        }

        // 如果不是手動關閉且網路正常，則嘗試重連
        if (!this.isManualClose && this.isOnline) {
          this.handleReconnect()
        }
      }

      console.log('🔌 正在建立 SSE 通知連線...')
    } catch (error) {
      console.error('❌ 建立 SSE 連線失敗:', error)
      if (this.onErrorCallback) {
        this.onErrorCallback(error)
      }
    }
  }

  /**
   * 處理重連邏輯
   */
  handleReconnect() {
    // 檢查網路狀態
    if (!this.isOnline) {
      console.warn('⚠️ 網路未連線，暫停重連')
      this.updateConnectionState('error')
      return
    }

    // 清除現有的重連計時器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    // 檢查是否達到最大重連次數
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`❌ 已達到最大重連次數 (${this.maxReconnectAttempts})，停止重連`)
      this.updateConnectionState('error')

      // 通知使用者達到最大重連次數
      if (this.onErrorCallback) {
        this.onErrorCallback({
          type: 'max_retries_reached',
          message: '通知連線失敗次數過多，請重新整理頁面或檢查網路連線',
          reconnectAttempts: this.reconnectAttempts,
          maxReconnectAttempts: this.maxReconnectAttempts
        })
      }

      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * this.reconnectAttempts // 遞增延遲

    console.log(`🔄 嘗試重連 (${this.reconnectAttempts}/${this.maxReconnectAttempts})，${delay}ms 後重試...`)
    this.updateConnectionState('connecting')

    // 關閉舊連線
    this.disconnect(false) // 不重置回調函數

    // 延遲後重連
    this.reconnectTimer = setTimeout(() => {
      if (!this.isManualClose && this.isOnline) {
        this.connect(this.onNotificationCallback, this.onErrorCallback, this.onConnectionStateChangeCallback)
      }
    }, delay)
  }

  /**
   * 斷開 SSE 連線
   * @param {boolean} clearCallbacks - 是否清除回調函數（預設為 true）
   */
  disconnect(clearCallbacks = true) {
    // 清除重連計時器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    // 關閉 EventSource
    if (this.eventSource) {
      this.isManualClose = true
      this.eventSource.close()
      this.eventSource = null
      console.log('🔌 SSE 通知連線已關閉')
      this.updateConnectionState('disconnected')
    }

    // 重置重連次數
    this.reconnectAttempts = 0

    // 清除回調函數
    if (clearCallbacks) {
      this.onNotificationCallback = null
      this.onErrorCallback = null
      this.onConnectionStateChangeCallback = null
    }
  }

  /**
   * 檢查連線狀態
   * @returns {boolean} 是否已連線
   */
  isConnected() {
    return this.eventSource?.readyState === EventSource.OPEN
  }

  /**
   * 獲取連線狀態
   * @returns {number} 連線狀態 (0: CONNECTING, 1: OPEN, 2: CLOSED)
   */
  getReadyState() {
    if (!this.eventSource) {
      return EventSource.CLOSED
    }
    return this.eventSource.readyState
  }

  /**
   * 獲取連線狀態文字
   * @returns {string} 連線狀態文字
   */
  getReadyStateText() {
    const state = this.getReadyState()
    const stateMap = {
      [EventSource.CONNECTING]: 'CONNECTING',
      [EventSource.OPEN]: 'OPEN',
      [EventSource.CLOSED]: 'CLOSED'
    }
    return stateMap[state] || 'UNKNOWN'
  }

  /**
   * 獲取當前連線狀態
   * @returns {string} 連線狀態 ('disconnected' | 'connecting' | 'connected' | 'error')
   */
  getConnectionState() {
    return this.connectionState
  }

  /**
   * 檢查網路是否在線
   * @returns {boolean} 是否在線
   */
  isNetworkOnline() {
    return this.isOnline
  }
}

// 匯出單例實例
export default new NotificationSSEService()
