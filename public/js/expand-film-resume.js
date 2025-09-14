document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.resume-text').forEach(p => {
    p.addEventListener('click', () => { 
      p.classList.toggle('full-text');
    });
  });
});