/**
 * GRUPO MODALIDAD 40 - LÓGICA OFICIAL
 * Formulario Directo en el Hero (Nombre, Edad, Año de Inicio), Vinculación de CTAs y Simulador
 */

// Constantes Oficiales México 2026
const CONFIG = {
    PHONE: '528121912778', // Teléfono Asesoría Oficial +52 81 2191 2778
    UMA_DIARIA_2026: 117.31,
    DIAS_MES_PROMEDIO: 30.4,
    FACTOR_COSTO_M40_2026: 0.14438,
    PAYMENT_CONFIG: {
        MERCADO_PAGO: {
            banco: 'Mercado Pago',
            beneficiario: 'Sergio Adrian Perez Villarreal',
            clabe: '722969017074087021',
            concepto: 'Asesoria M40'
        },
        SPIN: {
            banco: 'Spin by OXXO',
            beneficiario: 'Sergio Adrian Perez Villarreal',
            cuenta: '728969000127902158',
            concepto: 'Asesoria M40'
        },
        SPEI: {
            banco: 'Mercado Pago',
            beneficiario: 'Sergio Adrian Perez Villarreal',
            clabe: '722969017074087021',
            concepto: 'Asesoria M40'
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

function buildEmailConfirmUrl(planKey, method = 'MERCADO_PAGO') {
    const key = (planKey || '').toUpperCase();
    const plan = PRICING_PLANS[key] || PRICING_PLANS.ONLINE;
    const methodName = (method || '').toUpperCase() === 'SPIN' ? 'Spin by OXXO' : 'Mercado Pago (SPEI)';
    const subject = encodeURIComponent(`Comprobante de Pago ${methodName} - ${plan.name} (${plan.priceFormatted})`);
    const body = encodeURIComponent(`Hola, acabo de realizar el pago de ${plan.name} (${plan.priceFormatted}) vía ${methodName}. Adjunto mi comprobante para iniciar mi expediente y agendar mi asesoría.`);
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
    const oxxoAmountEl = document.getElementById('checkout-oxxo-amount');
    const speiRefEl = document.getElementById('checkout-spei-ref');
    const oxxoRefEl = document.getElementById('checkout-oxxo-ref');

    if (planNameEl) planNameEl.textContent = plan.name;
    if (planPriceEl) planPriceEl.textContent = plan.priceFormatted;
    if (speiAmountEl) speiAmountEl.textContent = plan.priceFormatted;
    if (oxxoAmountEl) oxxoAmountEl.textContent = plan.priceFormatted;
    if (speiRefEl) speiRefEl.textContent = plan.name;
    if (oxxoRefEl) oxxoRefEl.textContent = plan.name;

    // Actualizar el enlace de confirmación por correo (Mercado Pago SPEI)
    const emailConfirmEl = document.getElementById('checkout-email-confirm');
    if (emailConfirmEl) {
        emailConfirmEl.href = buildEmailConfirmUrl(key, 'MERCADO_PAGO');
    }

    // Actualizar el enlace de confirmación por correo (Spin OXXO)
    const oxxoEmailConfirmEl = document.getElementById('checkout-oxxo-email-confirm');
    if (oxxoEmailConfirmEl) {
        oxxoEmailConfirmEl.href = buildEmailConfirmUrl(key, 'SPIN');
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

    // Pestañas (Mercado Pago vs Spin by OXXO)
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

    // Botón Copiar CLABE Interbancaria (Mercado Pago)
    const copyBtn = document.getElementById('btn-copy-clabe');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const clabe = (CONFIG.PAYMENT_CONFIG && CONFIG.PAYMENT_CONFIG.MERCADO_PAGO && CONFIG.PAYMENT_CONFIG.MERCADO_PAGO.clabe) || '722969017074087021';
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
                    prompt('Copia la CLABE de Mercado Pago (18 dígitos):', clabe);
                });
            } else {
                prompt('Copia la CLABE de Mercado Pago (18 dígitos):', clabe);
            }
        });
    }

    // Botón Copiar Cuenta Spin by OXXO
    const copySpinBtn = document.getElementById('btn-copy-spin');
    if (copySpinBtn) {
        copySpinBtn.addEventListener('click', () => {
            const cuentaSpin = (CONFIG.PAYMENT_CONFIG && CONFIG.PAYMENT_CONFIG.SPIN && CONFIG.PAYMENT_CONFIG.SPIN.cuenta) || '728969000127902158';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(cuentaSpin).then(() => {
                    const originalText = copySpinBtn.innerHTML;
                    copySpinBtn.classList.add('copied');
                    copySpinBtn.innerHTML = '<span>✓ ¡Cuenta Copiada!</span>';
                    setTimeout(() => {
                        copySpinBtn.innerHTML = originalText;
                        copySpinBtn.classList.remove('copied');
                    }, 2500);
                }).catch(() => {
                    prompt('Copia el número de cuenta Spin (18 dígitos):', cuentaSpin);
                });
            } else {
                prompt('Copia el número de cuenta Spin (18 dígitos):', cuentaSpin);
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

/* ==========================================================================
   LÓGICA DEL ASISTENTE VIRTUAL / CHATBOT LEY 73 (INTEGRADO EN APP.JS)
   ========================================================================== */
const CHATBOT_KNOWLEDGE = {
    QUE_ES_M40: `La **Modalidad 40** (Continuación Voluntaria en el Régimen Obligatorio) es un derecho contemplado en el Artículo 218 de la Ley del Seguro Social de 1973.\n\nTe permite seguir cotizando por tu cuenta al IMSS tras causar baja patronal, eligiendo registrarte con un salario superior (hasta el tope de 25 UMAs). Esto eleva el promedio salarial de tus últimas 250 semanas y suma semanas cotizadas, permitiendo alcanzar pensiones mensuales de $30,000, $45,000 o más de $50,000 MXN legalmente.`,
    CUANTO_PENSION: `**Cada caso es único y particular.** Depende de tus semanas reconocidas ante el IMSS, tu edad de retiro y tu salario promedio de las últimas 250 semanas cotizadas.\n\nPara darte números reales y auditables, realizamos la simulación exacta dentro de tu **estudio de pensión** personalizado.`,
    CUANTO_PAGO: `El costo mensual en Modalidad 40 no es una cuota fija: **depende exclusivamente del salario con el que decidas registrarte** ante el IMSS (puedes cotizar desde tu último salario hasta 25 UMAs).\n\nEn 2026, la cuota es del 14.438% del salario cotizado. En tu asesoría calculamos el **escenario con mayor retorno de inversión (ROI)** para que no pagues de más al IMSS si no es estrictamente necesario.`,
    GARANTIA_LEGAL: `🛡️ **Garantía y Apego Legal Estricto:**\nEn Grupo Modalidad 40 nos regimos 100% bajo la Ley del Seguro Social de 1973 y sus reglamentos vigentes.\n\nLas cuotas de tu pensión **se pagan directa y exclusivamente al IMSS, no al despacho** ni a intermediarios, mediante línea de captura oficial SIPARE en ventanilla bancaria. Nuestro servicio corresponde a la consultoría, auditoría, cálculo de ROI y diseño de tu estrategia de pensión.`,
    COSTOS_PLANES: `Contamos con 2 esquemas oficiales transparentes (pago único sin cobros mensuales):\n• **Plan Online ($2,500 MXN):** Auditoría digital de semanas, cálculo de ROI, desglose de inversión, carpeta en PDF y videollamada 1 a 1.\n• **Plan Presencial ($3,500 MXN):** Todo lo del Plan Online más sesión presencial cara a cara en café o lugar acordado en Monterrey/NL, revisión física de documentos originales y expediente impreso formal.`,
    FORMAS_PAGO: `Aceptamos pagos 100% seguros y con acreditación inmediata:\n• **Mercado Pago:** Transferencia SPEI directa a CLABE oficial sin comisiones.\n• **Spin by OXXO:** Depósito en efectivo en cualquier OXXO del país o transferencia a cuenta Spin.\n• Al pagar, recibes confirmación por correo y WhatsApp de inmediato.`
};

function buildChatbotWhatsAppUrl(leadData = {}) {
    const { calificaLey73, regimen, tiempoBaja, ubicacion, planInteres } = leadData || {};
    const phone = CONFIG.PHONE || '528121912778';

    let ubicacionTexto = 'Por especificar';
    if (ubicacion) {
        const ubiUpper = ubicacion.toUpperCase();
        if (ubiUpper.includes('MONTERREY')) {
            ubicacionTexto = 'Monterrey / Área Metropolitana (NL)';
        } else if (ubiUpper.includes('FORANEO') || ubiUpper.includes('OTRO')) {
            ubicacionTexto = 'Otro estado de la República';
        } else {
            ubicacionTexto = ubicacion;
        }
    }

    const lines = [
        'Hola Asesora, completé el Diagnóstico Express en la web de Grupo Modalidad 40:',
        '',
        '📋 RESUMEN DE MI PERFIL:',
        `• Régimen: ${regimen || (calificaLey73 ? 'Ley 73 (Inició antes de julio 1997)' : 'Ley 97 / Por revisar')}`,
        `• Última baja patronal: ${tiempoBaja || 'Por detallar'}`,
        `• Ubicación: ${ubicacionTexto}`,
        `• Esquema de interés: ${planInteres || 'Deseo recomendación de la asesora'}`,
        '',
        '¿Me apoya revisando mis opciones para maximizar mi pensión con la Ley 73?'
    ];

    return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function createChatbotEngine() {
    const leadData = {
        calificaLey73: null,
        regimen: null,
        tiempoBaja: null,
        ubicacion: null,
        planInteres: null
    };

    let currentStepId = 'welcome';

    const steps = {
        welcome: {
            id: 'welcome',
            text: `¡Hola! 👋 Te doy la bienvenida a **Grupo Modalidad 40**.\n\nSoy tu **Asistente Virtual** y en **1 minuto** te ayudaré a diagnosticar si eres candidato ideal para multiplicar tu pensión mensual bajo el régimen de la **Ley 73 del IMSS**.`,
            options: [
                { id: 'start_diagnostico', label: '🚀 Iniciar Diagnóstico (1 min)' },
                { id: 'menu_faq', label: '❓ Preguntas Frecuentes' },
                { id: 'faq_que_es', label: '💡 ¿Qué es Modalidad 40?' }
            ]
        },
        step_regimen: {
            id: 'step_regimen',
            text: `**Paso 1 de 3 (Filtro de Régimen):**\n¿Empezaste a cotizar ante el IMSS formalmente **antes del 1 de julio de 1997**?`,
            options: [
                { id: 'regimen_ley73', label: '✅ SÍ (Antes del 1 de julio de 1997)' },
                { id: 'regimen_ley97', label: '❌ NO (En o después de julio 1997)' },
                { id: 'regimen_duda', label: '🤔 No estoy seguro(a)' }
            ]
        },
        descalifica_ley97: {
            id: 'descalifica_ley97',
            text: `⚠️ **Diagnóstico transparente y honesto:**\n\nLa Modalidad 40 está diseñada con alto rendimiento exclusivamente para el régimen **Ley 73** (donde tu pensión se calcula por el salario promedio de tus últimos 5 años cotizados).\n\nEn tu caso (**Ley 97**), este esquema no permite elevar tu pensión por salario promedio. **Por honestidad y ética profesional, este servicio no es aplicable para ti.**\n\nSi deseas resolver alguna duda específica sobre tu situación, con gusto te apoyamos por WhatsApp.`,
            options: [
                { id: 'action_wa_ley97', label: '📲 Consultar dudas por WhatsApp', isAction: true },
                { id: 'restart_bot', label: '🔄 Reiniciar diagnóstico' }
            ]
        },
        step_duda_regimen: {
            id: 'step_duda_regimen',
            text: `🔍 **Cómo saber si eres Ley 73 en 10 segundos:**\n\nRevisa tu Número de Seguridad Social (NSS) de 11 dígitos. Los **dígitos 3 y 4** (o 5 y 6 según formato) corresponden al año de tu primera alta patronal ante el IMSS.\n• Si dice del **70 al 96**: Eres Ley 73.\n• Si dice del **98 en adelante**: Eres Ley 97.\n• Si dice **97**: Depende de si fue antes o después del 1 de julio de 1997.\n\n¿Deseas continuar el diagnóstico como candidato a Ley 73?`,
            options: [
                { id: 'regimen_ley73', label: '✅ Sí, coticé antes de 1997 (Continuar)' },
                { id: 'action_wa_duda', label: '📲 Ayúdame a revisar mi NSS por WhatsApp', isAction: true },
                { id: 'restart_bot', label: '🔄 Reiniciar' }
            ]
        },
        step_tiempo_baja: {
            id: 'step_tiempo_baja',
            text: `¡Excelente! 🎉 Al ser **Ley 73** tienes el derecho legal de incrementar tu pensión hasta más de **$50,000 MXN mensuales**.\n\n**Paso 2 de 3 (Vigencia de Derechos):**\n¿Cuánto tiempo tienes desde tu última baja laboral con patrón ante el IMSS?`,
            options: [
                { id: 'baja_menos_5', label: '⚡ Menos de 5 años' },
                { id: 'baja_mas_5', label: '⚠️ Más de 5 años' },
                { id: 'baja_cotizando', label: '💼 Sigo cotizando actualmente' }
            ]
        },
        step_ubicacion: {
            id: 'step_ubicacion',
            text: `**Paso 3 de 3 (Ubicación de Atención):**\n¿Te encuentras en **Monterrey / Área Metropolitana de Nuevo León** o en otro estado de la República?`,
            options: [
                { id: 'ubicacion_monterrey', label: '📍 Monterrey / Área Metropolitana (NL)' },
                { id: 'ubicacion_foraneo', label: '🇲🇽 En otro estado del país' }
            ]
        },
        oferta_final: {
            id: 'oferta_final',
            text: '',
            options: []
        },
        faq_menu: {
            id: 'faq_menu',
            text: `📚 **Centro de Preguntas Frecuentes:**\nSelecciona el tema sobre el que deseas información oficial y directa:`,
            options: [
                { id: 'faq_que_es', label: '💡 ¿Qué es Modalidad 40?' },
                { id: 'faq_cuanto_pension', label: '📈 ¿Cuánto me tocará de pensión?' },
                { id: 'faq_cuanto_pago', label: '💵 ¿Cuánto debo pagar al mes?' },
                { id: 'faq_costos', label: '🏷️ Costos y qué incluye el servicio' },
                { id: 'faq_garantia', label: '🛡️ Garantía y apego legal' },
                { id: 'faq_pagos', label: '💳 Formas de pago aceptadas' },
                { id: 'start_diagnostico', label: '🚀 Iniciar Diagnóstico Ley 73' }
            ]
        },
        faq_que_es: {
            id: 'faq_que_es',
            text: CHATBOT_KNOWLEDGE.QUE_ES_M40,
            options: [
                { id: 'start_diagnostico', label: '🚀 Diagnosticar mi caso (1 min)' },
                { id: 'menu_faq', label: '🔙 Ver más preguntas' }
            ]
        },
        faq_cuanto_pension: {
            id: 'faq_cuanto_pension',
            text: CHATBOT_KNOWLEDGE.CUANTO_PENSION,
            options: [
                { id: 'start_diagnostico', label: '🚀 Diagnosticar si califico' },
                { id: 'action_wa_pension', label: '📲 Cotizar mi estudio por WhatsApp', isAction: true },
                { id: 'menu_faq', label: '🔙 Menú de preguntas' }
            ]
        },
        faq_cuanto_pago: {
            id: 'faq_cuanto_pago',
            text: CHATBOT_KNOWLEDGE.CUANTO_PAGO,
            options: [
                { id: 'start_diagnostico', label: '🚀 Iniciar Diagnóstico' },
                { id: 'menu_faq', label: '🔙 Menú de preguntas' }
            ]
        },
        faq_costos: {
            id: 'faq_costos',
            text: CHATBOT_KNOWLEDGE.COSTOS_PLANES,
            options: [
                { id: 'action_open_online', label: '💻 Ver Plan Online ($2,500 MXN)', isAction: true },
                { id: 'action_open_presencial', label: '👑 Ver Plan Presencial ($3,500 MXN)', isAction: true },
                { id: 'menu_faq', label: '🔙 Menú de preguntas' }
            ]
        },
        faq_garantia: {
            id: 'faq_garantia',
            text: CHATBOT_KNOWLEDGE.GARANTIA_LEGAL,
            options: [
                { id: 'start_diagnostico', label: '🚀 Diagnosticar mi pensión' },
                { id: 'menu_faq', label: '🔙 Menú de preguntas' }
            ]
        },
        faq_pagos: {
            id: 'faq_pagos',
            text: CHATBOT_KNOWLEDGE.FORMAS_PAGO,
            options: [
                { id: 'action_open_checkout', label: '💳 Ver Cuentas de Transferencia', isAction: true },
                { id: 'start_diagnostico', label: '🚀 Diagnosticar mi caso' }
            ]
        }
    };

    function buildOfertaFinalText() {
        const isMty = leadData.ubicacion === 'MONTERREY';
        let feedbackBaja = '';
        if (leadData.tiempoBaja === 'MENOS_5_ANIOS') {
            feedbackBaja = '⚡ **Estado de Vigencia:** Estás dentro de los 5 años; tu ventana para entrar directo o pagar retroactivo está completamente abierta.';
        } else if (leadData.tiempoBaja === 'MAS_5_ANIOS') {
            feedbackBaja = '⚠️ **Alerta de Vigencia:** Al superar los 5 años sin cotizar, requieres un plan de reactivación (52 semanas) antes de poder invertir.';
        } else {
            feedbackBaja = '💼 **Estado de Vigencia:** Sigues cotizando; es el momento idóneo para planear tu salida y salario objetivo.';
        }

        const painPoints = `⚠️ **3 RIESGOS CRÍTICOS A CONSIDERAR:**\n1. ⏳ **Prescripción:** Si dejas pasar 5 años sin cotizar, el IMSS cancela tu acceso a Modalidad 40.\n2. 💸 **Costo de no actuar:** Pensionarse con la mínima ($7,000 - $8,000) vs. optimizada ($40,000+) representa dejar de cobrar más de **$400,000 MXN al año** de por vida.\n3. 🚫 **Inversión a ciegas:** Invertir al tope de 25 UMAs sin auditar semanas reales ni calcular retorno de inversión suele provocar pagos innecesarios.`;

        let propuesta = '';
        if (isMty) {
            propuesta = `📍 **OFERTA EXCLUSIVA EN MONTERREY / ÁREA METROPOLITANA:**\nTienes acceso a nuestro servicio de mayor valor:\n\n⭐ **Plan Presencial ($3,500 MXN):** Sesión presencial cara a cara en un café o lugar neutral acordado, revisión física de documentos originales y entrega de expediente impreso formal.\n\n💻 **Plan Online ($2,500 MXN):** Si prefieres atención remota personalizada por videollamada.`;
        } else {
            propuesta = `🇲🇽 **OFERTA PARA TU CASO (PLAN ONLINE):**\n💻 **Plan Online ($2,500 MXN):** Auditoría digital de semanas, cálculo de retorno de inversión (ROI), carpeta digital formal en PDF y sesión 1 a 1 por videollamada con la especialista.`;
        }

        return `🎯 **¡DIAGNÓSTICO PRELIMINAR COMPLETADO!**\n\n${feedbackBaja}\n\n${painPoints}\n\n${propuesta}\n\n¿Deseas contratar tu plan o prefieres que un asesor te contacte por WhatsApp?`;
    }

    function buildOfertaFinalOptions() {
        const isMty = leadData.ubicacion === 'MONTERREY';
        if (isMty) {
            return [
                { id: 'action_contratar_presencial', label: '👑 Contratar Plan Presencial ($3,500 MXN)', isAction: true },
                { id: 'action_contratar_online', label: '💻 Contratar Plan Online ($2,500 MXN)', isAction: true },
                { id: 'action_wa_cierre', label: '📲 Hablar con Asesor en WhatsApp', isAction: true },
                { id: 'restart_bot', label: '🔄 Reiniciar Diagnóstico' }
            ];
        }
        return [
            { id: 'action_contratar_online', label: '💳 Ver Datos de Pago Plan Online ($2,500 MXN)', isAction: true },
            { id: 'action_wa_cierre', label: '📲 Agendar por WhatsApp con Asesor', isAction: true },
            { id: 'restart_bot', label: '🔄 Reiniciar Diagnóstico' }
        ];
    }

    function selectOption(optionId) {
        switch (optionId) {
            case 'start_diagnostico':
                currentStepId = 'step_regimen';
                break;
            case 'regimen_ley73':
                leadData.calificaLey73 = true;
                leadData.regimen = 'Ley 73 (Inició antes de julio 1997)';
                currentStepId = 'step_tiempo_baja';
                break;
            case 'regimen_ley97':
                leadData.calificaLey73 = false;
                leadData.regimen = 'Ley 97 (Inició en o después de julio 1997)';
                currentStepId = 'descalifica_ley97';
                break;
            case 'regimen_duda':
                currentStepId = 'step_duda_regimen';
                break;
            case 'baja_menos_5':
                leadData.tiempoBaja = 'MENOS_5_ANIOS';
                currentStepId = 'step_ubicacion';
                break;
            case 'baja_mas_5':
                leadData.tiempoBaja = 'MAS_5_ANIOS';
                currentStepId = 'step_ubicacion';
                break;
            case 'baja_cotizando':
                leadData.tiempoBaja = 'COTIZANDO_ACTUALMENTE';
                currentStepId = 'step_ubicacion';
                break;
            case 'ubicacion_monterrey':
                leadData.ubicacion = 'MONTERREY';
                currentStepId = 'oferta_final';
                break;
            case 'ubicacion_foraneo':
                leadData.ubicacion = 'FORANEO';
                currentStepId = 'oferta_final';
                break;
            case 'menu_faq':
                currentStepId = 'faq_menu';
                break;
            case 'faq_que_es':
                currentStepId = 'faq_que_es';
                break;
            case 'faq_cuanto_pension':
                currentStepId = 'faq_cuanto_pension';
                break;
            case 'faq_cuanto_pago':
                currentStepId = 'faq_cuanto_pago';
                break;
            case 'faq_costos':
                currentStepId = 'faq_costos';
                break;
            case 'faq_garantia':
                currentStepId = 'faq_garantia';
                break;
            case 'faq_pagos':
                currentStepId = 'faq_pagos';
                break;
            case 'restart_bot':
                leadData.calificaLey73 = null;
                leadData.regimen = null;
                leadData.tiempoBaja = null;
                leadData.ubicacion = null;
                leadData.planInteres = null;
                currentStepId = 'welcome';
                break;
            default:
                break;
        }

        return getCurrentStep();
    }

    function getCurrentStep() {
        if (currentStepId === 'oferta_final') {
            return {
                id: 'oferta_final',
                text: buildOfertaFinalText(),
                options: buildOfertaFinalOptions()
            };
        }
        return steps[currentStepId] || steps.welcome;
    }

    return {
        selectOption,
        getCurrentStep,
        getLeadData: () => ({ ...leadData }),
        setPlanInteres: (plan) => { leadData.planInteres = plan; }
    };
}

function initChatbotUI() {
    if (typeof document === 'undefined') return;

    const launcherBtn = document.getElementById('m40-bot-launcher');
    const chatWindow = document.getElementById('m40-bot-chat-window');
    if (!launcherBtn || !chatWindow) return;

    if (launcherBtn.getAttribute('data-bot-bound') === 'true') return;
    launcherBtn.setAttribute('data-bot-bound', 'true');

    const botEngine = createChatbotEngine();
    const closeBtn = document.getElementById('btn-bot-close');
    const resetBtn = document.getElementById('btn-bot-reset');
    const messagesEl = document.getElementById('m40-bot-messages');
    const optionsEl = document.getElementById('m40-bot-options');
    const typingEl = document.getElementById('m40-bot-typing');
    const teaserEl = document.getElementById('m40-bot-teaser');
    const closeTeaserBtn = document.getElementById('btn-close-teaser');
    const directWaBtn = document.getElementById('btn-bot-direct-wa');

    function toggleChat() {
        const isOpen = chatWindow.classList.contains('is-open');
        if (isOpen) {
            chatWindow.classList.remove('is-open');
        } else {
            chatWindow.classList.add('is-open');
            if (teaserEl) teaserEl.style.display = 'none';
            if (messagesEl && messagesEl.children.length === 0) {
                renderStep(botEngine.getCurrentStep());
            }
        }
    }

    launcherBtn.addEventListener('click', toggleChat);
    if (closeBtn) closeBtn.addEventListener('click', () => chatWindow.classList.remove('is-open'));
    if (closeTeaserBtn) {
        closeTeaserBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (teaserEl) teaserEl.style.display = 'none';
        });
    }
    if (teaserEl) {
        teaserEl.addEventListener('click', () => {
            if (!chatWindow.classList.contains('is-open')) toggleChat();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            botEngine.selectOption('restart_bot');
            if (messagesEl) messagesEl.innerHTML = '';
            if (optionsEl) optionsEl.innerHTML = '';
            renderStep(botEngine.getCurrentStep());
        });
    }

    function scrollToBottom() {
        if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function formatMarkdownText(text) {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    function addBotMessage(text) {
        if (!messagesEl) return;
        const msgEl = document.createElement('div');
        msgEl.className = 'bot-msg bot-msg-bot';
        msgEl.innerHTML = `
            <div class="bot-msg-avatar">👩‍💼</div>
            <div class="bot-bubble">${formatMarkdownText(text)}</div>
        `;
        messagesEl.appendChild(msgEl);
        scrollToBottom();
    }

    function addUserMessage(text) {
        if (!messagesEl) return;
        const msgEl = document.createElement('div');
        msgEl.className = 'bot-msg bot-msg-user';
        msgEl.innerHTML = `<div class="user-bubble">${text}</div>`;
        messagesEl.appendChild(msgEl);
        scrollToBottom();
    }

    function handleAction(actionId, leadData) {
        if (actionId === 'action_contratar_presencial') {
            leadData.planInteres = 'Plan Presencial ($3,500 MXN)';
            if (typeof window.openCheckoutModal === 'function') {
                window.openCheckoutModal('PRESENCIAL');
            }
        } else if (actionId === 'action_contratar_online' || actionId === 'action_open_online') {
            leadData.planInteres = 'Plan Online ($2,500 MXN)';
            if (typeof window.openCheckoutModal === 'function') {
                window.openCheckoutModal('ONLINE');
            }
        } else if (actionId === 'action_open_presencial') {
            leadData.planInteres = 'Plan Presencial ($3,500 MXN)';
            if (typeof window.openCheckoutModal === 'function') {
                window.openCheckoutModal('PRESENCIAL');
            }
        } else if (actionId === 'action_open_checkout') {
            if (typeof window.openCheckoutModal === 'function') {
                window.openCheckoutModal('ONLINE');
            }
        } else if (actionId === 'action_wa_cierre' || actionId === 'action_wa_pension') {
            const waUrl = buildChatbotWhatsAppUrl(leadData);
            window.open(waUrl, '_blank');
        } else if (actionId === 'action_wa_ley97') {
            const phone = CONFIG.PHONE || '528121912778';
            const url = `https://wa.me/${phone}?text=${encodeURIComponent('Hola, hice el diagnóstico en la web y coticé a partir de julio de 1997 (Ley 97). Quisiera consultar una duda sobre mi situación.')}`;
            window.open(url, '_blank');
        } else if (actionId === 'action_wa_duda') {
            const phone = CONFIG.PHONE || '528121912778';
            const url = `https://wa.me/${phone}?text=${encodeURIComponent('Hola, tengo duda sobre si soy Ley 73 o Ley 97 con mi NSS. ¿Me apoyan revisando?')}`;
            window.open(url, '_blank');
        }
    }

    function renderStep(step) {
        if (!optionsEl || !typingEl) return;
        optionsEl.innerHTML = '';
        typingEl.style.display = 'flex';
        scrollToBottom();

        setTimeout(() => {
            typingEl.style.display = 'none';
            addBotMessage(step.text);

            if (directWaBtn) {
                directWaBtn.href = buildChatbotWhatsAppUrl(botEngine.getLeadData());
                directWaBtn.target = '_blank';
                directWaBtn.rel = 'noopener';
            }

            if (step.options && step.options.length > 0) {
                step.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'bot-option-btn' + (opt.isAction ? ' is-action' : '');
                    btn.textContent = opt.label;

                    btn.addEventListener('click', () => {
                        addUserMessage(opt.label);
                        optionsEl.innerHTML = '';

                        if (opt.isAction) {
                            handleAction(opt.id, botEngine.getLeadData());
                        }

                        const nextStep = botEngine.selectOption(opt.id);
                        renderStep(nextStep);
                    });

                    optionsEl.appendChild(btn);
                });
                scrollToBottom();
            }
        }, 300);
    }

    // Auto-mostrar teaser tras 5 segundos
    setTimeout(() => {
        if (teaserEl && !chatWindow.classList.contains('is-open')) {
            teaserEl.classList.add('is-visible');
        }
    }, 4000);
}

// Inicializar en DOM listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotUI);
} else {
    initChatbotUI();
}

