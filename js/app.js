/**
 * GRUPO MODALIDAD 40 - LÓGICA OFICIAL
 * Formulario Directo en el Hero (Nombre, Edad, Año de Inicio), Vinculación de CTAs y Simulador
 */

// Constantes Oficiales México 2026
const CONFIG = {
    PHONE: '5212206494278', // Teléfono Asesoría Oficial +52 1 220 649 4278
    UMA_DIARIA_2026: 117.31,
    DIAS_MES_PROMEDIO: 30.4,
    FACTOR_COSTO_M40_2026: 0.14438,
    PAYMENT_CONFIG: {
        SPEI: {
            banco: 'BBVA México',
            beneficiario: 'Asesoría Especializada Modalidad 40',
            clabe: '012180001234567890',
            concepto: 'Asesoria M40'
        },
        MERCADO_PAGO: {
            ONLINE: 'https://mpago.la/2gHR2gv',
            PRESENCIAL: 'https://mpago.la/17PaiDx'
        }
    }
};

// Helper para formatear moneda en Pesos Mexicanos (MXN)
function formatCurrency(val) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0
    }).format(val);
}

// Helper para estructurar el mensaje final y URL de WhatsApp con la situación del cliente
function buildWhatsAppUrl(params) {
    if (typeof params === 'string') {
        return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(params)}`;
    }

    const { nombre, edad, inicioLaboral, telefono } = params || {};
    const year = parseInt(inicioLaboral, 10);
    const ley73Status = (!isNaN(year) && year < 1997)
        ? 'Candidato a Ley 73 (Inició antes del 1 de julio de 1997)'
        : (inicioLaboral ? 'Inició en o después de 1997 (Requiere revisión de régimen)' : 'Por definir');

    const lines = [
        'Hola Asesora, solicito asesoría sobre Modalidad 40:',
        '',
        'SITUACIÓN DEL CLIENTE:',
        '• Nombre: ' + (nombre && nombre.trim() ? nombre.trim() : 'Por especificar'),
        '• Teléfono: ' + (telefono && telefono.trim() ? telefono.trim() : 'Por especificar'),
        '• Edad: ' + (edad ? edad + ' años' : 'Por especificar'),
        '• Año en que empezó a cotizar/trabajar: ' + (inicioLaboral ? inicioLaboral : 'Por especificar'),
        '• Diagnóstico preliminar: ' + ley73Status,
        '',
        '¿Me apoya revisando si soy candidato para pensión con la Ley 73 del IMSS?'
    ];

    return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}

// Configuración Oficial de Planes de Asesoría
const PRICING_PLANS = {
    ONLINE: {
        id: 'plan-online',
        name: 'Plan Online',
        price: 2500,
        priceFormatted: '$2,500 MXN',
        badge: 'Cobertura Nacional',
        subtitle: 'Asesoría estratégica 100% remota para cualquier parte de la República Mexicana.',
        features: [
            'Asesoría estratégica 1 a 1 por videollamada o llamada telefónica',
            'Auditoría y desglose minucioso de tus semanas cotizadas y vigencia',
            'Cálculo de escenarios de pensión (monto óptimo de inversión vs. retorno)',
            'Carpeta digital en PDF con tu proyección personalizada y calendario de pagos',
            'Guía para pago en ventanilla bancaria y portal oficial del IMSS',
            'Soporte continuo vía WhatsApp para dudas durante tu proceso'
        ],
        whatsappMessage: 'Hola Asesora, me interesa contratar el Plan Online ($2,500 MXN) para mi asesoría personalizada de Modalidad 40.'
    },
    PRESENCIAL: {
        id: 'plan-presencial',
        name: 'Plan Presencial',
        price: 3500,
        priceFormatted: '$3,500 MXN',
        badge: 'Recomendado • Todo Incluido',
        subtitle: 'Atención presencial cara a cara en un café o lugar neutral acordado con el cliente, con revisión documental física y acompañamiento total.',
        features: [
            'Todo lo incluido en el Plan Online',
            'Sesión presencial cara a cara en café o lugar neutral acordado con el cliente y la asesora experta en pensiones',
            'Revisión física y cotejo minucioso de documentos originales (historial, constancias, AFORE)',
            'Expediente físico impreso formal con proyecciones financieras y análisis de rentabilidad',
            'Acompañamiento y preparación para trámites en subdelegación y ventanilla del IMSS',
            'Soporte prioritario VIP directo con la licenciada por WhatsApp'
        ],
        whatsappMessage: 'Hola Asesora, me interesa contratar el Plan Presencial ($3,500 MXN con todo incluido) para mi asesoría de Modalidad 40.'
    }
};

function buildPlanWhatsAppUrl(planKey) {
    const key = (planKey || '').toUpperCase();
    const plan = PRICING_PLANS[key];
    if (!plan) {
        return `https://wa.me/${CONFIG.PHONE}`;
    }
    return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(plan.whatsappMessage)}`;
}

function buildEmailConfirmUrl(planKey) {
    const key = (planKey || '').toUpperCase();
    const plan = PRICING_PLANS[key] || PRICING_PLANS.ONLINE;
    const subject = encodeURIComponent(`Comprobante de Pago SPEI - ${plan.name} (${plan.priceFormatted})`);
    const body = encodeURIComponent(`Hola, acabo de realizar el pago de ${plan.name} (${plan.priceFormatted}) vía SPEI. Adjunto mi comprobante para iniciar mi expediente y agendar mi asesoría.`);
    return `mailto:contacto@grupomodalidad40.com.mx?subject=${subject}&body=${body}`;
}

// Función global directa para enviar el reporte de WhatsApp desde el botón del formulario
function submitHeroLeadForm() {
    const heroNombre = document.getElementById('hero-nombre');
    const heroEdad = document.getElementById('hero-edad');
    const heroInicio = document.getElementById('hero-inicio');
    const heroTelefono = document.getElementById('hero-telefono');
    const heroSubmitBtn = document.getElementById('btn-hero-submit');

    const nombreVal = (heroNombre && heroNombre.value) ? heroNombre.value.trim() : '';
    const edadVal = (heroEdad && heroEdad.value) ? heroEdad.value.trim() : '';
    const inicioVal = (heroInicio && heroInicio.value) ? heroInicio.value.trim() : '';
    const telefonoVal = (heroTelefono && heroTelefono.value) ? heroTelefono.value.trim() : '';

    const waUrl = buildWhatsAppUrl({
        nombre: nombreVal,
        edad: edadVal,
        inicioLaboral: inicioVal,
        telefono: telefonoVal
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

/* ==========================================================================
   PASARELA DE PAGOS Y CHECKOUT (MERCADO PAGO, SPEI Y CLABE)
   ========================================================================== */
let currentCheckoutPlan = 'ONLINE';

function openCheckoutModal(planKey = 'ONLINE') {
    const key = (planKey || 'ONLINE').toUpperCase();
    currentCheckoutPlan = key;
    const plan = PRICING_PLANS[key] || PRICING_PLANS.ONLINE;
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    // Actualizar datos del plan en el modal
    const planNameEl = document.getElementById('checkout-plan-name');
    const planPriceEl = document.getElementById('checkout-plan-price');
    const speiAmountEl = document.getElementById('checkout-spei-amount');

    if (planNameEl) planNameEl.textContent = plan.name;
    if (planPriceEl) planPriceEl.textContent = plan.priceFormatted;
    if (speiAmountEl) speiAmountEl.textContent = plan.priceFormatted;

    // Reset del botón de MP al estado inicial
    resetMpButton();

    // Actualizar enlace directo de Mercado Pago según el plan seleccionado
    const mpBtn = document.getElementById('checkout-mp-button');
    if (mpBtn) {
        const directUrl = (CONFIG.PAYMENT_CONFIG && CONFIG.PAYMENT_CONFIG.MERCADO_PAGO && CONFIG.PAYMENT_CONFIG.MERCADO_PAGO[key]) || 'https://mpago.la/2gHR2gv';
        if (mpBtn.tagName === 'A') {
            mpBtn.href = directUrl;
        }
    }

    // Actualizar el enlace de confirmación por correo (SPEI)
    const emailConfirmEl = document.getElementById('checkout-email-confirm');
    if (emailConfirmEl) {
        emailConfirmEl.href = buildEmailConfirmUrl(key);
    }

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
}

function initCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    // Botones de contratación que abren el checkout
    document.querySelectorAll('[data-open-checkout]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const planKey = btn.getAttribute('data-open-checkout') || 'ONLINE';
            openCheckoutModal(planKey);
        });
    });

    // Cerrar modal
    const closeBtns = modal.querySelectorAll('[data-close-checkout]');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeCheckoutModal();
        });
    });

    // Pestañas (Mercado Pago vs SPEI)
    const tabBtns = modal.querySelectorAll('.payment-tab-btn');
    const tabPanes = modal.querySelectorAll('.payment-tab-pane');

    tabBtns.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab-target');
            tabBtns.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // Botón de Mercado Pago → ejecuta Checkout Pro (con fallback automático)
    const mpBtn = document.getElementById('checkout-mp-button');
    if (mpBtn) {
        mpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetchMercadoPagoCheckout(currentCheckoutPlan);
        });
    }

    // Botón Copiar CLABE Interbancaria
    const copyBtn = document.getElementById('btn-copy-clabe');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const clabe = (CONFIG.PAYMENT_CONFIG && CONFIG.PAYMENT_CONFIG.SPEI && CONFIG.PAYMENT_CONFIG.SPEI.clabe) || '012180001234567890';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(clabe).then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = '<span>✓ ¡CLABE Copiada!</span>';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                        copyBtn.classList.remove('copied');
                    }, 2500);
                }).catch(() => {
                    prompt('Copia tu CLABE Interbancaria (18 dígitos):', clabe);
                });
            } else {
                prompt('Copia tu CLABE Interbancaria (18 dígitos):', clabe);
            }
        });
    }

    // Cerrar con tecla Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeCheckoutModal();
        }
    });

    // Cerrar haciendo clic en el backdrop oscurecido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCheckoutModal();
        }
    });
}

// Inicialización robusta para navegador
function initAll() {
    initSimulator();
    initFaqAccordion();
    initNavbarScroll();
    initLeadFormsAndCTAs();
    initCheckoutModal();
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
}

/* ==========================================================================
   MERCADO PAGO CHECKOUT PRO — Fetch al endpoint real
   ========================================================================== */

/**
 * Llama a POST /api/create-preference en el backend,
 * obtiene el init_point real de MP y redirige al checkout.
 */
async function fetchMercadoPagoCheckout(planKey) {
    const btn = document.getElementById('checkout-mp-button');
    setMpButtonLoading(btn);

    const key = (planKey || 'ONLINE').toUpperCase();
    const fallbackDirectUrl = (CONFIG.PAYMENT_CONFIG && CONFIG.PAYMENT_CONFIG.MERCADO_PAGO && CONFIG.PAYMENT_CONFIG.MERCADO_PAGO[key]);

    try {
        const response = await fetch('/api/create-preference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: key }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        const url = data.init_point || data.sandbox_init_point;
        if (!url) throw new Error('No se recibió URL de pago de Mercado Pago.');

        // Redirección oficial al checkout de Mercado Pago
        window.location.href = url;

    } catch (err) {
        console.warn('[MP Checkout Pro] Redirigiendo a enlace directo oficial:', err.message);
        if (fallbackDirectUrl) {
            window.location.href = fallbackDirectUrl;
            return;
        }
        resetMpButton();
        showMpError(err.message);
    }
}

function setMpButtonLoading(btn) {
    if (!btn) return;
    btn.disabled = true;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="animation: spin 1s linear infinite">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        <span>Conectando con Mercado Pago...</span>
    `;
}

function resetMpButton() {
    const btn = document.getElementById('checkout-mp-button');
    if (!btn) return;
    btn.disabled = false;
    if (btn.dataset.originalHtml) {
        btn.innerHTML = btn.dataset.originalHtml;
    } else {
        btn.innerHTML = `
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z"/>
            </svg>
            <span>Pagar Seguro con Mercado Pago &rarr;</span>
        `;
    }
}

function showMpError(msg) {
    const container = document.getElementById('tab-pane-mp');
    if (!container) return;
    const existing = container.querySelector('.mp-error-alert');
    if (existing) existing.remove();
    const alert = document.createElement('div');
    alert.className = 'mp-error-alert';
    alert.style.cssText = 'background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:0.75rem 1rem;margin-top:0.75rem;color:#991B1B;font-size:0.9rem;font-weight:600;';
    alert.textContent = `⚠️ No se pudo conectar con Mercado Pago. Intenta de nuevo o usa SPEI. (${msg})`;
    container.appendChild(alert);
    setTimeout(() => alert.remove(), 8000);
}

// Exponer al objeto global para acceso directo e infalible en browser
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.buildWhatsAppUrl = buildWhatsAppUrl;
    window.formatCurrency = formatCurrency;
    window.PRICING_PLANS = PRICING_PLANS;
    window.buildEmailConfirmUrl = buildEmailConfirmUrl;
    window.openCheckoutModal = openCheckoutModal;
    window.closeCheckoutModal = closeCheckoutModal;
    window.fetchMercadoPagoCheckout = fetchMercadoPagoCheckout;
}

/* CSS de animación de carga — inyectado dinámicamente */
(function injectSpinCSS() {
    if (document.getElementById('mp-spin-style')) return;
    const style = document.createElement('style');
    style.id = 'mp-spin-style';
    style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
})();
