/**
 * GRUPO MODALIDAD 40 - NÚCLEO Y UTILIDADES
 * Exportable para Node.js, pruebas unitarias y orquestación Swarm
 */

export const CONFIG = {
    PHONE: '5212206494278', // Teléfono Asesoría Oficial +52 1 220 649 4278
    UMA_DIARIA_2026: 117.31,
    DIAS_MES_PROMEDIO: 30.4,
    FACTOR_COSTO_M40_2026: 0.14438
};

export function formatCurrency(val) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0
    }).format(val);
}

export function buildWhatsAppUrl(params) {
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

export const PRICING_PLANS = {
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
        subtitle: 'Atención personalizada en oficina física con revisión documental cara a cara y acompañamiento total.',
        features: [
            'Todo lo incluido en el Plan Online',
            'Sesión privada presencial cara a cara con la asesora especialista en pensiones',
            'Revisión física y cotejo minucioso de documentos originales (historial, constancias, AFORE)',
            'Expediente físico impreso formal con proyecciones financieras y análisis de rentabilidad',
            'Acompañamiento y preparación para trámites en subdelegación y ventanilla del IMSS',
            'Soporte prioritario VIP directo con la licenciada por WhatsApp'
        ],
        whatsappMessage: 'Hola Asesora, me interesa contratar el Plan Presencial ($3,500 MXN con todo incluido) para mi asesoría de Modalidad 40.'
    }
};

export function buildPlanWhatsAppUrl(planKey) {
    const key = (planKey || '').toUpperCase();
    const plan = PRICING_PLANS[key];
    if (!plan) {
        return `https://wa.me/${CONFIG.PHONE}`;
    }
    return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(plan.whatsappMessage)}`;
}

