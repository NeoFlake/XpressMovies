document.querySelectorAll(".card-img-top").forEach(img => {
    img.addEventListener("click", () => {

        // Crée un objet Image pour récupérer les dimensions réelles
        const tempImg = new Image();
        tempImg.src = img.src;

        tempImg.onload = () => {
            const naturalWidth = tempImg.naturalWidth;
            const naturalHeight = tempImg.naturalHeight;

            const modal = document.getElementById("full-poster-modal");
            const modalImg = document.getElementById("full-poster-modal-img");
            modal.style.display = "flex";
            modalImg.src = img.src;
            modalImg.style.height = "80vh";
            modalImg.style.width = `${((80 * naturalWidth) / naturalHeight)}vh`;
        }
    });
});

document.getElementById("full-poster-modal").addEventListener("click", () => {
    document.getElementById("full-poster-modal").style.display = "none";
});