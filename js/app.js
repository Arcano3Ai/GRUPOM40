/**
 * GRUPO MODALIDAD 40 - LÓGICA DE ALTA CONVERSIÓN & PRE-CONSULTA WHATSAPP
 * Control del Simulador Ley 73, Formulario Interceptor de WhatsApp, a11y y FAQs
 */

// Constantes Oficiales México 2026
const CONFIG = {
    PHONE: '5212206494278', // Teléfono Asesoría Oficial +52 1 220 649 4278
    UMA_DIARIA_2026: 117.31,
    DIAS_MES_PROMEDIO: 30.4,
    FACTOR_COSTO_M40_2026: 0.14438, // 14.438% para 2026
    MIN_AGE: 25,
    MAX_AGE: 105,
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

// Helper para calcular edad exacta a partir de fecha YYYY-MM-DD
function calculateAge(birthDateString) {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString + 'T00:00:00');
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return (age >= 0 && age <= 120) ? age : null;
}

// Helper para formatear fecha a DD/MM/AAAA
function formatDateToMX(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
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
   MODAL DE DIAGNÓSTICO INTERCEPTOR DE WHATSAPP (SENCILLO: NOMBRE, EDAD, NSS)
   ========================================================================== */
function initWhatsAppLeadModal() {
    const modal = document.getElementById('modal-diagnostico-m40');
    const closeBtn = document.getElementById('m40-modal-close');
    const form = document.getElementById('form-pre-whatsapp');
    if (!modal || !form) return;

    const nombreInput = document.getElementById('diag-nombre');
    const edadInput = document.getElementById('diag-edad');
    const nssInput = document.getElementById('diag-nss');
    const submitBtn = document.getElementById('btn-submit-whatsapp-modal');

    const errNombre = document.getElementById('err-diag-nombre');
    const errEdad = document.getElementById('err-diag-edad');

    const openModal = () => {
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            if (nombreInput) nombreInput.focus();
        }, 150);
    };

    const closeModal = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) closeModal();
    });

    // Interceptar todos los enlaces y botones que llevan a WhatsApp
    const ctaTriggers = document.querySelectorAll('[data-cta-whatsapp], a[href*="wa.me"]');
    ctaTriggers.forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Máscara de NSS en tiempo real si el usuario decide escribirlo
    if (nssInput) {
        nssInput.addEventListener('input', (e) => {
            const clean = sanitizeNSS(e.target.value);
            if (clean.length > 0) {
                e.target.value = formatNSSDisplay(clean);
            }
        });
    }

    // Limpieza de errores en input
    if (nombreInput) {
        nombreInput.addEventListener('input', () => {
            if (nombreInput.value.trim().length >= 2) hideError(nombreInput, errNombre);
        });
    }
    if (edadInput) {
        edadInput.addEventListener('input', () => {
            const val = parseInt(edadInput.value, 10);
            if (!isNaN(val) && val >= 25 && val <= 100) {
                hideError(edadInput, errEdad);
            }
        });
    }

    function showError(input, errEl, msg) {
        if (input) input.classList.add('is-invalid');
        if (errEl) {
            if (msg) errEl.textContent = msg;
            errEl.classList.add('is-visible');
        }
    }

    function hideError(input, errEl) {
        if (input) input.classList.remove('is-invalid');
        if (errEl) errEl.classList.remove('is-visible');
    }

    // Envío del Formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        let firstInvalid = null;

        // Validar Nombre
        const nombreVal = nombreInput ? nombreInput.value.trim() : '';
        if (nombreVal.length < 2) {
            showError(nombreInput, errNombre, 'Por favor ingresa tu nombre.');
            isValid = false;
            if (!firstInvalid) firstInvalid = nombreInput;
        } else {
            hideError(nombreInput, errNombre);
        }

        // Validar Edad
        const edadVal = edadInput ? parseInt(edadInput.value, 10) : NaN;
        if (isNaN(edadVal) || edadVal < 25 || edadVal > 100) {
            showError(edadInput, errEdad, 'Por favor ingresa tu edad.');
            isValid = false;
            if (!firstInvalid) firstInvalid = edadInput;
        } else {
            hideError(edadInput, errEdad);
        }

        if (!isValid) {
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Generar enlace y abrir WhatsApp
        const waUrl = buildWhatsAppUrl({
            nombre: nombreVal,
            edad: edadVal,
            nss: nssInput ? nssInput.value : ''
        });

        const origHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>✓ Abriendo WhatsApp...</span>`;
        submitBtn.disabled = true;

        window.open(waUrl, '_blank', 'noopener,noreferrer');

        setTimeout(() => {
            submitBtn.innerHTML = origHtml;
            submitBtn.disabled = false;
            closeModal();
        }, 1200);
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
    const simCtaBtn = document.getElementById('sim-whatsapp-cta');

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

        const waMessage = `Hola Asesora, realicé mi cálculo en el simulador de Grupo Modalidad 40:
- Semanas actuales: ${currentWeeks}
- Años a invertir en M40: ${yearsInM40} años (${targetUmas} UMAs)
- Pensión estimada: ${formatCurrency(pensionEstimada)} / mes.
Deseo conocer mi viabilidad y estrategia formal.`;

        if (simCtaBtn) {
            simCtaBtn.href = buildWhatsAppUrl(waMessage);
        }
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
        initWhatsAppLeadModal();
    });
}

// Exportar para tests y swarm (ESM / CommonJS dual-friendly)
export {
    CONFIG,
    calculateAge,
    formatDateToMX,
    sanitizeNSS,
    formatNSSDisplay,
    buildWhatsAppUrl,
    formatCurrency
};
