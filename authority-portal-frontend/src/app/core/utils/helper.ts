import {SlideOverAction} from 'src/app/shared/components/common/slide-over/slide-over.model';

/**
 *  get the next or previous index of an array
 * @param direction
 * @param currentIndex
 * @param totalLength
 * @returns
 */
export function sliderOverNavigation(
  direction: SlideOverAction,
  currentIndex: number,
  totalLength: number,
): number {
  if (direction === SlideOverAction.NEXT) {
    return currentIndex < totalLength - 1 ? currentIndex + 1 : 0;
  } else {
    // PREVIOUS
    return currentIndex > 0 ? currentIndex - 1 : totalLength - 1;
  }
}
/**
 * generate and download a file
 * @param fileTitle
 * @param content
 * @param contentType
 */
export function downloadFile(
  fileTitle: string,
  content: string,
  contentType: string,
) {
  const a = document.createElement('a');
  const blob = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(blob);
  a.download = fileTitle;
  a.click();
  window.URL.revokeObjectURL(window.URL.createObjectURL(blob));
}
