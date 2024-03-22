document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('exportBtn');
  const userData = document.getElementById('userData');

  exportBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/generate-pdf');
      const blob = await response.blob();

      // Crear enlace temporal para descargar el PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'users.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Limpiar el enlace después de la descarga
      window.URL.revokeObjectURL(url);

      // Mostrar mensaje de éxito
      document.getElementById('message').style.display = 'block';
    } catch (error) {
      console.error('Error:', error);
      // Mostrar mensaje de error
      document.getElementById('error').style.display = 'block';
    }
  });
});
