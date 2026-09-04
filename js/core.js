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

    const { nombre, edad, inicioLaboral } = params || {};
    const year = parseInt(inicioLaboral, 10);
    const ley73Status = (!isNaN(year) && year < 1997)
        ? '✅ Candidato a Régimen Ley 73 (Inició antes del 1 de julio de 1997)'
        : '⚠️ Inició cotizaciones en o después de 1997 (Requiere revisión de régimen)';

    const lines = [
        `👋 *Hola Asesora, solicito asesoría sobre Modalidad 40:*`,
        ``,
        `📋 *SITUACIÓN DEL CLIENTE:*`,
        `• *Nombre:* ${nombre ? nombre.trim() : 'No especificado'}`,
        `• *Edad:* ${edad ? edad : 'No especificada'} años`,
        `• *Año en que empezó a cotizar/trabajar:* ${inicioLaboral ? inicioLaboral : 'No especificado'}`,
        `• *Diagnóstico preliminar:* ${ley73Status}`,
        ``,
        `¿Me apoya revisando si soy candidato para pensión con la Ley 73 del IMSS?`
    ];

    return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}
