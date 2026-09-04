/**
 * GRUPO MODALIDAD 40 - LÓGICA OFICIAL
 * Formulario Directo en el Hero (Nombre, Edad, Año de Inicio), Vinculación de CTAs y Simulador
 */

// Constantes Oficiales México 2026
const CONFIG = {
    PHONE: '5212206494278', // Teléfono Asesoría Oficial +52 1 220 649 4278
    UMA_DIARIA_2026: 117.31,
    DIAS_MES_PROMEDIO: 30.4,
    FACTOR_COSTO_M40_2026: 0.14438
};

// Helper para formatear moneda en Pesos Mexicanos (MXN)
function formatCurrency(val) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0
    }).format(val);
}

// Helper para estructurar el mensaje final y URL de WhatsApp con el reporte
function buildWhatsAppUrl(params) {
    if (typeof params === 'string') {
        return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(params)}`;
    }

    const { nombre, edad, inicioLaboral } = params;

    const lines = [
        `👋 *Hola Asesora, solicito asesoría sobre Modalidad 40:*`,
        ``,
        `📋 *REPORTE PARA ASESORÍA:*`,
        `• *Nombre:* ${nombre ? nombre.trim() : 'No especificado'}`,
        `• *Edad:* ${edad} años`,
        `• *Año en que empezó a cotizar/trabajar:* ${inicioLaboral ? inicioLaboral : 'No especificado'}`,
        ``,
        `¿Me apoya revisando si soy candidato para pensión con la Ley 73 del IMSS?`
    ];

    return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/* ==========================================================================
   CONTROLADOR DEL FORMULARIO PRINCIPAL EN EL HERO Y CTAs DE WHATSAPP
   ========================================================================== */
function initLeadFormsAndCTAs() {
    const heroForm = document.getElementById('hero-lead-form');
    const heroNombre = document.getElementById('hero-nombre');
    const heroEdad = document.getElementById('hero-edad');
    const heroInicio = document.getElementById('hero-inicio');
    const heroSubmitBtn = document.getElementById('btn-hero-submit');

    const errHeroNombre = document.getElementById('err-hero-nombre');
    const errHeroEdad = document.getElementById('err-hero-edad');
    const errHeroInicio = document.getElementById('err-hero-inicio');

    const state = {
        nombre: '',
        edad: '',
        inicioLaboral: ''
    };

    if (heroNombre) {
        heroNombre.addEventListener('input', (e) => {
            state.nombre = e.target.value;
            if (state.nombre.trim().length >= 2 && errHeroNombre) {
                heroNombre.classList.remove('is-invalid');
                errHeroNombre.classList.remove('is-visible');
            }
        });
    }

    if (heroEdad) {
        heroEdad.addEventListener('input', (e) => {
            state.edad = e.target.value;
            const val = parseInt(state.edad, 10);
            if (!isNaN(val) && val >= 25 && val <= 100 && errHeroEdad) {
                heroEdad.classList.remove('is-invalid');
                errHeroEdad.classList.remove('is-visible');
            }
        });
    }

    if (heroInicio) {
        heroInicio.addEventListener('input', (e) => {
            state.inicioLaboral = e.target.value;
            const year = parseInt(state.inicioLaboral, 10);
            if (!isNaN(year) && year >= 1940 && year <= 2026 && errHeroInicio) {
                heroInicio.classList.remove('is-invalid');
                errHeroInicio.classList.remove('is-visible');
            }
        });
    }

    const scrollToHeroAndFocus = () => {
        const heroSection = document.getElementById('inicio');
        if (heroSection) {
            heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => {
            if (heroNombre) {
                heroNombre.focus();
                heroNombre.classList.add('is-invalid');
                setTimeout(() => heroNombre.classList.remove('is-invalid'), 1500);
            }
        }, 500);
    };

    const submitLeadForm = () => {
        let valid = true;
        const nombreVal = heroNombre ? heroNombre.value.trim() : state.nombre.trim();
        const edadVal = heroEdad ? parseInt(heroEdad.value, 10) : parseInt(state.edad, 10);
        const inicioVal = heroInicio ? parseInt(heroInicio.value, 10) : parseInt(state.inicioLaboral, 10);

        // 1. Validar Nombre
        if (nombreVal.length < 2) {
            valid = false;
            if (heroNombre) heroNombre.classList.add('is-invalid');
            if (errHeroNombre) errHeroNombre.classList.add('is-visible');
        } else {
            if (heroNombre) heroNombre.classList.remove('is-invalid');
            if (errHeroNombre) errHeroNombre.classList.remove('is-visible');
        }

        // 2. Validar Edad
        if (isNaN(edadVal) || edadVal < 25 || edadVal > 100) {
            valid = false;
            if (heroEdad) heroEdad.classList.add('is-invalid');
            if (errHeroEdad) errHeroEdad.classList.add('is-visible');
        } else {
            if (heroEdad) heroEdad.classList.remove('is-invalid');
            if (errHeroEdad) errHeroEdad.classList.remove('is-visible');
        }

        // 3. Validar Año de Inicio Laboral
        if (isNaN(inicioVal) || inicioVal < 1940 || inicioVal > 2026) {
            valid = false;
            if (heroInicio) heroInicio.classList.add('is-invalid');
            if (errHeroInicio) errHeroInicio.classList.add('is-visible');
        } else {
            if (heroInicio) heroInicio.classList.remove('is-invalid');
            if (errHeroInicio) errHeroInicio.classList.remove('is-visible');
        }

        if (!valid) {
            scrollToHeroAndFocus();
            return false;
        }

        // Generar enlace y abrir WhatsApp con todos los datos
        const waUrl = buildWhatsAppUrl({
            nombre: nombreVal,
            edad: edadVal,
            inicioLaboral: inicioVal
        });

        if (heroSubmitBtn) {
            const originalHtml = heroSubmitBtn.innerHTML;
            heroSubmitBtn.innerHTML = `<span>✓ Abriendo WhatsApp con tus datos...</span>`;
            heroSubmitBtn.disabled = true;
            setTimeout(() => {
                heroSubmitBtn.innerHTML = originalHtml;
                heroSubmitBtn.disabled = false;
            }, 1800);
        }

        // Despacho infalible de WhatsApp (ventana nueva con fallback inmediato)
        try {
            const win = window.open(waUrl, '_blank');
            if (!win || win.closed || typeof win.closed === 'undefined') {
                window.location.href = waUrl;
            }
        } catch (e) {
            window.location.href = waUrl;
        }

        return true;
    };

    // Escuchar el submit del formulario del Hero
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitLeadForm();
        });
    }

    // Vincular todos los demás botones de WhatsApp de la página al formulario
    const allWhatsAppCTAs = document.querySelectorAll('[data-cta-whatsapp], a[href*="wa.me"]');
    allWhatsAppCTAs.forEach((cta) => {
        cta.addEventListener('click', (e) => {
            e.preventDefault();

            const nombreVal = heroNombre ? heroNombre.value.trim() : '';
            const edadVal = heroEdad ? parseInt(heroEdad.value, 10) : NaN;
            const inicioVal = heroInicio ? parseInt(heroInicio.value, 10) : NaN;

            // Si ya llenó los 3 datos en el Hero, enviar directo
            if (nombreVal.length >= 2 && !isNaN(edadVal) && !isNaN(inicioVal)) {
                submitLeadForm();
            } else {
                // Si faltan datos, llevarlo directamente al formulario del principio
                scrollToHeroAndFocus();
            }
        });
    });
}

/* ==========================================================================
   SIMULADOR DE PENSIÓN EXPRÉS LEY 73
   ========================================================================== */
function initSimulator() {
    const weeksSlider = document.getElementById('sim-weeks-range');
    const weeksDisplay = document.getElementById('sim-weeks-val');
    const yearsSlider = document.getElementById('sim-years-range');
    const yearsDisplay = document.getElementById('sim-years-val');
    const salarySelect = document.getElementById('sim-salary-level');

    const pensionResultDisplay = document.getElementById('sim-pension-result');
    const costResultDisplay = document.getElementById('sim-cost-result');
    const totalWeeksDisplay = document.getElementById('sim-total-weeks');

    if (!weeksSlider || !yearsSlider || !salarySelect || !pensionResultDisplay) {
        return;
    }

    const calculate = () => {
        const currentWeeks = parseInt(weeksSlider.value, 10) || 900;
        const yearsInM40 = parseInt(yearsSlider.value, 10) || 5;
        const targetUmas = parseInt(salarySelect.value, 10) || 25;

        if (weeksDisplay) weeksDisplay.textContent = `${currentWeeks} semanas`;
        if (yearsDisplay) yearsDisplay.textContent = `${yearsInM40} ${yearsInM40 === 1 ? 'año' : 'años'}`;

        const addedWeeks = yearsInM40 * 52;
        const finalWeeks = currentWeeks + addedWeeks;
        if (totalWeeksDisplay) totalWeeksDisplay.textContent = `${finalWeeks} sem`;

        const salarioMensualM40 = targetUmas * CONFIG.UMA_DIARIA_2026 * CONFIG.DIAS_MES_PROMEDIO;
        const prevSalaryEstimate = 14000;
        let avgSalary = 0;

        if (yearsInM40 >= 5) {
            avgSalary = salarioMensualM40;
        } else {
            avgSalary = ((salarioMensualM40 * yearsInM40) + (prevSalaryEstimate * (5 - yearsInM40))) / 5;
        }

        const factorCuantia = 0.13;
        const factorIncremento = 0.0245;

        const cuantiaBasica = avgSalary * factorCuantia;
        let semanasExcedentes = (finalWeeks - 500) / 52;
        if (semanasExcedentes < 0) semanasExcedentes = 0;

        const incrementos = avgSalary * factorIncremento * semanasExcedentes;
        const pensionBase = cuantiaBasica + incrementos;

        const factorEdad = 0.85; 
        const factorAsignacion = 1.15; 
        const factorFox = 1.11;

        let pensionEstimada = (pensionBase * factorEdad * factorAsignacion) * factorFox;
        const costoMensual = salarioMensualM40 * CONFIG.FACTOR_COSTO_M40_2026;

        pensionResultDisplay.textContent = formatCurrency(pensionEstimada);
        if (costResultDisplay) costResultDisplay.textContent = formatCurrency(costoMensual);
    };

    weeksSlider.addEventListener('input', calculate);
    yearsSlider.addEventListener('input', calculate);
    salarySelect.addEventListener('change', calculate);
    calculate();
}

/* ==========================================================================
   ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   ========================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!questionBtn || !answer) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach((other) => {
                other.classList.remove('active');
                const otherAns = other.querySelector('.faq-answer');
                if (otherAns) otherAns.style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = `${answer.scrollHeight + 20}px`;
            }
        });
    });
}

/* ==========================================================================
   SCROLL NAVBAR EFFECT
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// Inicializar al cargar en navegador
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initSimulator();
        initFaqAccordion();
        initNavbarScroll();
        initLeadFormsAndCTAs();
    });
}

// Exportar para tests y swarm
export {
    CONFIG,
    buildWhatsAppUrl,
    formatCurrency
};
