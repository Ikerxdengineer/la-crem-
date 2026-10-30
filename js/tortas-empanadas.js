(() => {
    if (window.__catalogoListo) return;
    window.__catalogoListo = true;

    const WHATSAPP = "51946310714";
    const MAX = 99;
    const $ = (sel, base = document) => base.querySelector(sel);
    const $$ = (sel, base = document) => [...base.querySelectorAll(sel)];

    const dinero = n => "S/ " + n.toFixed(2);
    const limpiar = valor => {
        const n = parseInt(valor, 10);
        return isNaN(n) || n < 0 ? 0 : Math.min(n, MAX);
    };

    const actualizar = () => {
        let total = 0, cantidadTotal = 0;
        const lineas = [];

        $$(".producto").forEach(p => {
            const cantidad = limpiar($(".num", p).value);
            const subtotal = Number(p.dataset.precio) * cantidad;

            $(".subtotal", p).textContent = "Subtotal: " + dinero(subtotal);
            p.classList.toggle("elegido", cantidad > 0);

            total += subtotal;
            cantidadTotal += cantidad;
            if (cantidad > 0) lineas.push(`- ${cantidad} x ${p.dataset.nombre} (${dinero(subtotal)})`);
        });

        $(".presupuesto-total").textContent = "Total: " + dinero(total);
        $(".presupuesto-items").textContent = cantidadTotal + (cantidadTotal === 1 ? " producto" : " productos");

        const pedir = $(".pedir");
        if (cantidadTotal > 0) {
            const mensaje = `Hola, quiero hacer este pedido en La Cremé:\n${lineas.join("\n")}\nTotal: ${dinero(total)}`;
            pedir.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
            pedir.target = "_blank";
            pedir.rel = "noopener";
            pedir.removeAttribute("aria-disabled");
        } else {
            pedir.href = "#";
            pedir.removeAttribute("target");
            pedir.setAttribute("aria-disabled", "true");
        }
    };

    const filtrar = categoria => {
        $$(".filtro").forEach(f => f.classList.toggle("activo", f.dataset.filtro === categoria));
        $$(".producto").forEach(p => {
            p.hidden = !(categoria === "todos" || p.dataset.categoria === categoria);
        });
    };

    document.addEventListener("click", e => {
        const boton = e.target.closest("button, a.pedir");
        if (!boton) return;
        const clase = boton.classList;

        if (clase.contains("filtro")) return filtrar(boton.dataset.filtro);

        if (clase.contains("pedir")) {
            if (boton.getAttribute("aria-disabled") === "true") e.preventDefault();
            return;
        }

        if (clase.contains("vaciar")) {
            $$(".producto .num").forEach(n => n.value = 0);
            return actualizar();
        }

        const producto = boton.closest(".producto");
        if (!producto) return;
        const num = $(".num", producto);

        if (clase.contains("mas")) num.value = Math.min(limpiar(num.value) + 1, MAX);
        else if (clase.contains("menos")) num.value = Math.max(limpiar(num.value) - 1, 0);
        else return;
        actualizar();
    });

    document.addEventListener("input", e => {
        if (e.target.matches(".num")) actualizar();
    });

    document.addEventListener("focusout", e => {
        if (e.target.matches(".num")) {
            e.target.value = limpiar(e.target.value);
            actualizar();
        }
    });

    document.addEventListener("focusin", e => {
        if (e.target.matches(".num")) e.target.select();
    });

    $$(".producto .num").forEach(n => { if (n.value === "") n.value = 0; });
    actualizar();
})();