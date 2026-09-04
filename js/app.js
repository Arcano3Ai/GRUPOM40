/**
 * GRUPO MODALIDAD 40 - LÓGICA DE ALTA CONVERSIÓN
 * Control del Simulador Ley 73, Enlaces Dinámicos de WhatsApp y FAQs
 */

(function () {
    'use strict';

    // Parámetros y Constantes Oficiales México 2026
    const CONFIG = {
        PHONE: '528120388113', // Teléfono Asesoría Oficial
        UMA_DIARIA_2026: 117.31,
        DIAS_MES_PROMEDIO: 30.4,
        FACTOR_COSTO_M40_2026: 0.14438, // 14.438% para 2026
    };

    // Helper para formatear moneda en Pesos Mexicanos (MXN)
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0
        }).format(val);
    };

    // Helper para generar URLs de WhatsApp con mensaje codificado
    const buildWhatsAppUrl = (text) => {
        return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text)}`;
    };

    /* ==========================================================================
       SIMULADOR DE PENSIÓN EXPRÉS LEY 73
       ========================================================================== */
    const initSimulator = () => {
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

            // Actualizar etiquetas de sliders
            if (weeksDisplay) weeksDisplay.textContent = `${currentWeeks} semanas`;
            if (yearsDisplay) yearsDisplay.textContent = `${yearsInM40} ${yearsInM40 === 1 ? 'año' : 'años'}`;

            // Semanas adicionales por cotizar en M40 (52 semanas por año)
            const addedWeeks = yearsInM40 * 52;
            const finalWeeks = currentWeeks + addedWeeks;
            if (totalWeeksDisplay) totalWeeksDisplay.textContent = `${finalWeeks} sem`;

            // Salario Mensual Topado o seleccionado en M40
            const salarioMensualM40 = targetUmas * CONFIG.UMA_DIARIA_2026 * CONFIG.DIAS_MES_PROMEDIO;

            // Salario Promedio de las últimas 250 semanas (5 años)
            // Asumimos un salario anterior base aproximado de $14,000 mensuales
            const prevSalaryEstimate = 14000;
            let avgSalary = 0;

            if (yearsInM40 >= 5) {
                avgSalary = salarioMensualM40;
            } else {
                avgSalary = ((salarioMensualM40 * yearsInM40) + (prevSalaryEstimate * (5 - yearsInM40))) / 5;
            }

            // Factores Ley 73 (Cuantía Básica e Incrementos)
            // Para >6 UMAs aplica factor estándar aproximado: 13% cuantía básica y 2.45% incrementos anuales
            const factorCuantia = 0.13;
            const factorIncremento = 0.0245;

            const cuantiaBasica = avgSalary * factorCuantia;
            let semanasExcedentes = (finalWeeks - 500) / 52;
            if (semanasExcedentes < 0) semanasExcedentes = 0;

            const incrementos = avgSalary * factorIncremento * semanasExcedentes;
            const pensionBase = cuantiaBasica + incrementos;

            // Asumiendo retiro a los 60 años con 75% o 65 con 100% (usamos 85% promedio 62 años como proyección atractiva y realista)
            const factorEdad = 0.85; 
            // +15% de ayuda asistencial / asignación familiar obligatoria por ley
            const factorAsignacion = 1.15; 
            // +11% Decreto Fox (factor 1.11)
            const factorFox = 1.11;

            let pensionEstimada = (pensionBase * factorEdad * factorAsignacion) * factorFox;

            // Costo de inversión mensual en M40 para 2026
            const costoMensual = salarioMensualM40 * CONFIG.FACTOR_COSTO_M40_2026;

            // Renderizar resultados
            pensionResultDisplay.textContent = formatCurrency(pensionEstimada);
            if (costResultDisplay) costResultDisplay.textContent = formatCurrency(costoMensual);

            // Actualizar CTA de WhatsApp con datos pre-cargados
            const waMessage = `Hola Asesora, realicé mi cálculo en el simulador de Grupo Modalidad 40:
- Tengo actualmente: ${currentWeeks} semanas cotizadas.
- Deseo invertir: ${yearsInM40} años en Modalidad 40 (${targetUmas} UMAs).
- Pensión estimada en el simulador: ${formatCurrency(pensionEstimada)} / mes.
¿Me apoya revisando si soy candidato Ley 73 y cuál sería mi estrategia exacta?`;

            if (simCtaBtn) {
                simCtaBtn.href = buildWhatsAppUrl(waMessage);
            }
        };

        // Escuchar eventos
        weeksSlider.addEventListener('input', calculate);
        yearsSlider.addEventListener('input', calculate);
        salarySelect.addEventListener('change', calculate);

        // Ejecutar cálculo inicial
        calculate();
    };

    /* ==========================================================================
       ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
       ========================================================================== */
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach((item) => {
            const questionBtn = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (!questionBtn || !answer) return;

            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Cerrar todos los demás acordeones
                faqItems.forEach((other) => {
                    other.classList.remove('active');
                    const otherAns = other.querySelector('.faq-answer');
                    if (otherAns) otherAns.style.maxHeight = null;
                });

                // Si no estaba activo, abrirlo
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = `${answer.scrollHeight + 20}px`;
                }
            });
        });
    };

    /* ==========================================================================
       SCROLL NAVBAR EFFECT
       ========================================================================== */
    const initNavbarScroll = () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    };

    /* ==========================================================================
       TRACKING DE CLICS EN CTAs PARA OPTIMIZACIÓN
       ========================================================================== */
    const initCtaTracking = () => {
        const whatsappBtns = document.querySelectorAll('[data-cta-whatsapp]');
        whatsappBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const ctaLocation = btn.getAttribute('data-cta-whatsapp') || 'unknown';
                console.log(`[Conversión WhatsApp] Clic registrado en: ${ctaLocation}`);
            });
        });
    };

    // Inicializar al cargar el DOM
    document.addEventListener('DOMContentLoaded', () => {
        initSimulator();
        initFaqAccordion();
        initNavbarScroll();
        initCtaTracking();
    });

})();
