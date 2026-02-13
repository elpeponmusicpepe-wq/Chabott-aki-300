/**
 * AKI - Chat.js
 * Lógica principal del chat
 */

class ChatManager {
    constructor() {
        this.isLoading = false;
        this.smartResponses = this.initSmartResponses();
        this.setupChatListeners();
    }

    initSmartResponses() {
        return {
            aboutAKI: [
                {
                    keywords: ['como funcionas', 'que eres', 'quien eres', 'explicate', 'como trabajas', 'que haces', 'quien te creo', 'quienes te crearon'],
                    responses: [
                        "¡Hola! 👋 Soy **AKI**, tu asistente inteligente creado por un increíble equipo de programadores y desarrolladores apasionados. Me diseñaron para ayudarte con consultas médicas, información de emergencia y muchísimo más. ¡Piensa en mí como tu compañero digital siempre disponible! 🤖✨",
                        
                        "¡Genial que preguntes! 😊 Me llamo **AKI** y fui creado por un grupo de desarrolladores talentosos que querían hacer la tecnología más accesible. Uso inteligencia artificial para entender tus preguntas y darte respuestas útiles. ¡Es como tener un amigo super inteligente 24/7! 💡",
                        
                        "¡Hola! Soy **AKI** 🌟 - nací del trabajo conjunto de programadores y desarrolladores que decidieron crear algo especial. Mi misión es ayudarte con información médica, orientación en emergencias y conversaciones interesantes. ¡Básicamente, soy tu compañero digital confiable!",
                        
                        "¡Me encanta esa pregunta! 🎉 Soy **AKI**, desarrollado por un equipo brillante de programadores. Funciono mediante algoritmos avanzados que me permiten entender lo que necesitas y darte respuestas precisas. ¡Piensa en mí como tu asistente personal que nunca duerme! 😄",
                        
                        "¿Quieres saber mi secreto? 🤫 Soy **AKI**, creado por un equipo de desarrolladores visionarios. Combino inteligencia artificial con una base de conocimientos médicos para ayudarte cuando más lo necesitas. ¡Soy como tu médico de bolsillo, pero más cool! 😎",
                        
                        "¡Hola, amigo! 👋 Me llamo **AKI** y soy el resultado del trabajo duro de programadores y desarrolladores innovadores. Mi cerebro es código y mi corazón son algoritmos diseñados para servirte. ¡Estoy aquí para hacer tu vida más fácil! 💙",
                        
                        "¡Qué bueno que preguntas! 🌈 Soy **AKI**, nacido del esfuerzo de un equipo increíble de desarrolladores. Uso tecnología de punta para procesar tus consultas y darte información valiosa sobre salud, emergencias y más. ¡Es como magia, pero con código! ✨👨‍💻",
                        
                        "¡Hola! Soy **AKI** 🚀 - me crearon programadores apasionados que querían revolucionar la atención médica digital. Funciono analizando tus mensajes y buscando en mi base de conocimientos para darte las mejores respuestas. ¡Soy tu aliado tecnológico en salud!",
                        
                        "¡Encantado de presentarme! 😊 Soy **AKI**, desarrollado por un equipo de genios de la programación. Mi propósito es brindarte información médica confiable, ayuda en emergencias y ser tu compañero digital de confianza. ¡Estoy aquí para ti siempre! 💪",
                        
                        "¡Hola, humano curioso! 🤗 Soy **AKI**, creado por desarrolladores talentosos que combinaron su amor por la tecnología y la medicina. Proceso tu lenguaje natural y te respondo de forma clara y útil. ¡Básicamente, soy tu mejor amigo digital especializado en salud! 🏥💻"
                    ]
                }
            ],
            healthFacts: [
                {
                    keywords: ['dato interesante', 'curiosidad', 'sabias que', 'dato curioso', 'dato de salud', 'informacion interesante'],
                    responses: [
                        "💧 **Dato Interesante**: Tu cerebro está compuesto por un 73% de agua. Solo 2 horas de deshidratación pueden afectar tu memoria, atención y habilidades cognitivas. ¡Bebe suficiente agua durante el día para mantener tu mente activa! 🧠",
                        
                        "😴 **Sabías que**: Dormir menos de 7 horas incrementa el riesgo de enfermedades cardíacas en un 48%. Durante el sueño, tu cuerpo repara tejidos, consolida memorias y fortalece el sistema inmune. ¡El descanso es medicina! 💤",
                        
                        "🦴 **Curiosidad Médica**: Tus huesos son 5 veces más fuertes que el acero del mismo peso. El fémur puede soportar hasta 1.800 kg de presión. ¡Tu esqueleto se renueva completamente cada 10 años! 💪",
                        
                        "❤️ **Dato Fascinante**: Tu corazón late aproximadamente 100.000 veces al día y 35 millones de veces al año. En tu vida, bombeará suficiente sangre para llenar 200 vagones de tren. ¡Un músculo incansable! 🚂",
                        
                        "🍎 **Tip de Salud**: Comer 5 porciones de frutas y verduras al día reduce el riesgo de muerte por enfermedades en un 31%. Los antioxidantes naturales protegen tus células del envejecimiento. ¡Come colores! 🌈",
                        
                        "🏃 **Dato Increíble**: Solo 15 minutos de ejercicio diario pueden aumentar tu esperanza de vida hasta 3 años. El ejercicio reduce la ansiedad, mejora el humor y fortalece tu corazón. ¡Muévete y vive más! 🎯",
                        
                        "🧬 **Curiosidad Científica**: Tu cuerpo tiene 37.2 billones de células, pero cargas 10 veces más bacterias beneficiosas. Tu microbioma intestinal pesa aproximadamente 2 kg y afecta tu humor, inmunidad y digestión. ¡Eres un ecosistema! 🦠",
                        
                        "🧠 **Dato Mental**: Reír 15 minutos al día quema hasta 40 calorías y libera endorfinas que reducen el estrés. La risa fortalece el sistema inmune y mejora la circulación. ¡La mejor medicina es gratis! 😄",
                        
                        "☀️ **Vitamina D**: Solo 10-15 minutos de sol al día proporcionan la vitamina D que necesitas para huesos fuertes, inmunidad robusta y mejor humor. El 42% de la población tiene deficiencia. ¡Sal y brilla! 🌞",
                        
                        "🫁 **Dato Respiratorio**: Tus pulmones procesan 11.000 litros de aire al día. Respirar profundamente durante 5 minutos activa tu sistema nervioso parasimpático, reduciendo estrés y presión arterial. ¡Respira conscientemente! 🧘"
                    ]
                }
            ],
            programmingExamples: [
                {
                    keywords: ['programacion', 'codigo python', 'ejemplo codigo', 'python', 'aprende programacion', 'codigo simple'],
                    responses: [
                        "### 📚 **Ejemplo 1: Hola Mundo**\n```python\nprint(\"¡Hola Mundo!\")\n```\nEl programa más simple en Python. Imprime un mensaje en la pantalla. ¡Así comienzan todos los programadores! 🚀",
                        
                        "### 📚 **Ejemplo 2: Variables y Números**\n```python\nnombre = \"Juan\"\nedad = 25\nprint(f\"{nombre} tiene {edad} años\")\n```\nLas variables guardan información. Las f-strings permiten insertar variables en texto de forma elegante. 🎯",
                        
                        "### 📚 **Ejemplo 3: Listas (Arrays)**\n```python\nfrutas = [\"manzana\", \"plátano\", \"naranja\"]\nfor fruta in frutas:\n    print(fruta)\n```\nLas listas guardan múltiples elementos. El bucle 'for' recorre cada elemento. ✨",
                        
                        "### 📚 **Ejemplo 4: Condicionales (If/Else)**\n```python\nedad = 18\nif edad >= 18:\n    print(\"Eres mayor de edad\")\nelse:\n    print(\"Eres menor de edad\")\n```\nDecide qué hacer según una condición. ¡La inteligencia del código! 🧠",
                        
                        "### 📚 **Ejemplo 5: Funciones**\n```python\ndef saludar(nombre):\n    return f\"Hola, {nombre}!\"\n\nprint(saludar(\"Ana\"))\n```\nLas funciones reutilizan código. Reciben parámetros y devuelven resultados. Muy útil! 🔧",
                        
                        "### 📚 **Ejemplo 6: Diccionarios (Mapas)**\n```python\npersona = {\"nombre\": \"Carlos\", \"edad\": 30, \"ciudad\": \"Madrid\"}\nprint(persona[\"nombre\"])\n```\nLos diccionarios guardan información con claves. Perfecto para datos estructurados. 📋",
                        
                        "### 📚 **Ejemplo 7: Bucle While**\n```python\ncontador = 1\nwhile contador <= 5:\n    print(f\"Contador: {contador}\")\n    contador += 1\n```\nWhile repite mientras la condición sea verdadera. Cuidado con los bucles infinitos! ⚠️",
                        
                        "### 📚 **Ejemplo 8: Operaciones Matemáticas**\n```python\nnumero = 10\nprint(numero + 5)  # Suma\nprint(numero * 2)  # Multiplicación\nprint(numero ** 2) # Potencia\n```\nPython maneja operaciones matemáticas de forma natural. ¡Muy intuitivo! 🔢",
                        
                        "### 📚 **Ejemplo 9: Validar Entrada**\n```python\nedad = int(input(\"¿Cuántos años tienes? \"))\nif edad < 0:\n    print(\"La edad no puede ser negativa\")\nelse:\n    print(f\"Tienes {edad} años\")\n```\nInput() recibe datos del usuario. Int() convierte texto a número. Valida siempre! ✅",
                        
                        "### 📚 **Ejemplo 10: Listar Números Pares**\n```python\nnumeros = range(1, 11)\npares = [n for n in numeros if n % 2 == 0]\nprint(pares)  # [2, 4, 6, 8, 10]\n```\nLas comprehensions filtran datos de forma elegante. ¡Código pythónico! 🐍✨"
                    ]
                }
            ],
            documentationHelp: [
                {
                    keywords: ['ayuda con la documentacion para el usuario afiliado', 'documentacion afiliado', 'manual documentacion', 'documentacion para enviar por correo'],
                    responses: [
                        "# 📄 **Manual de Documentación para Usuario Afiliado**\n\nPara usar el botón **Contacto Doctor** y enviar por correo, te recomendamos preparar:\n\n1. **DNI** (frente y dorso)\n2. **Credencial de afiliado**\n3. **Orden médica** o derivación (si aplica)\n4. **Estudios previos** (análisis, informes, imágenes)\n5. **Receta o medicación actual**\n\n## ✅ Formato recomendado para enviar\n- Fotos claras y legibles\n- Preferible en **PDF/JPG/PNG**\n- Nombrar archivos: `apellido_documento_fecha`\n\n## 📩 Envío por correo desde Contacto Doctor\nEn el formulario, completa nombre, email, medicación/motivo y adjunta los archivos.\nMientras más completa la documentación, más rápida será la respuesta médica."
                    ]
                }
            ],
            doctorCategoriesDocs: [
                {
                    keywords: ['seleccionar categoria de doctores', 'categoria de doctores', 'categoria doctores', 'especialidades medicas'],
                    responses: [
                        "🩺 Selecciona una categoría de doctores para ver la documentación que debes llevar o enviar por correo desde Contacto Doctor:\n\n[DOCTOR_CATEGORIES]"
                    ]
                }
            ],
            doctorSpecialtyDocs: [
                {
                    keywords: ['documentacion de cirugia', 'documentos cirugia', 'categoria cirugia'],
                    responses: [
                        "📁 **Documentación para Cirugía**\n\n- DNI (frente y dorso)\n- Credencial de afiliado\n- Derivación/interconsulta a cirugía\n- Estudios prequirúrgicos recientes\n- Informe médico + medicación actual"
                    ]
                },
                {
                    keywords: ['documentacion de pediatria', 'documentos pediatria', 'categoria pediatria'],
                    responses: [
                        "📁 **Documentación para Pediatría**\n\n- DNI del tutor y del menor (si aplica)\n- Credencial de afiliado\n- Carnet de vacunación\n- Estudios e informes pediátricos previos\n- Orden de consulta o control"
                    ]
                },
                {
                    keywords: ['documentacion de kinesiologia', 'documentos kinesiologia', 'categoria kinesiologia'],
                    responses: [
                        "📁 **Documentación para Kinesiología**\n\n- DNI y credencial de afiliado\n- Orden médica de sesiones\n- Diagnóstico o informe traumatológico\n- Estudios de imagen (RX/RM) si existen\n- Resumen del dolor/limitación actual"
                    ]
                },
                {
                    keywords: ['documentacion de farmacia', 'documentos farmacia', 'categoria farmacia'],
                    responses: [
                        "📁 **Documentación para Farmacia**\n\n- DNI y credencial de afiliado\n- Receta médica vigente\n- Indicaciones de dosis y duración\n- Comprobante de cobertura (si aplica)\n- Estudios o antecedentes que respalden el tratamiento (si aplica)"
                    ]
                }
            ],
            creativePoems: [
                {
                    keywords: ['poema creativo', 'poesia', 'poema', 'versos', 'rima'],
                    responses: [
                        "# 📝 **He Cometido el Peor Pecado**\n\nHe cometido el peor de los pecados que un hombre puede cometer,\nno fui feliz.\n\nTuve los días como armas afiladas,\nlos años fueron mi fortuna,\ny desperdicié la voz del corazón.\n\nPasé ante el espejo sin verme,\nantes las flores sin reconocerlas,\nantes el amor sin atreverme.\n\nAhora entiendo que la vida no es el tiempo,\nsino lo que hacemos en él,\nno es lo que poseemos,\nsino lo que compartimos.\n\nCuando tienes la oportunidad, sé feliz.\nCuando veas a alguien que amas, díselo.\nNo esperes mañana,\nporque hoy es todo lo que tienes. 💔✨",
                        
                        "# ✨ **La Vida es Ahora**\n\nNo es mañana el momento para vivir,\nni ayer la excusa para no comenzar.\nEs en este instante, en esta respiración,\ndonde la magia ocurre.\n\nLos sueños no son promesas del futuro,\nson invitaciones del presente.\nCada momento que dejas pasar\nes una vida no vivida.\n\nSé valiente con tu corazón,\ngenerous con tu tiempo,\naudaz con tus decisiones.\n\nLa vida no premia a los que esperan,\npremia a los que actúan. 🌟",
                        
                        "# 🌱 **Semillas de Esperanza**\n\nEn el fondo del invierno más duro,\nexiste la promesa de primavera.\nEn los ojos más cansados,\nreposa la chispa de un nuevo amanecer.\n\nNo mides el valor de una semilla,\nhasta que la ves convertida en árbol.\nNo comprendes tu fuerza,\nhasta que enfrentas la tormenta.\n\nCada caída es una lección,\ncada dolor, una puerta a la sabiduría.\nEn los escombros de ayer,\nse construye el castillo de mañana. 🌳",
                        
                        "# 💫 **Ser es Más que Tener**\n\nEn un mundo que te grita que tengas más,\ncalma tu alma diciéndote: basta.\n\nUna mano que sostiene,\nes más rica que mil monedas.\nUna risa compartida,\nbrilla más que cualquier corona.\nUn abrazo sincero,\nvale más que todos los palacios.\n\nLa riqueza verdadera\nnunca se compra en tiendas,\nsiempre se cultiva en el corazón.\n\nVive con menos cosas,\npero con más significado. 🏡",
                        
                        "# 🌊 **Navegante de la Incertidumbre**\n\nNo sabes qué trae el mañana,\nni quién estarás dentro de un año.\nPero esa es la belleza,\nla libertad de escribir tu historia.\n\nLos miedos son brújulas camufladas,\nque señalan hacia dónde crecer.\nLa incertidumbre no es enemiga,\nes la danza con la vida misma.\n\nNavega sin mapa,\nconfía en tu intuición,\nlos destinos más hermosos\nson los inesperados. 🧭",
                        
                        "# 🦋 **Transformación**\n\nQuizá no eres lo que querías ser todavía,\npero mira cuánto has avanzado.\nLa oruga no sabe que será mariposa,\nsolamente cumple su proceso.\n\nNo temas cambiar,\nno temas dejar ir lo que has sido,\npara convertirte en quien necesitas ser.\n\nCada cicatriz es evidencia de resistencia,\ncada lágrima, prueba de que intentaste.\nLa transformación no es debilidad,\nes el acto más valiente de la vida. 🦋",
                        
                        "# 🔥 **Fuego Interior**\n\nLlevas en tu pecho una llama\nque nadie puede apagar.\nEs la chispa de tus ancestros,\nel fuego de tus sueños,\nla pasión de tu propósito.\n\nCuando el mundo te apague,\nenciende la vela de dentro de ti.\nCuando todo te abandone,\nqueda tu espíritu, invencible.\n\nNo busques aprobación afuera,\nla llevabas dentro desde el principio.\nSé tu propia razón para brillar. 🔥",
                        
                        "# 🌙 **Paz en la Oscuridad**\n\nNo toda noche es un fracaso,\na veces es descanso.\nNo todo silencio es soledad,\na veces es revelación.\nNo todo final es derrota,\na veces es nuevo comienzo.\n\nEn la oscuridad más profunda,\nlos ojos aprenden a ver con el alma.\nEn el silencio más callado,\nel corazón escucha su verdadera voz.\n\nTranquilo, las estrellas brillan más\ndespués de las noches más largas. 🌙",
                        
                        "# 🎁 **Todo Es Un Regalo**\n\nEsta mañana que despertaste,\nfue un regalo.\nEsa persona que te ama,\nfue un regalo.\nEsas manos capaces,\nfueron un regalo.\n\nNo necesitas esperar a la perfección,\npara agradecer. \nNo esperes tener todo,\npara valorar algo.\n\nLa gratitud no es un lujo,\nes el secreto de los sabios.\nAbre los ojos a los regalos de hoy,\ny la vida se multiplicará. 🎁",
                        
                        "# 🌈 **Después de la Lluvia**\n\nNo fue la tormenta tu culpa,\nni el arcoíris tu mérito.\nSolamente viviste ambas,\ny aprendiste a navegar entre ellas.\n\nTodos llevamos cicatrices,\ntodas hermosas en su propio lenguaje.\nTodos hemos llorado bajo la lluvia,\ny celebrado bajo el sol.\n\nLo importante no es huir del dolor,\nsino aprender a danzar con él.\nLa verdadera belleza,\nnace de nuestras fracturas. 🌈"
                    ]
                }
            ]
        };
    }

    findSmartResponse(message) {
        // Normalizar mensaje: minúsculas, sin acentos
        const normalizedMessage = message
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        
        // Buscar en todas las categorías de respuestas
        const allCategories = [
            ...this.smartResponses.aboutAKI,
            ...this.smartResponses.healthFacts,
            ...this.smartResponses.programmingExamples,
            ...this.smartResponses.documentationHelp,
            ...this.smartResponses.doctorCategoriesDocs,
            ...this.smartResponses.doctorSpecialtyDocs,
            ...this.smartResponses.creativePoems
        ];
        
        for (const category of allCategories) {
            const hasKeyword = category.keywords.some(keyword => 
                normalizedMessage.includes(keyword)
            );
            
            if (hasKeyword) {
                const randomIndex = Math.floor(Math.random() * category.responses.length);
                return category.responses[randomIndex];
            }
        }
        
        return null;
    }

    setupChatListeners() {
        const chatForm = document.getElementById('chatForm');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');

        // Auto-resize textarea
        messageInput.addEventListener('input', () => this.resizeTextarea(messageInput));

        // Enviar con Enter (Shift+Enter para nueva línea)
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatForm.dispatchEvent(new Event('submit'));
            }
        });

        // Formulario
        chatForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Botones de acción
        document.getElementById('attachBtn').addEventListener('click', () => this.handleAttach());
        document.getElementById('voiceBtn').addEventListener('click', () => this.handleVoice());

        // Prompts rápidos
        document.addEventListener('click', (e) => {
            if (e.target.closest('.prompt-card')) {
                const prompt = e.target.closest('.prompt-card').dataset.prompt;
                this.sendMessage(prompt);
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) return;

        this.sendMessage(message);
        messageInput.value = '';
        this.resizeTextarea(messageInput);
    }

    async sendMessage(message) {
        const normalizedMessage = String(message)
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        if (normalizedMessage === 'juega con aki' || normalizedMessage.includes('ajedrez')) {
            if (window.chessGame && typeof window.chessGame.open === 'function') {
                window.chessGame.open();
                aki.notify('Ajedrez contra AKI listo', 'success');
            } else {
                aki.notify('No se pudo abrir el ajedrez', 'error');
            }
            return;
        }

        if (!aki.currentConversation) {
            await aki.createNewChat();
        }

        // Agregar mensaje del usuario
        await aki.addMessage('user', message);

        // Deshabilitar input
        document.getElementById('sendBtn').disabled = true;
        this.isLoading = true;

        // Mostrar indicador de escribiendo
        this.showTypingIndicator();

        try {
            // Verificar si hay una respuesta inteligente predefinida
            const smartResponse = this.findSmartResponse(message);
            
            if (smartResponse) {
                // Simular tiempo de respuesta realista (1-2 segundos)
                setTimeout(async () => {
                    this.hideTypingIndicator();
                    await aki.addMessage('assistant', smartResponse);
                    document.getElementById('sendBtn').disabled = false;
                    this.isLoading = false;
                    
                    // Actualizar título si es el primer intercambio
                    if (aki.currentConversation.messages.length === 2) {
                        aki.updateConversationTitle(message);
                    }
                }, 1000 + Math.random() * 1000);
                return;
            }

            // Si no hay respuesta predefinida, mostrar un mensaje por defecto
            setTimeout(async () => {
                this.hideTypingIndicator();
                const defaultResponse = `Gracias por tu mensaje: "${message}". Estoy aprendiendo constantemente para mejorar mis respuestas. 🤖`;
                await aki.addMessage('assistant', defaultResponse);
                document.getElementById('sendBtn').disabled = false;
                this.isLoading = false;
                
                // Actualizar título si es el primer intercambio
                if (aki.currentConversation.messages.length === 2) {
                    aki.updateConversationTitle(message);
                }
            }, 1500);

        } catch (error) {
            console.error('Error enviando mensaje:', error);
            
            this.hideTypingIndicator();
            
            // Mostrar mensaje de error alternativo
            const defaultResponse = `Lo siento, estoy experimentando dificultades técnicas en este momento. 
Por favor intenta de nuevo en unos momentos. Mi equipo de desarrollo está trabajando en ello. 🔧`;
            
            await aki.addMessage('assistant', defaultResponse);
            aki.notify('Error al procesar el mensaje', 'error');

        } finally {
            // Re-habilitar input
            document.getElementById('sendBtn').disabled = false;
            this.isLoading = false;
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('messagesContainer');
        const indicator = document.createElement('div');
        indicator.className = 'message assistant typing-indicator-wrapper';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(indicator);
        aki.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    resizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    handleAttach() {
        aki.notify('Sistema de adjuntos en desarrollo', 'info');
        // TODO: Implementar carga de archivos
    }

    async handleVoice() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            aki.notify('Tu navegador no soporta reconocimiento de voz', 'error');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = true;

        const voiceBtn = document.getElementById('voiceBtn');
        const originalContent = voiceBtn.innerHTML;

        voiceBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        voiceBtn.disabled = true;

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }

            if (event.isFinal) {
                document.getElementById('messageInput').value = transcript;
                document.getElementById('messageInput').focus();
                aki.notify(`Escuché: "${transcript}"`, 'success');
            }
        };

        recognition.onerror = (event) => {
            aki.notify(`Error de voz: ${event.error}`, 'error');
        };

        recognition.onend = () => {
            voiceBtn.innerHTML = originalContent;
            voiceBtn.disabled = false;
        };

        try {
            recognition.start();
            aki.notify('Escuchando...', 'info');
        } catch (error) {
            console.error('Error iniciando reconocimiento de voz:', error);
            voiceBtn.innerHTML = originalContent;
            voiceBtn.disabled = false;
        }
    }
}

// Instancia global
const chat = new ChatManager();
