/**
 * 通知音效管理工具
 * 用於播放通知提示音
 */
class NotificationSoundManager {
  constructor() {
    this.audioContext = null
    this.isEnabled = true
    this.volume = 0.5 // 預設音量 50%

    // 從 localStorage 載入設定
    this.loadSettings()
  }

  /**
   * 從 localStorage 載入音效設定
   */
  loadSettings() {
    try {
      const settings = localStorage.getItem('notification_sound_settings')
      if (settings) {
        const parsed = JSON.parse(settings)
        this.isEnabled = parsed.isEnabled ?? true
        this.volume = parsed.volume ?? 0.5
      }
    } catch (error) {
      console.error('載入音效設定失敗:', error)
    }
  }

  /**
   * 儲存音效設定到 localStorage
   */
  saveSettings() {
    try {
      const settings = {
        isEnabled: this.isEnabled,
        volume: this.volume
      }
      localStorage.setItem('notification_sound_settings', JSON.stringify(settings))
    } catch (error) {
      console.error('儲存音效設定失敗:', error)
    }
  }

  /**
   * 初始化 AudioContext（延遲初始化，避免瀏覽器警告）
   */
  initAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      } catch (error) {
        console.error('初始化 AudioContext 失敗:', error)
      }
    }
    return this.audioContext
  }

  /**
   * 播放通知音效（使用 Web Audio API 生成簡單的提示音）
   * @param {string} type - 通知類型 ('default' | 'success' | 'warning' | 'error')
   */
  play(type = 'default') {
    // 檢查是否啟用音效
    if (!this.isEnabled) {
      return
    }

    try {
      const context = this.initAudioContext()
      if (!context) {
        console.warn('AudioContext 不可用')
        return
      }

      // 恢復 AudioContext（如果被暫停）
      if (context.state === 'suspended') {
        context.resume()
      }

      // 根據類型選擇音效參數
      const soundParams = this.getSoundParams(type)

      // 創建音效
      this.createSound(context, soundParams)
    } catch (error) {
      console.error('播放通知音效失敗:', error)
    }
  }

  /**
   * 根據通知類型獲取音效參數
   * @param {string} type - 通知類型
   * @returns {Object} 音效參數
   */
  getSoundParams(type) {
    const params = {
      default: {
        frequency: 800,
        duration: 0.15,
        type: 'sine'
      },
      success: {
        frequency: 1000,
        duration: 0.2,
        type: 'sine'
      },
      warning: {
        frequency: 600,
        duration: 0.25,
        type: 'square'
      },
      error: {
        frequency: 400,
        duration: 0.3,
        type: 'sawtooth'
      }
    }

    return params[type] || params.default
  }

  /**
   * 創建並播放音效
   * @param {AudioContext} context - AudioContext 實例
   * @param {Object} params - 音效參數
   */
  createSound(context, params) {
    const currentTime = context.currentTime

    // 創建振盪器（產生聲音）
    const oscillator = context.createOscillator()
    oscillator.type = params.type
    oscillator.frequency.setValueAtTime(params.frequency, currentTime)

    // 創建增益節點（控制音量）
    const gainNode = context.createGain()
    gainNode.gain.setValueAtTime(this.volume, currentTime)

    // 淡出效果
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + params.duration)

    // 連接節點
    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    // 播放音效
    oscillator.start(currentTime)
    oscillator.stop(currentTime + params.duration)
  }

  /**
   * 播放自訂音效檔案（如果有提供音效檔案）
   * @param {string} audioUrl - 音效檔案 URL
   */
  async playAudioFile(audioUrl) {
    if (!this.isEnabled) {
      return
    }

    try {
      const audio = new Audio(audioUrl)
      audio.volume = this.volume
      await audio.play()
    } catch (error) {
      console.error('播放音效檔案失敗:', error)
    }
  }

  /**
   * 啟用音效
   */
  enable() {
    this.isEnabled = true
    this.saveSettings()
    console.log('✅ 通知音效已啟用')
  }

  /**
   * 停用音效
   */
  disable() {
    this.isEnabled = false
    this.saveSettings()
    console.log('🔇 通知音效已停用')
  }

  /**
   * 切換音效開關
   * @returns {boolean} 新的啟用狀態
   */
  toggle() {
    this.isEnabled = !this.isEnabled
    this.saveSettings()
    console.log(this.isEnabled ? '✅ 通知音效已啟用' : '🔇 通知音效已停用')
    return this.isEnabled
  }

  /**
   * 設定音量
   * @param {number} volume - 音量 (0.0 - 1.0)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
    console.log(`🔊 音量已設定為: ${Math.round(this.volume * 100)}%`)
  }

  /**
   * 獲取當前音量
   * @returns {number} 當前音量 (0.0 - 1.0)
   */
  getVolume() {
    return this.volume
  }

  /**
   * 檢查音效是否啟用
   * @returns {boolean} 是否啟用
   */
  isAudioEnabled() {
    return this.isEnabled
  }

  /**
   * 測試音效（用於設定頁面）
   * @param {string} type - 音效類型
   */
  test(type = 'default') {
    console.log('🔊 測試音效:', type)
    this.play(type)
  }
}

// 匯出單例實例
export default new NotificationSoundManager()
