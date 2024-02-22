export function copyToClipboard(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Append the textarea to the document
  document.body.appendChild(textarea);
  textarea.select();
  navigator.clipboard.writeText(text);
  // Remove the textarea from the document
  document.body.removeChild(textarea);
}
