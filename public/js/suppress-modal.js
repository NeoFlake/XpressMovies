const suppressionModale = document.getElementById('suppression-modale')
if (suppressionModale) {
    suppressionModale.addEventListener('show.bs.modal', event => {

        const star = event.relatedTarget;

        const title = star.getAttribute('data-bs-film-title');
        const id = star.getAttribute('data-bs-id');

        const modalTitle = document.querySelector('.modal-title');
        const modalBody = document.querySelector('.modal-body');
        const confirmSuppression = document.getElementById("confirm-suppression");

        modalTitle.textContent = `Retrait du film "${title}" de vos favoris`;
        modalBody.textContent = `Êtes-vous sûr de vouloir retirer le film "${title}" de votre liste de favoris"`;
        confirmSuppression.onclick = () => {
            window.location.href = `/favoris/${id}`;
        };

    });
}