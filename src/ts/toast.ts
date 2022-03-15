/** Shows a toast. */
export function toast(s: string, kind: "success" | "error", duration: number) {
  const toast = document.createElement('p');
  toast.classList.add(kind);
  toast.innerText = s;
  document.getElementById('toast-list').appendChild(toast);

  // fade in
  setTimeout(() => toast.classList.add('fade-in'), 100);
  // fade out
  setTimeout(() => {
    toast.classList.remove('fade-in');
    // remove toast
    setTimeout(
      () => document.getElementById('toast-list').removeChild(toast),
      100
    );
  }, duration);
}
