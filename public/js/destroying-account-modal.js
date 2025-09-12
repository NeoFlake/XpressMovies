const desctroyingAccountModale = document.getElementById('destroying-account-modale')
if (desctroyingAccountModale) {
    desctroyingAccountModale.addEventListener('show.bs.modal', event => {

        const star = event.relatedTarget;

        const title = star.getAttribute('data-bs-film-title');
        const id = star.getAttribute('data-bs-id');

        const modalTitle = document.querySelector('.modal-title');
        const modalBody = document.querySelector('.modal-body');
        const confirmSuppression = document.getElementById("confirm-suppression");

        modalTitle.textContent = `Suppression définitive de votre compte`;
        modalBody.textContent = `Êtes-vous sûr de vouloir supprimer définitivement votre compte? Cette action est totalement irréversible!`;
        confirmSuppression.onclick = () => {
            window.location.href = `/profile/${id}`;
        };

    });
}