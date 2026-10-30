(function () {
    
    var WHATSAPP = "51946310714";

    var form = document.getElementById("formulario");
    var aviso = document.getElementById("aviso");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var d = new FormData(form);
        var texto = "Hola, soy " + d.get("nombre").trim() + ".\n";
        texto += "Correo: " + d.get("correo").trim() + "\n";
        if (d.get("direccion").trim()) texto += "Dirección: " + d.get("direccion").trim() + "\n";
        texto += "\n" + d.get("mensaje").trim();

        window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank", "noopener");

        aviso.textContent = "Se abrió WhatsApp con tu mensaje. Solo falta enviarlo.";
        form.reset();
    });
})();