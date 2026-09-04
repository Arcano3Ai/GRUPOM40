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
    }).format(val)// Helper para estructurar el mensaje final y URL de WhatsApp con la situación del cliente
function buildWhatsAppUrl(params) {
    if (typeof params === 'string') {
        return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(params)}`;
    }

    const { nombre, edad, inicioLaboral } = params || {};
    const year = parseInt(inicioLaboral, 10);
    const ley73Status = (!isNaN(year) && year < 1997)
        ? 'Candidato a Ley 73 (Inició antes del 1 de julio de 1997)'
        : (inicioLaboral ? 'Inició en o después de 1997 (Requiere revisión de régimen)' : 'Por definir');

    const lines = [
        'Hola Asesora, solicito asesoría sobre Modalidad 40:',
        '',
        'SITUACIÓN DEL CLIENTE:',
        '• Nombre: ' + (nombre && nombre.trim() ? nombre.trim() : 'Por especificar'),
        '• Edad: ' + (edad ? edad + ' años' : 'Por especificar'),
        '• Año en que empezó a cotizar/trabajar: ' + (inicioLaboral ? inicioLaboral : 'Por especificar'),
        '• Diagnóstico preliminar: ' + ley73Status,
        '',
        '¿Me apoya revisando si soy candidato para pensión con la Ley 73 del IMSS?'
    ];

    return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}

// Función global directa para enviar el reporte de WhatsApp desde el botón del formulario
function submitHeroLeadForm() {
    const heroNombre = document.getElementById('hero-nombre');
    const heroEdad = document.getElementById('hero-edad');
    const heroInicio = document.getElementById('hero-inicio');
    const heroSubmitBtn = document.getElementById('btn-hero-submit');

    const nombreVal = (heroNombre && heroNombre.value) ? heroNombre.value.trim() : '';
    const edadVal = (heroEdad && heroEdad.value) ? heroEdad.value.trim() : '';
    const inicioVal = (heroInicio && heroInicio.value) ? heroInicio.value.trim() : '';

    const waUrl = buildWhatsAppUrl({
        nombre: nombreVal,
        edad: edadVal,
        inicioLaboral: inicioVal
    });

    if (heroSubmitBtn) {
        heroSubmitBtn.innerHTML = '<span>✓ Abriendo WhatsApp con tu reporte...</span>';
    }

    // Enviar directamente a WhatsApp
    try {
        const win = window.open(waUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
            window.location.href = waUrl;
        }
    } catch (e) {
        window.location.href = waUrl;
    }

    return false;
}

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.submitHeroLeadForm = submitHeroLeadForm;
}

/* ==========================================================================
   CONTROLADOR DEL FORMULARIO PRINCIPAL EN EL HERO
   ========================================================================== */
function initLeadFormsAndCTAs() {
    const heroForm = document.getElementById('hero-lead-form');
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitHeroLeadForm();
        });
    }
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

// Inicialización robusta para navegador
function initAll() {
    initSimulator();
    initFaqAccordion();
    initNavbarScroll();
    initLeadFormsAndCTAs();
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
}

// Exponer al objeto global para acceso directo e infalible en browser
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.buildWhatsAppUrl = buildWhatsAppUrl;
    window.formatCurrency = formatCurrency;
}
