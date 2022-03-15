/** Shows a toast. */
export function toast(s: string, duration: number) {
  const toast = document.createElement('p');
  toast.innerText = s;
  document.getElementById('toast-list').appendChild(toast);

  // fade in
  setTimeout(() => toast.classList.add('in'), 100);
  // fade out
  setTimeout(() => {
    toast.classList.remove('in');
    toast.classList.add('out');
    // remove toast
    setTimeout(
      () => document.getElementById('toast-list').removeChild(toast),
      100
    );
  }, duration);
}
