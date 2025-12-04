import { checkNickname } from '@/api/oauth/nicknameCheck';

/**
 * 計算混合長度（中英文混合）
 * - ASCII 字元（英數）算 1 單位
 * - 非 ASCII 字元（中文等）算 2 單位
 * @param {string} str - 要計算的字串
 * @returns {number} 總長度單位
 */
export function mixedLength(str) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode <= 0x007f) {
      length += 1; // ASCII 字元
    } else {
      length += 2; // 非 ASCII 字元（中文等）
    }
  }
  return length;
}

/**
 * Debounce 函式：延遲執行函式，避免頻繁觸發
 * 支援取消功能以處理請求競爭
 * @param {Function} fn - 要延遲執行的函式
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Function} 包裝後的函式，附帶 cancel 方法
 */
export function debounce(fn, delay) {
  let timeoutId = null;

  const debouncedFn = function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };

  // 提供取消方法
  debouncedFn.cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFn;
}

/**
 * 驗證訊息常數（支援多語系）
 */
export const VALIDATION_MESSAGES = {
  EMPTY: '',
  TOO_SHORT: '暱稱至少需要 2 個字元（中文 1 字等於 2 字元）',
  CHECKING: '檢查中...',
  AVAILABLE: '✓ 這個暱稱可以使用',
  TAKEN: '✗ 這個暱稱已被使用，請換一個',
  ERROR: '暫時無法驗證暱稱，請稍後再試',
  INVALID_FORMAT: '暱稱格式不正確'
};

/**
 * 最小暱稱長度（混合長度單位）
 */
export const MIN_NICKNAME_LENGTH = 2;

/**
 * 前端基本格式驗證（不呼叫 API）
 * @param {string} nickname - 要驗證的暱稱
 * @returns {Object} 驗證結果 { valid: boolean, message: string, type: 'success'|'error'|'warning'|'info' }
 */
export function validateNicknameFormat(nickname) {
  // 去除前後空白
  const trimmedNickname = nickname.trim();

  // 檢查是否為空
  if (!trimmedNickname) {
    return {
      valid: false,
      message: VALIDATION_MESSAGES.EMPTY,
      type: 'error'
    };
  }

  // 檢查長度規則
  const length = mixedLength(trimmedNickname);
  if (length < MIN_NICKNAME_LENGTH) {
    return {
      valid: false,
      message: VALIDATION_MESSAGES.TOO_SHORT,
      type: 'error'
    };
  }

  // 基本格式驗證通過
  return {
    valid: true,
    message: '',
    type: 'success'
  };
}

/**
 * 完整的暱稱驗證（包含 API 檢查）
 * @param {string} nickname - 要驗證的暱稱
 * @returns {Promise<Object>} 驗證結果 { valid: boolean, message: string, type: 'success'|'error'|'warning'|'info', available?: boolean }
 */
export async function validateNicknameWithAPI(nickname) {
  // 先進行前端格式驗證
  const formatValidation = validateNicknameFormat(nickname);
  if (!formatValidation.valid) {
    return formatValidation;
  }

  const trimmedNickname = nickname.trim();

  try {
    // 呼叫後端 API 檢查暱稱是否可用
    const response = await checkNickname(trimmedNickname);

    // 從 response.data.available 取值
    const available = response?.available;

    if (available === true) {
      return {
        valid: true,
        message: VALIDATION_MESSAGES.AVAILABLE,
        type: 'success',
        available: true
      };
    } else if (available === false) {
      return {
        valid: false,
        message: VALIDATION_MESSAGES.TAKEN,
        type: 'error',
        available: false
      };
    } else {
      // 回傳格式異常
      return {
        valid: false,
        message: VALIDATION_MESSAGES.ERROR,
        type: 'warning',
        available: null
      };
    }
  } catch (error) {
    console.error('暱稱檢查 API 錯誤:', error);

    // API 失敗時的處理
    return {
      valid: false,
      message: VALIDATION_MESSAGES.ERROR,
      type: 'warning',
      available: null
    };
  }
}

/**
 * 建立帶有請求競爭處理的暱稱驗證器
 * 用於處理快速連續輸入時的 API 請求
 * @returns {Object} 包含 validate 和 cancel 方法的驗證器
 */
export function createNicknameValidator() {
  let currentRequestId = 0;
  let abortController = null;

  return {
    /**
     * 驗證暱稱（帶請求競爭處理）
     * @param {string} nickname - 要驗證的暱稱
     * @returns {Promise<Object>} 驗證結果
     */
    async validate(nickname) {
      // 取消之前的請求
      if (abortController) {
        abortController.abort();
      }

      // 建立新的請求 ID
      const requestId = ++currentRequestId;
      abortController = new AbortController();

      // 先進行前端格式驗證
      const formatValidation = validateNicknameFormat(nickname);
      if (!formatValidation.valid) {
        return formatValidation;
      }

      const trimmedNickname = nickname.trim();

      try {
        // 呼叫後端 API
        const response = await checkNickname(trimmedNickname);

        // 檢查是否為最新的請求
        if (requestId !== currentRequestId) {
          // 這是舊的請求，忽略結果
          return null;
        }

        const available = response?.available;

        if (available === true) {
          return {
            valid: true,
            message: VALIDATION_MESSAGES.AVAILABLE,
            type: 'success',
            available: true
          };
        } else if (available === false) {
          return {
            valid: false,
            message: VALIDATION_MESSAGES.TAKEN,
            type: 'error',
            available: false
          };
        } else {
          return {
            valid: false,
            message: VALIDATION_MESSAGES.ERROR,
            type: 'warning',
            available: null
          };
        }
      } catch (error) {
        // 檢查是否為最新的請求
        if (requestId !== currentRequestId) {
          return null;
        }

        console.error('暱稱檢查 API 錯誤:', error);
        return {
          valid: false,
          message: VALIDATION_MESSAGES.ERROR,
          type: 'warning',
          available: null
        };
      }
    },

    /**
     * 取消當前的驗證請求
     */
    cancel() {
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
      currentRequestId++;
    }
  };
}

// 保留舊的函式以維持向後相容性
export function validateUsername(username) {
  return validateNicknameFormat(username);
}
