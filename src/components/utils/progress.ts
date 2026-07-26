export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = window.setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 8) + 1;
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = window.setInterval(() => {
        percent = percent + Math.ceil(Math.random() * 3);
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 150);
    }
  }, 80);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = window.setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
