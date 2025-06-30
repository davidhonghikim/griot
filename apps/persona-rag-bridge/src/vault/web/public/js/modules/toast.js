// Simple toast notification system
const toast = (message, type = "success") => {
  const toastDiv = document.createElement("div");
  toastDiv.className = `toast toast-${type} slide-in`;
  toastDiv.textContent = message;
  document.body.appendChild(toastDiv);
  setTimeout(() => {
    toastDiv.remove();
  }, 5000);
};

// Toast notification component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type} slide-in`}>
      {message}
    </div>
  );
};

// Export for use in other modules
window.toast = toast;
window.Toast = Toast;
