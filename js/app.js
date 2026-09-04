/**
 * GRUPO MODALIDAD 40 - LÓGICA DE ALTA CONVERSIÓN & PRE-CONSULTA WHATSAPP
 * Formulario Directo en Hero, Modal Reutilizable, Sincronización de Datos y CTAs
 */

// Constantes Oficiales México 2026
const CONFIG = {
    PHONE: '5212206494278', // Teléfono Asesoría Oficial +52 1 220 649 4278
    UMA_DIARIA_2026: 117.31,
    DIAS_MES_PROMEDIO: 30.4,
    FACTOR_COSTO_M40_2026: 0.14438,
    NSS_LENGTH: 11
};

// Helper para formatear moneda en Pesos Mexicanos (MXN)
function formatCurrency(val) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0
    }).format(val);
}

// Helper para sanitizar NSS a solo dígitos (máx 11)
function sanitizeNSS(val) {
    if (!val) return '';
    return val.replace(/\D/g, '').slice(0, CONFIG.NSS_LENGTH);
}

// Helper para aplicar máscara visual al NSS (XX-XX-XX-XXXX-X)
function formatNSSDisplay(rawDigits) {
    const digits = sanitizeNSS(rawDigits);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
    if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 10)}-${digits.slice(10)}`;
}

// Helper para estructurar el mensaje final y URL de WhatsApp
function buildWhatsAppUrl(params) {
    if (typeof params === 'string') {
        return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(params)}`;
    }

    const { nombre, edad, nss } = params;
    const nssClean = sanitizeNSS(nss);
    const nssDisplay = nssClean.length === 11 ? formatNSSDisplay(nssClean) : (nss && nss.trim() ? nss.trim() : 'No lo tengo a la mano');

    const lines = [
        `👋 *Hola Asesora, solicito información sobre Modalidad 40:*`,
        ``,
        `• *Nombre:* ${nombre ? nombre.trim() : 'No especificado'}`,
        `• *Edad:* ${edad} años`,
        `• *NSS:* ${nssDisplay}`
    ];

    return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/* ==========================================================================
   SISTEMA INTEGRADO DE FORMULARIOS Y CTAs DE WHATSAPP
   ========================================================================== */
function initLeadFormsAndCTAs() {
    // 1. Elementos del Hero Form
    const heroForm = document.getElementById('hero-lead-form');
    const heroNombre = document.getElementById('hero-nombre');
    const heroEdad = document.getElementById('hero-edad');
    const heroNss = document.getElementById('hero-nss');
    const heroSubmitBtn = document.getElementById('btn-hero-submit');
    const errHeroNombre = document.getElementById('err-hero-nombre');
    const errHeroEdad = document.getElementById('err-hero-edad');

    // 2. Elementos del Modal Form
    const modal = document.getElementById('modal-diagnostico-m40');
    const modalClose = document.getElementById('m40-modal-close');
    const modalForm = document.getElementById('form-pre-whatsapp');
    const modalNombre = document.getElementById('diag-nombre');
    const modalEdad = document.getElementById('diag-edad');
    const modalNss = document.getElementById('diag-nss');
    const modalSubmitBtn = document.getElementById('btn-submit-whatsapp-modal');
    const errModalNombre = document.getElementById('err-diag-nombre');
    const errModalEdad = document.getElementById('err-diag-edad');

    // Estado compartido en memoria
    const state = {
        nombre: '',
        edad: '',
        nss: ''
    };

    // Sincronización bidireccional entre inputs
    const syncInputs = (field, value) => {
        state[field] = value;
        if (field === 'nombre') {
            if (heroNombre && heroNombre.value !== value) heroNombre.value = value;
            if (modalNombre && modalNombre.value !== value) modalNombre.value = value;
        } else if (field === 'edad') {
            if (heroEdad && heroEdad.value !== value) heroEdad.value = value;
            if (modalEdad && modalEdad.value !== value) modalEdad.value = value;
        } else if (field === 'nss') {
            const formatted = value.length > 0 ? formatNSSDisplay(value) : '';
            if (heroNss && heroNss.value !== formatted) heroNss.value = formatted;
            if (modalNss && modalNss.value !== formatted) modalNss.value = formatted;
        }
    };

    // Listeners para Hero
    if (heroNombre) heroNombre.addEventListener('input', (e) => syncInputs('nombre', e.target.value));
    if (heroEdad) heroEdad.addEventListener('input', (e) => syncInputs('edad', e.target.value));
    if (heroNss) heroNss.addEventListener('input', (e) => syncInputs('nss', sanitizeNSS(e.target.value)));

    // Listeners para Modal
    if (modalNombre) modalNombre.addEventListener('input', (e) => syncInputs('nombre', e.target.value));
    if (modalEdad) modalEdad.addEventListener('input', (e) => syncInputs('edad', e.target.value));
    if (modalNss) modalNss.addEventListener('input', (e) => syncInputs('nss', sanitizeNSS(e.target.value)));

    // Helpers para modal
    const openModal = () => {
        if (!modal) return;
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            if (modalNombre) modalNombre.focus();
        }, 150);
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) closeModal();
    });

    // Validar y enviar WhatsApp
    const handleFormSubmit = (btn, isModal = false) => {
        let valid = true;
        const nombreVal = state.nombre.trim();
        const edadVal = parseInt(state.edad, 10);

        // Validar Nombre
        if (nombreVal.length < 2) {
            valid = false;
            if (isModal) {
                if (modalNombre) modalNombre.classList.add('is-invalid');
                if (errModalNombre) errModalNombre.classList.add('is-visible');
            } else {
                if (heroNombre) heroNombre.classList.add('is-invalid');
                if (errHeroNombre) errHeroNombre.classList.add('is-visible');
            }
        } else {
            if (heroNombre) heroNombre.classList.remove('is-invalid');
            if (modalNombre) modalNombre.classList.remove('is-invalid');
            if (errHeroNombre) errHeroNombre.classList.remove('is-visible');
            if (errModalNombre) errModalNombre.classList.remove('is-visible');
        }

        // Validar Edad
        if (isNaN(edadVal) || edadVal < 25 || edadVal > 100) {
            valid = false;
            if (isModal) {
                if (modalEdad) modalEdad.classList.add('is-invalid');
                if (errModalEdad) errModalEdad.classList.add('is-visible');
            } else {
                if (heroEdad) heroEdad.classList.add('is-invalid');
                if (errHeroEdad) errHeroEdad.classList.add('is-visible');
            }
        } else {
            if (heroEdad) heroEdad.classList.remove('is-invalid');
            if (modalEdad) modalEdad.classList.remove('is-invalid');
            if (errHeroEdad) errHeroEdad.classList.remove('is-visible');
            if (errModalEdad) errModalEdad.classList.remove('is-visible');
        }

        if (!valid) return false;

        // Construir URL de WhatsApp
        const waUrl = buildWhatsAppUrl({
            nombre: nombreVal,
            edad: edadVal,
            nss: state.nss
        });

        // Feedback en botón
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = `<span>✓ Abriendo WhatsApp...</span>`;
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                if (isModal) closeModal();
            }, 1200);
        }

        // Abrir WhatsApp en nueva pestaña
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        return true;
    };

    // 3. Listener en Submit del Hero
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(heroSubmitBtn, false);
        });
    }

    // 4. Listener en Submit del Modal
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(modalSubmitBtn, true);
        });
    }

    // 5. Vincular todos los CTAs de WhatsApp en cualquier lugar de la página
    const allWhatsAppCTAs = document.querySelectorAll('[data-cta-whatsapp], a[href*="wa.me"]');
    allWhatsAppCTAs.forEach((cta) => {
        cta.addEventListener('click', (e) => {
            e.preventDefault();

            // Si los datos ya están completos, enviar directo
            if (state.nombre.trim().length >= 2 && !isNaN(parseInt(state.edad, 10))) {
                handleFormSubmit(cta, false);
                return;
            }

            // Si el usuario está cerca del Hero, enfocar el Hero form
            const heroSection = document.getElementById('inicio');
            const heroRect = heroSection ? heroSection.getBoundingClientRect() : null;
            const isHeroVisible = heroRect && heroRect.top >= -200 && heroRect.bottom >= 300;

            if (isHeroVisible && heroNombre) {
                heroNombre.focus();
                heroNombre.classList.add('is-invalid');
                setTimeout(() => heroNombre.classList.remove('is-invalid'), 1200);
            } else {
                openModal();
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

// Inicializar en navegador
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
    sanitizeNSS,
    formatNSSDisplay,
    buildWhatsAppUrl,
    formatCurrency
};
