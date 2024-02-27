export const isEllipsisActive = (e: HTMLElement) => {
  return e.offsetWidth < e.scrollWidth;
};
