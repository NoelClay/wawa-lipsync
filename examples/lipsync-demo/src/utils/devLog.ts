const IS_DEV = import.meta.env.DEV;

/**
 * 개발 환경에서만 동작하는 로그 함수
 * @param title 로그 제목
 * @param content 로그 내용
 * @param type 로그 타입 (log, warn, error, info)
 */
export const devLog = (
  title: string,
  content: any,
  type: 'log' | 'warn' | 'error' | 'info' = 'log',
) => {
  if (!IS_DEV) {
    return;
  }

  const styles = {
    log: 'background: #222; color: #bada55; font-weight: bold; padding: 2px 4px; border-radius: 2px;',
    warn: 'background: #ffb22b; color: #000; font-weight: bold; padding: 2px 4px; border-radius: 2px;',
    error: 'background: #ff4c4c; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 2px;',
    info: 'background: #4c9aff; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 2px;',
  };

  console.groupCollapsed(`%c[DEV] ${title}`, styles[type]);
  console.log(content);
  console.groupEnd();
};

export default devLog;
