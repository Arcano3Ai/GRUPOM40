/**
 * GRUPO MODALIDAD 40 - MOTOR DEL CHATBOT Y FUNNEL DE VENTAS
 * Diagnóstico rápido, filtro de calificación Ley 73, activación de dolor y oferta.
 */

import { CONFIG, PRICING_PLANS } from './core.js';

export const CHATBOT_KNOWLEDGE = {
    QUE_ES_M40: `La **Modalidad 40** (Continuación Voluntaria en el Régimen Obligatorio) es un derecho contemplado en el Artículo 218 de la Ley del Seguro Social de 1973. 

Te permite seguir cotizando por tu cuenta al IMSS tras causar baja patronal, eligiendo registrarte con un salario superior (hasta el tope de 25 UMAs). Esto eleva el promedio salarial de tus últimas 250 semanas y suma semanas cotizadas, permitiendo alcanzar pensiones mensuales de $30,000, $45,000 o más de $50,000 MXN legalmente.`,

    CUANTO_PENSION: `**Cada caso es único y particular.** Depende de tus semanas reconocidas ante el IMSS, tu edad de retiro y tu salario promedio de las últimas 250 semanas cotizadas.

Para darte números reales y auditables, realizamos la simulación exacta dentro de tu **estudio de pensión** personalizado.`,

    CUANTO_PAGO: `El costo mensual en Modalidad 40 no es una cuota fija: **depende exclusivamente del salario con el que decidas registrarte** ante el IMSS (puedes cotizar desde tu último salario hasta 25 UMAs).

En 2026, la cuota es del 14.438% del salario cotizado. En tu asesoría calculamos el **escenario con mayor retorno de inversión (ROI)** para que no pagues de más al IMSS si no es estrictamente necesario.`,

    GARANTIA_LEGAL: `🛡️ **Garantía y Apego Legal Estricto:**
En Grupo Modalidad 40 nos regimos 100% bajo la Ley del Seguro Social de 1973 y sus reglamentos vigentes.

Las cuotas de tu pensión **se pagan directa y exclusivamente al IMSS, no al despacho** ni a intermediarios, mediante línea de captura oficial SIPARE en ventanilla bancaria. Nuestro servicio corresponde a la consultoría, auditoría, cálculo de ROI y diseño de tu estrategia de pensión.`,

    COSTOS_PLANES: `Contamos con 2 esquemas oficiales transparentes (pago único sin cobros mensuales):
• **Plan Online ($2,500 MXN):** Auditoría digital de semanas, cálculo de ROI, desglose de inversión, carpeta en PDF y videollamada 1 a 1.
• **Plan Presencial ($3,500 MXN):** Todo lo del Plan Online más sesión presencial cara a cara en café o lugar acordado en Monterrey/NL, revisión física de documentos originales y expediente impreso formal.`,

    FORMAS_PAGO: `Aceptamos pagos 100% seguros y con acreditación inmediata:
• **Mercado Pago:** Transferencia SPEI directa a CLABE oficial sin comisiones.
• **Spin by OXXO:** Depósito en efectivo en cualquier OXXO del país o transferencia a cuenta Spin.
• Al pagar, recibes confirmación por correo y WhatsApp de inmediato.`
};

/**
 * Genera la URL de WhatsApp con el resumen de la calificación del lead
 */
export function buildChatbotWhatsAppUrl(leadData = {}) {
    const {
        calificaLey73,
        regimen,
        tiempoBaja,
        ubicacion,
        planInteres
    } = leadData || {};

    const phone = (typeof CONFIG !== 'undefined' && CONFIG.PHONE) ? CONFIG.PHONE : '528121912778';

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

/**
 * Motor del Chatbot / Embudo de Ventas
 */
export function createChatbotEngine() {
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
            text: `¡Hola! 👋 Te doy la bienvenida a **Grupo Modalidad 40**.

Soy tu **Asistente Virtual** y en **1 minuto** te ayudaré a diagnosticar si eres candidato ideal para multiplicar tu pensión mensual bajo el régimen de la **Ley 73 del IMSS**.`,
            options: [
                { id: 'start_diagnostico', label: '🚀 Iniciar Diagnóstico (1 min)' },
                { id: 'menu_faq', label: '❓ Preguntas Frecuentes' },
                { id: 'faq_que_es', label: '💡 ¿Qué es Modalidad 40?' }
            ]
        },

        step_regimen: {
            id: 'step_regimen',
            text: `**Paso 1 de 3 (Filtro de Régimen):**
¿Empezaste a cotizar ante el IMSS formalmente **antes del 1 de julio de 1997**?`,
            options: [
                { id: 'regimen_ley73', label: '✅ SÍ (Antes del 1 de julio de 1997)' },
                { id: 'regimen_ley97', label: '❌ NO (En o después de julio 1997)' },
                { id: 'regimen_duda', label: '🤔 No estoy seguro(a)' }
            ]
        },

        descalifica_ley97: {
            id: 'descalifica_ley97',
            text: `⚠️ **Diagnóstico transparente y honesto:**

La Modalidad 40 está diseñada con alto rendimiento exclusivamente para el régimen **Ley 73** (donde tu pensión se calcula por el salario promedio de tus últimos 5 años cotizados).

En tu caso (**Ley 97**), este esquema no permite elevar tu pensión por salario promedio. **Por honestidad y ética profesional, este servicio no es aplicable para ti.**

Si deseas resolver alguna duda específica sobre tu situación, con gusto te apoyamos por WhatsApp.`,
            options: [
                { id: 'action_wa_ley97', label: '📲 Consultar dudas por WhatsApp', isAction: true },
                { id: 'restart_bot', label: '🔄 Reiniciar diagnóstico' }
            ]
        },

        step_duda_regimen: {
            id: 'step_duda_regimen',
            text: `🔍 **Cómo saber si eres Ley 73 en 10 segundos:**

Revisa tu Número de Seguridad Social (NSS) de 11 dígitos. Los **dígitos 3 y 4** (o 5 y 6 según formato) corresponden al año de tu primera alta patronal ante el IMSS.
• Si dice del **70 al 96**: Eres Ley 73.
• Si dice del **98 en adelante**: Eres Ley 97.
• Si dice **97**: Depende de si fue antes o después del 1 de julio de 1997.

¿Deseas continuar el diagnóstico como candidato a Ley 73?`,
            options: [
                { id: 'regimen_ley73', label: '✅ Sí, coticé antes de 1997 (Continuar)' },
                { id: 'action_wa_duda', label: '📲 Ayúdame a revisar mi NSS por WhatsApp', isAction: true },
                { id: 'restart_bot', label: '🔄 Reiniciar' }
            ]
        },

        step_tiempo_baja: {
            id: 'step_tiempo_baja',
            text: `¡Excelente! 🎉 Al ser **Ley 73** tienes el derecho legal de incrementar tu pensión hasta más de **$50,000 MXN mensuales**.

**Paso 2 de 3 (Vigencia de Derechos):**
¿Cuánto tiempo tienes desde tu última baja laboral con patrón ante el IMSS?`,
            options: [
                { id: 'baja_menos_5', label: '⚡ Menos de 5 años' },
                { id: 'baja_mas_5', label: '⚠️ Más de 5 años' },
                { id: 'baja_cotizando', label: '💼 Sigo cotizando actualmente' }
            ]
        },

        step_ubicacion: {
            id: 'step_ubicacion',
            text: `**Paso 3 de 3 (Ubicación de Atención):**
¿Te encuentras en **Monterrey / Área Metropolitana de Nuevo León** o en otro estado de la República?`,
            options: [
                { id: 'ubicacion_monterrey', label: '📍 Monterrey / Área Metropolitana (NL)' },
                { id: 'ubicacion_foraneo', label: '🇲🇽 En otro estado del país' }
            ]
        },

        oferta_final: {
            id: 'oferta_final',
            text: '', // Generado dinámicamente según leadData
            options: []
        },

        faq_menu: {
            id: 'faq_menu',
            text: `📚 **Centro de Preguntas Frecuentes:**
Selecciona el tema sobre el que deseas información oficial y directa:`,
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

        const painPoints = `⚠️ **3 RIESGOS CRÍTICOS A CONSIDERAR:**
1. ⏳ **Prescripción:** Si dejas pasar 5 años sin cotizar, el IMSS cancela tu acceso a Modalidad 40.
2. 💸 **Costo de no actuar:** Pensionarse con la mínima ($7,000 - $8,000) vs. optimizada ($40,000+) representa dejar de cobrar más de **$400,000 MXN al año** de por vida.
3. 🚫 **Inversión a ciegas:** Invertir al tope de 25 UMAs sin auditar semanas reales ni calcular retorno de inversión suele provocar pagos innecesarios.`;

        let propuesta = '';
        if (isMty) {
            propuesta = `📍 **OFERTA EXCLUSIVA EN MONTERREY / ÁREA METROPOLITANA:**
Tienes acceso a nuestro servicio de mayor valor:

⭐ **Plan Presencial ($3,500 MXN):** Sesión presencial cara a cara en un café o lugar neutral acordado, revisión física de documentos originales y entrega de expediente impreso formal.

💻 **Plan Online ($2,500 MXN):** Si prefieres atención remota personalizada por videollamada.`;
        } else {
            propuesta = `🇲🇽 **OFERTA PARA TU CASO (PLAN ONLINE):**
💻 **Plan Online ($2,500 MXN):** Auditoría digital de semanas, cálculo de retorno de inversión (ROI), carpeta digital formal en PDF y sesión 1 a 1 por videollamada con la especialista.`;
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

/**
 * LÓGICA DE UI PARA NAVEGADOR WEB
 */
export function initChatbotUI() {
    if (typeof document === 'undefined') return;

    // Evitar doble inyección
    if (document.getElementById('m40-bot-widget-container')) return;

    const botEngine = createChatbotEngine();

    // Crear contenedor de botones apilados para ubicarlo sobre el botón actual de la esquina
    const botContainer = document.createElement('div');
    botContainer.id = 'm40-bot-widget-container';
    botContainer.className = 'm40-bot-widget-container';

    botContainer.innerHTML = `
        <!-- Tooltip emergente de invitación -->
        <div class="m40-bot-teaser" id="m40-bot-teaser">
            <span class="teaser-icon">💬</span>
            <div class="teaser-content">
                <strong>¿Calificas para Ley 73?</strong>
                <span>Diagnóstico Express en 1 min</span>
            </div>
            <button type="button" class="teaser-close" id="btn-close-teaser" aria-label="Cerrar aviso">&times;</button>
        </div>

        <!-- Botón Lanzador del Bot (Directo sobre el botón actual) -->
        <button type="button" class="m40-bot-launcher-btn" id="m40-bot-launcher" aria-label="Abrir Asistente Virtual y Diagnóstico de Pensión" title="Asistente Virtual Ley 73">
            <div class="bot-launcher-avatar">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18 2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5Z"/>
                </svg>
            </div>
            <span class="bot-launcher-badge">1</span>
        </button>

        <!-- Ventana de Chat Flotante -->
        <div class="m40-bot-chat-window" id="m40-bot-chat-window" role="dialog" aria-label="Asistente Virtual Modalidad 40">
            <!-- Header -->
            <div class="m40-bot-header">
                <div class="bot-header-advisor">
                    <div class="bot-avatar-wrap">
                        <div class="bot-avatar-inner">👩‍💼</div>
                        <span class="bot-status-dot" title="En línea"></span>
                    </div>
                    <div class="bot-advisor-info">
                        <h4 class="bot-advisor-name">Asesora Virtual M40</h4>
                        <span class="bot-advisor-sub">🟢 Diagnóstico y Calificación Ley 73</span>
                    </div>
                </div>
                <div class="bot-header-actions">
                    <button type="button" class="btn-bot-header" id="btn-bot-reset" title="Reiniciar conversación" aria-label="Reiniciar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                            <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>
                        </svg>
                    </button>
                    <button type="button" class="btn-bot-header" id="btn-bot-close" title="Cerrar chat" aria-label="Cerrar">&times;</button>
                </div>
            </div>

            <!-- Cuerpo de Mensajes -->
            <div class="m40-bot-body" id="m40-bot-messages"></div>

            <!-- Indicador de Escribiendo... -->
            <div class="m40-bot-typing" id="m40-bot-typing" style="display:none;">
                <span></span><span></span><span></span>
            </div>

            <!-- Contenedor de Botones de Opciones / Quick Replies -->
            <div class="m40-bot-options-bar" id="m40-bot-options"></div>

            <!-- Footer rápido con pase a WhatsApp humano -->
            <div class="m40-bot-footer">
                <a href="#" id="btn-bot-direct-wa" class="bot-footer-wa-link">
                    <span>📱 ¿Dudas directas? Habla con un Asesor por WhatsApp &rarr;</span>
                </a>
            </div>
        </div>
    `;

    document.body.appendChild(botContainer);

    const launcherBtn = document.getElementById('m40-bot-launcher');
    const chatWindow = document.getElementById('m40-bot-chat-window');
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
            // Si está vacío, iniciar
            if (messagesEl.children.length === 0) {
                renderStep(botEngine.getCurrentStep());
            }
        }
    }

    if (launcherBtn) launcherBtn.addEventListener('click', toggleChat);
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
            messagesEl.innerHTML = '';
            optionsEl.innerHTML = '';
            renderStep(botEngine.getCurrentStep());
        });
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
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
            const phone = (CONFIG && CONFIG.PHONE) ? CONFIG.PHONE : '528121912778';
            const url = `https://wa.me/${phone}?text=${encodeURIComponent('Hola, hice el diagnóstico en la web y coticé a partir de julio de 1997 (Ley 97). Quisiera consultar una duda sobre mi situación.')}`;
            window.open(url, '_blank');
        } else if (actionId === 'action_wa_duda') {
            const phone = (CONFIG && CONFIG.PHONE) ? CONFIG.PHONE : '528121912778';
            const url = `https://wa.me/${phone}?text=${encodeURIComponent('Hola, tengo duda sobre si soy Ley 73 o Ley 97 con mi NSS. ¿Me apoyan revisando?')}`;
            window.open(url, '_blank');
        }
    }

    function renderStep(step) {
        optionsEl.innerHTML = '';
        typingEl.style.display = 'flex';
        scrollToBottom();

        setTimeout(() => {
            typingEl.style.display = 'none';
            addBotMessage(step.text);

            // Actualizar enlace directo del footer
            if (directWaBtn) {
                directWaBtn.href = buildChatbotWhatsAppUrl(botEngine.getLeadData());
                directWaBtn.target = '_blank';
                directWaBtn.rel = 'noopener';
            }

            // Renderizar opciones
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
        }, 350);
    }

    // Auto-mostrar teaser tras 5 segundos o cuando el usuario interactúe
    setTimeout(() => {
        if (teaserEl && !chatWindow.classList.contains('is-open')) {
            teaserEl.classList.add('is-visible');
        }
    }, 5000);
}

// Inicialización automática
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbotUI);
    } else {
        initChatbotUI();
    }
}
