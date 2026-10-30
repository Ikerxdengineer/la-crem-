(() => {
    const slides = [...document.querySelectorAll(".slide")];
    const puntos = [...document.querySelectorAll(".punto")];
    const carrusel = document.querySelector(".carrusel");
    const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let actual = 0, timer, inicioX = null;

    const mostrar = i => {
        actual = (i + slides.length) % slides.length;
        slides.forEach((s, n) => {
            s.classList.toggle("activa", n === actual);
            s.setAttribute("aria-hidden", n !== actual);
        });
        puntos.forEach((p, n) => {
            p.classList.toggle("activo", n === actual);
            p.setAttribute("aria-current", n === actual);
        });
    };

    const detener = () => clearInterval(timer);
    const iniciar = () => {
        if (reducir) return;
        detener();
        timer = setInterval(() => mostrar(actual + 1), 4000);
    };

    puntos.forEach((p, n) => p.addEventListener("click", () => { mostrar(n); iniciar(); }));

    [["mouseenter", detener], ["mouseleave", iniciar], ["focusin", detener], ["focusout", iniciar]]
        .forEach(([evento, fn]) => carrusel.addEventListener(evento, fn));

    carrusel.addEventListener("touchstart", e => { inicioX = e.touches[0].clientX; }, { passive: true });
    carrusel.addEventListener("touchend", e => {
        if (inicioX === null) return;
        const dif = e.changedTouches[0].clientX - inicioX;
        if (Math.abs(dif) > 40) { mostrar(actual + (dif < 0 ? 1 : -1)); iniciar(); }
        inicioX = null;
    }, { passive: true });

    mostrar(0);
    iniciar();
})();