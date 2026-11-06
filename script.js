"use strict";

// Slides da aula: seguem a ordem real do fluxo dentro do centro de distribuição.
const contentSlides = [
  { title: "Recebimento", description: "É a primeira etapa. Consiste em receber as mercadorias dos fornecedores e descarregar os caminhões no armazém." },
  { title: "Conferência e endereçamento", description: "Momento de checar se as quantidades e qualidades estão corretas e definir em qual local (endereço) do estoque o produto será guardado." },
  { title: "Estocagem ou armazenamento", description: "É a guarda física do produto no local definido (prateleiras, paletes), garantindo sua segurança e conservação." },
  { title: "Identificação dos produtos", description: "Uso de etiquetas, códigos de barras ou QR codes para facilitar a localização e o controle do estoque." },
  { title: "Separação de mercadorias (Picking)", description: "Quando um pedido é feito, os produtos corretos são localizados e retirados do estoque para atender o cliente." },
  { title: "Embalagem", description: "Os produtos separados são embalados adequadamente para proteção durante o transporte e para facilitar o manuseio." },
  { title: "Expedição", description: "Última etapa no armazém. Os produtos embalados são carregados nos veículos de transporte para serem entregues aos clientes." }
];

// Ícones decorativos que ajudam a reconhecer cada etapa sem alterar o conteúdo.
const contentIcons = [
  '<path d="M3 16h2l2-6h9l4 6h1v4h-2a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H3z"/><path d="M7 10l1-4h7l3 4M2 13h4m-2-2v4"/>',
  '<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/><path d="m9 15 2 2 4-4"/>',
  '<path d="M4 20V5h16v15M2 20h20M8 8h3v3H8zm5 0h3v3h-3zM8 14h3v3H8zm5 0h3v3h-3z"/>',
  '<path d="M4 4h16v16H4z"/><path d="M8 8v8m2-8v8m2-8v8m3-8v8m2-8v8M7 6v2m10 8v2"/>',
  '<path d="M4 5h16v15H4zM8 9h8M8 13h5"/><path d="m14 17 2 2 4-4"/>',
  '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5M12 13v4"/>',
  '<path d="M3 7h12v11H3zM15 11h4l3 3v4h-7z"/><circle cx="7" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M5 10h7m-7 3h5"/>'
];

// Cenário de simulação com decisões e consequências operacionais.
const eurekaChallenges = [
  {
    title: "A nota não fecha",
    situation: "O caminhão do pedido urgente acabou de chegar. A nota fiscal informa 120 caixas, mas a contagem inicial encontrou apenas 112.",
    step: "Recebimento + conferência",
    choices: [
      { label: "Registrar a divergência, separar o lote e conferir novamente com o fornecedor.", impact: 2, consequence: "A diferença fica documentada antes da entrada no estoque. O fornecedor pode corrigir a entrega ou a nota, e o saldo permanece confiável." },
      { label: "Lançar 120 caixas no sistema para liberar o caminhão mais rápido.", impact: -2, consequence: "O estoque passa a indicar oito caixas que não existem. A equipe pode prometer itens indisponíveis e atrasar outros pedidos." },
      { label: "Receber as 112 caixas e ignorar a divergência da nota.", impact: -1, consequence: "A operação avança, mas a divergência sem registro dificulta a cobrança ao fornecedor e a rastreabilidade do recebimento." }
    ]
  },
  {
    title: "Produto no endereço errado",
    situation: "Parte das caixas foi guardada em um corredor diferente do endereço previsto. O sistema aponta uma posição, mas os volumes estão em outra.",
    step: "Endereçamento + armazenamento",
    choices: [
      { label: "Localizar o lote, conferir sua condição e atualizar o endereço no sistema.", impact: 2, consequence: "O endereço físico e o digital voltam a coincidir. A equipe consegue encontrar os produtos e preserva o controle do estoque." },
      { label: "Mover as caixas para o lugar certo sem registrar a alteração.", impact: -1, consequence: "O local parece organizado, mas o sistema continua indicando o endereço antigo e pode levar a novas buscas sem resultado." },
      { label: "Deixar as caixas onde estão e pedir para a equipe memorizar a posição.", impact: -2, consequence: "A localização depende da memória de uma pessoa, aumentando o risco de perda, avaria e demora no picking." }
    ]
  },
  {
    title: "Caixas sem identificação",
    situation: "Há volumes sem etiqueta legível na área de armazenagem. Ninguém consegue confirmar rapidamente o conteúdo ou o lote.",
    step: "Identificação dos produtos",
    choices: [
      { label: "Isolar os volumes, conferir documentos e conteúdo, e emitir novas etiquetas rastreáveis.", impact: 2, consequence: "Os itens são identificados com segurança e podem ser localizados pelo sistema sem depender de suposições." },
      { label: "Abrir uma caixa e usar o que parece ser o produto para identificar todas.", impact: -2, consequence: "As caixas podem conter produtos ou lotes diferentes. Uma identificação por aparência pode contaminar o estoque e o pedido." },
      { label: "Deixar os volumes separados e solicitar conferência antes de liberar para picking.", impact: 1, consequence: "O risco imediato de enviar um item errado diminui, mas a identificação precisa ser concluída para que o estoque volte ao fluxo." }
    ]
  },
  {
    title: "Picking divergente",
    situation: "Durante a separação, a lista do pedido pede 6 unidades do modelo A. No carrinho há 6 unidades do modelo B, visualmente parecido.",
    step: "Separação de mercadorias (picking)",
    choices: [
      { label: "Parar a separação e comparar código, descrição e quantidade com o pedido.", impact: 2, consequence: "O erro é corrigido antes da embalagem. O cliente recebe o item pedido e a equipe evita uma devolução." },
      { label: "Enviar o modelo B porque a embalagem e o tamanho parecem iguais.", impact: -2, consequence: "O cliente recebe o produto errado, gerando retrabalho, custo de logística reversa e perda de confiança." },
      { label: "Pedir uma segunda conferência independente antes de fechar o pedido.", impact: 1, consequence: "Uma checagem adicional reduz o risco de erro. O fluxo leva um pouco mais de tempo, mas protege a qualidade do pedido." }
    ]
  },
  {
    title: "Proteção insuficiente",
    situation: "O item separado é frágil e será transportado por uma rota longa. A embalagem disponível não impede que ele se mova dentro da caixa.",
    step: "Embalagem",
    choices: [
      { label: "Escolher uma caixa adequada, preencher os espaços e proteger o produto contra impacto.", impact: 2, consequence: "O produto fica imobilizado e protegido no trajeto, reduzindo avarias e reclamações na entrega." },
      { label: "Usar a caixa atual e fechar rapidamente para cumprir o horário.", impact: -2, consequence: "A caixa pode chegar danificada e o produto quebrado. A pressa transforma uma economia de minutos em custo de reposição." },
      { label: "Pausar o fechamento e solicitar material de proteção compatível.", impact: 1, consequence: "O pedido aguarda o material certo, mas a equipe evita despachar uma embalagem que não protege o item." }
    ]
  },
  {
    title: "Janela de expedição apertada",
    situation: "O veículo está na doca e prestes a sair. Um pedido ainda não teve seus volumes, documentos e destino conferidos.",
    step: "Expedição",
    choices: [
      { label: "Conferir pedido, volumes, documentos e rota antes de liberar o carregamento.", impact: 2, consequence: "A carga sai identificada e vinculada ao destino correto. A conferência final protege a entrega e a rastreabilidade." },
      { label: "Colocar o pedido no primeiro veículo disponível e corrigir os documentos depois.", impact: -2, consequence: "Sem validação, a carga pode seguir para a rota errada ou ficar sem comprovação, comprometendo o prazo e a entrega." },
      { label: "Segurar esse pedido, registrar o motivo e combinar a próxima saída com o cliente.", impact: 1, consequence: "O atraso é comunicado e controlado. A carga não sai sem validação, evitando uma falha maior na entrega." }
    ]
  }
];

// As cinco perguntas originais foram mantidas; outras cinco avaliam aplicação prática.
const quizQuestions = [
  { type: "Verdadeiro ou falso", question: "O “Recebimento” é a última etapa, onde o produto é entregue na casa do cliente?", options: ["Verdadeiro", "Falso"], answer: 1, explanation: "O recebimento é a primeira etapa do armazém, onde a mercadoria chega do fornecedor. A entrega final ocorre depois da expedição." },
  { type: "Verdadeiro ou falso", question: "Na etapa de “Estocagem ou armazenamento”, o principal objetivo é guardar os produtos de forma segura no armazém?", options: ["Verdadeiro", "Falso"], answer: 0, explanation: "A estocagem mantém os produtos seguros e conservados até que sejam necessários para atender um pedido." },
  { type: "Verdadeiro ou falso", question: "A “Identificação dos produtos” utilizando códigos de barras ajuda a encontrar os itens mais rápido no estoque?", options: ["Verdadeiro", "Falso"], answer: 0, explanation: "Etiquetas e códigos tornam a localização e o controle dos itens mais rápidos e confiáveis." },
  { type: "Verdadeiro ou falso", question: "A etapa de “Embalagem” serve apenas para deixar a caixa bonita, sem nenhuma função de proteger o produto?", options: ["Verdadeiro", "Falso"], answer: 1, explanation: "A embalagem protege contra danos durante o transporte e também facilita o manuseio da carga." },
  { type: "Verdadeiro ou falso", question: "A “Expedição” é o momento em que as mercadorias saem do armazém e são colocadas nos caminhões de entrega?", options: ["Verdadeiro", "Falso"], answer: 0, explanation: "A expedição é a última etapa interna: confere e despacha o pedido para o transporte." },
  { type: "Múltipla escolha · Aplicação", question: "A nota fiscal informa 50 unidades, mas a conferência encontra 47. Qual deve ser o próximo passo?", options: ["Registrar a divergência e verificar os volumes antes de concluir o recebimento.", "Lançar 50 para não atrasar o fornecedor.", "Guardar as 47 sem atualizar documentos ou sistema."], answer: 0, explanation: "Conferir e registrar diferenças no recebimento evita saldos incorretos e permite tratar a ocorrência com o fornecedor." },
  { type: "Múltipla escolha · Aplicação", question: "Um item aparece no sistema em um endereço, mas foi encontrado em outro. O que mantém o estoque confiável?", options: ["Atualizar o endereço no sistema após conferir o produto e sua posição.", "Deixar o endereço antigo e avisar apenas a equipe do turno.", "Criar um endereço novo sem registrar a movimentação."], answer: 0, explanation: "O endereço físico precisa corresponder ao registro digital para que a próxima localização e separação sejam corretas." },
  { type: "Múltipla escolha · Aplicação", question: "Na separação, o código de barras do produto não corresponde ao pedido. O que fazer?", options: ["Separar o item parecido e corrigir se o cliente reclamar.", "Interromper o picking e confirmar código e descrição do pedido.", "Trocar a etiqueta para que o sistema aceite o item."], answer: 1, explanation: "A conferência durante o picking detecta a divergência antes que o produto errado seja embalado e expedido." },
  { type: "Múltipla escolha · Aplicação", question: "Um produto frágil vai percorrer uma rota longa. Qual escolha reduz o risco de avaria?", options: ["Usar uma embalagem ajustada, com proteção que impeça o movimento do produto.", "Escolher a caixa mais leve, mesmo que o produto fique solto.", "Colocar um aviso de frágil e dispensar o preenchimento interno."], answer: 0, explanation: "A embalagem precisa proteger fisicamente o conteúdo. O aviso ajuda no manuseio, mas não substitui a proteção adequada." },
  { type: "Múltipla escolha · Aplicação", question: "Antes de liberar uma carga, qual conferência ajuda a evitar falhas na entrega?", options: ["Validar pedido, quantidade de volumes, documentos e destino/rota.", "Conferir somente se todos os volumes cabem no veículo.", "Deixar a transportadora decidir o destino depois da saída."], answer: 0, explanation: "A expedição confere carga e documentos para que os volumes sigam completos, rastreáveis e para o destino correto." }
];

let currentSlide = -1;
let currentQuestion = 0;
let quizScore = 0;
let answered = false;
let currentChallenge = 0;
let simulationScore = 0;
let simulationDecisions = [];

const screen = document.getElementById("screen");
const progressWrap = document.getElementById("progressWrap");
const progressLabel = document.getElementById("progressLabel");
const progressCount = document.getElementById("progressCount");
const progressFill = document.getElementById("progressFill");
const progressBar = document.getElementById("progressBar");
const stageLabel = document.getElementById("stageLabel");

// Estado visual da navegação, separado da lógica das atividades.
function setActivePhase(phase) {
  document.querySelectorAll("[data-phase-step]").forEach((step) => {
    const isActive = step.dataset.phaseStep === phase;
    const phaseOrder = ["content", "eureka", "level", "next"];
    const activeIndex = phaseOrder.indexOf(phase);
    const stepIndex = phaseOrder.indexOf(step.dataset.phaseStep);
    step.classList.toggle("is-active", isActive);
    step.classList.toggle("is-complete", activeIndex > stepIndex);
    if (isActive) step.setAttribute("aria-current", "step");
    else step.removeAttribute("aria-current");
  });
}

function render(html) {
  screen.innerHTML = html;
  screen.classList.remove("card-content");
  // Reinicia a animação de entrada em cada tela.
  void screen.offsetWidth;
  screen.classList.add("card-content");
}

function setProgress(label, current, total) {
  progressWrap.hidden = false;
  const percent = Math.round((current / total) * 100);
  progressLabel.textContent = label;
  progressCount.textContent = `${current} / ${total}`;
  progressFill.style.width = `${percent}%`;
  progressBar.setAttribute("aria-valuenow", String(percent));
  progressBar.setAttribute("aria-valuemax", "100");
}

function hideProgress() { progressWrap.hidden = true; }

function showIntro() {
  currentSlide = -1;
  setActivePhase("");
  stageLabel.textContent = "80 · PROCESSOS DE DISTRIBUIÇÃO E ARMAZENAMENTO";
  hideProgress();
  render(`
    <div class="intro-layout">
      <div class="intro-copy">
        <div class="course-kicker"><span class="status-dot"></span> TRILHA DE APRENDIZAGEM <span class="kicker-divider"></span> TEMA 80</div>
        <div class="eyebrow">Projeto de aula · Gerar</div>
        <h1>Processos de <span>Distribuição</span> e Armazenamento</h1>
        <p class="lead">Como um produto sai do fornecedor e chega ao cliente com segurança, rapidez e qualidade? Conheça as sete etapas da operação, resolva uma crise de estoque e avalie o que aprendeu.</p>
        <div class="intro-actions"><button class="button button-primary button-start" type="button" onclick="startContent()">Iniciar experiência <span aria-hidden="true">→</span></button><span class="course-duration"><span aria-hidden="true">◷</span> Aula interativa</span></div>
      </div>
      <div class="warehouse-art" aria-hidden="true">
        <div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div>
        <div class="warehouse-window">
          <div class="art-topline"><span>FLUXO LOGÍSTICO</span><span class="art-live"><i></i> ATIVO</span></div>
          <svg viewBox="0 0 340 230" role="presentation">
            <path class="art-route" d="M30 178h76V80h95v98h105"/>
            <path class="art-route-dash" d="M30 178h76V80h95v98h105"/>
            <path class="art-rack" d="M72 61v132m74-132v132m74-132v132m74-132v132M62 99h242M62 145h242M62 192h242"/>
            <rect class="art-box box-a" x="80" y="72" width="45" height="27" rx="4"/><rect class="art-box box-b" x="154" y="108" width="45" height="36" rx="4"/><rect class="art-box box-c" x="229" y="72" width="45" height="27" rx="4"/><rect class="art-box box-d" x="80" y="153" width="45" height="36" rx="4"/><rect class="art-box box-e" x="229" y="153" width="45" height="36" rx="4"/>
            <circle class="art-node" cx="30" cy="178" r="8"/><circle class="art-node" cx="306" cy="178" r="8"/>
          </svg>
          <div class="art-caption"><span>Receber</span><b>→</b><span>Armazenar</span><b>→</b><span>Entregar</span></div>
        </div>
        <div class="art-float-card"><span class="float-icon">↗</span><span><b>Pedido em movimento</b><small>Fornecedor → cliente</small></span></div>
      </div>
    </div>
    <div class="intro-footer"><span class="intro-footer-label">SUA EXPERIÊNCIA</span><div class="phase-preview" aria-label="Etapas da experiência">
      <span><b>01</b> Conteúdo</span><span><b>02</b> Eureka</span><span><b>03</b> Level Up</span><span><b>04</b> Next Level</span>
    </div></div>
  `);
}

function startContent() {
  currentSlide = 0;
  setActivePhase("content");
  stageLabel.textContent = "CONTEÚDO · AS 7 ETAPAS";
  showSlide();
}

function showSlide() {
  const slide = contentSlides[currentSlide];
  setProgress("Conteúdo · Etapas", currentSlide + 1, contentSlides.length);
  const isLast = currentSlide === contentSlides.length - 1;
  render(`
    <div class="content-slide-head"><div><div class="eyebrow">CONTEÚDO · ETAPA ${String(currentSlide + 1).padStart(2, "0")} DE 07</div><h2>${slide.title}</h2></div>
      <div class="stage-art" aria-hidden="true"><span>${String(currentSlide + 1).padStart(2, "0")}</span><svg viewBox="0 0 24 24">${contentIcons[currentSlide]}</svg></div>
    </div>
    <p class="body-copy">${slide.description}</p>
    <div class="process-flow" aria-label="Fluxo logístico; etapa atual destacada">${contentSlides.map((item, index) => `<div class="flow-stop ${index < currentSlide ? "is-complete" : ""} ${index === currentSlide ? "is-current" : ""}"><span>${String(index + 1).padStart(2, "0")}</span><small>${item.title.split(" ")[0]}</small></div>`).join("")}</div>
    <div class="hint"><span class="hint-icon" aria-hidden="true">↳</span><span>${isLast ? "Esta etapa conclui o fluxo interno e encaminha o pedido para a entrega." : "Cada etapa prepara o pedido para avançar com segurança até o cliente."}</span></div>
    <div class="actions"><button class="button button-primary" type="button" onclick="nextSlide()">${isLast ? "Começar EUREKA" : "Próximo"} <span aria-hidden="true">→</span></button></div>
  `);
}

function nextSlide() {
  if (currentSlide < contentSlides.length - 1) {
    currentSlide += 1;
    showSlide();
  } else {
    startEureka();
  }
}

function startEureka() {
  currentChallenge = 0;
  simulationScore = 0;
  simulationDecisions = [];
  stageLabel.textContent = "EUREKA · APRENDENDO NA PRÁTICA";
  setActivePhase("eureka");
  showEurekaIntro();
}

function showEurekaIntro() {
  setProgress("EUREKA · Operação", 1, eurekaChallenges.length + 1);
  render(`
    <div class="ops-header"><div><div class="eyebrow phase-eureka">EUREKA · APRENDENDO NA PRÁTICA</div><div class="ops-id">CENTRO DE DISTRIBUIÇÃO <span>CD-01</span></div></div><div class="ops-status"><i></i> OPERAÇÃO EM ALERTA</div></div>
    <h2>OPERAÇÃO: ESTOQUE EM CRISE</h2>
    <p class="lead">Você e sua equipe são responsáveis por um centro de distribuição. Um pedido urgente precisa sair hoje, mas a operação acumula divergências, falhas de localização, identificação, separação, embalagem e expedição.</p>
    <div class="scenario-panel"><strong>Missão</strong><p>Tomem decisões para recuperar o fluxo, proteger o pedido e atender o cliente com responsabilidade.</p></div>
    <div class="rules-grid">
      <div><b>Como funciona</b><p>Em cada situação, escolham uma ação entre três caminhos possíveis.</p></div>
      <div><b>Leiam as consequências</b><p>O feedback mostra o impacto da decisão na equipe, no estoque e no cliente.</p></div>
      <div><b>Operação integrada</b><p>As escolhas percorrem as sete etapas: recebimento, conferência, armazenagem, identificação, picking, embalagem e expedição.</p></div>
    </div>
    <div class="actions"><button class="button button-primary" type="button" onclick="showChallenge()">Assumir a operação <span aria-hidden="true">→</span></button></div>
  `);
}

function showChallenge() {
  const item = eurekaChallenges[currentChallenge];
  setProgress("EUREKA · Desafios", currentChallenge + 2, eurekaChallenges.length + 1);
  render(`
    <div class="ops-console"><div class="ops-console-title"><span class="console-led"></span> PAINEL DE OPERAÇÕES <span class="console-separator">/</span> PEDIDO URGENTE</div><div class="ops-metrics"><span><small>OCORRÊNCIA</small><b>${String(currentChallenge + 1).padStart(2, "0")} / 06</b></span><span><small>PRIORIDADE</small><b class="priority-high">ALTA</b></span><span><small>ETAPA</small><b>${item.step}</b></span></div></div>
    <div class="eyebrow phase-eureka">Decisão operacional</div>
    <h2>${item.title}</h2>
    <div class="scenario-panel"><span class="scenario-label">Cenário</span><p>${item.situation}</p></div>
    <p class="choice-prompt">Qual decisão sua equipe toma?</p>
    <div class="decision-list" role="group" aria-label="Escolha uma decisão">
      ${item.choices.map((choice, index) => `<button class="decision-button" type="button" onclick="chooseDecision(${index})"><span class="decision-number">0${index + 1}</span><span>${choice.label}</span><span class="decision-arrow" aria-hidden="true">→</span></button>`).join("")}
    </div>
    <div class="feedback" id="decisionFeedback" role="status" aria-live="polite"></div>
    <div class="actions"><div class="actions-right" id="decisionNext" hidden><button class="button button-primary" type="button" onclick="nextChallenge()">${currentChallenge === eurekaChallenges.length - 1 ? "Ver resultado da operação" : "Próximo desafio"} <span aria-hidden="true">→</span></button></div></div>
  `);
}

function chooseDecision(choiceIndex) {
  const item = eurekaChallenges[currentChallenge];
  if (simulationDecisions.length > currentChallenge) return;
  const choice = item.choices[choiceIndex];
  if (!choice) return;
  simulationDecisions.push({ title: item.title, label: choice.label, impact: choice.impact });
  simulationScore += choice.impact;
  document.querySelectorAll(".decision-button").forEach((button, index) => {
    button.disabled = true;
    if (index === choiceIndex) button.classList.add(choice.impact > 0 ? "decision-good" : "decision-risk");
  });
  const feedback = document.getElementById("decisionFeedback");
  const tone = choice.impact > 0 ? "correct" : choice.impact < 0 ? "wrong" : "neutral";
  const label = choice.impact > 0 ? "Boa decisão" : choice.impact < 0 ? "Risco para a operação" : "Consequência";
  feedback.className = `feedback visible ${tone}`;
  feedback.innerHTML = `<div class="feedback-title ${tone}">${label}</div><p>${choice.consequence}</p>`;
  document.getElementById("decisionNext").hidden = false;
  document.querySelector("#decisionNext button").focus();
}

function nextChallenge() {
  if (currentChallenge < eurekaChallenges.length - 1) {
    currentChallenge += 1;
    showChallenge();
  } else {
    showEurekaConclusion();
  }
}

function showEurekaConclusion() {
  const maxScore = eurekaChallenges.length * 2;
  const ratio = simulationScore / maxScore;
  const outcome = ratio >= 0.7
    ? { title: "Operação recuperada", detail: "As decisões priorizaram controle, segurança e comunicação. O pedido segue com maior confiabilidade e a equipe consegue rastrear o que aconteceu." }
    : ratio >= 0.3
      ? { title: "Operação estabilizada com ressalvas", detail: "Alguns riscos foram reduzidos, mas decisões sem registro ou conferência podem gerar retrabalho. A equipe precisará acompanhar o pedido e corrigir os pontos pendentes." }
      : { title: "A crise se espalhou pelo fluxo", detail: "Atalhos em etapas iniciais geraram riscos para o estoque e para o cliente. A equipe deve conter as falhas, comunicar o impacto e revisar o processo antes de liberar novas cargas." };
  setProgress("EUREKA · Resultado", eurekaChallenges.length + 1, eurekaChallenges.length + 1);
  render(`
    <div class="eyebrow phase-eureka">EUREKA · Conclusão da simulação</div>
    <h2>${outcome.title}</h2>
    <div class="result-score"><strong>${simulationScore > 0 ? "+" : ""}${simulationScore}</strong><span>saldo de decisões · máximo ${maxScore}</span></div>
    <p class="lead">${outcome.detail}</p>
    <div class="scenario-panel"><strong>Como suas escolhas afetaram a operação</strong>
      <ul class="decision-summary">${simulationDecisions.map((decision) => `<li><span>${decision.title}</span><span class="impact ${decision.impact > 0 ? "positive" : "negative"}">${decision.impact > 0 ? "+" : ""}${decision.impact}</span></li>`).join("")}</ul>
    </div>
    <div class="hint"><span class="hint-icon" aria-hidden="true">↗</span><span>Receber e conferir com rigor cria a base para armazenar, identificar, separar, embalar e expedir corretamente. Uma falha pode seguir adiante e afetar o cliente.</span></div>
    <div class="actions"><button class="button button-primary" type="button" onclick="startQuiz()">Avançar para LEVEL UP <span aria-hidden="true">→</span></button></div>
  `);
}

function startQuiz() {
  currentQuestion = 0;
  quizScore = 0;
  answered = false;
  stageLabel.textContent = "LEVEL UP · AVALIANDO A APRENDIZAGEM";
  setActivePhase("level");
  showQuestion();
}

function showQuestion() {
  answered = false;
  const item = quizQuestions[currentQuestion];
  setProgress("LEVEL UP · Avaliação", currentQuestion + 1, quizQuestions.length);
  render(`
    <div class="quiz-heading"><div class="quiz-number">${String(currentQuestion + 1).padStart(2, "0")}<span> / ${String(quizQuestions.length).padStart(2, "0")}</span></div><div><div class="eyebrow phase-level">LEVEL UP · AVALIAÇÃO</div><div class="question-type">${item.type}</div></div></div>
    <h2 class="question">${item.question}</h2>
    <div class="answer-options quiz-options" role="group" aria-label="Escolha sua resposta">
      ${item.options.map((option, index) => `<button class="button answer-button quiz-answer" type="button" data-answer="${index}" onclick="answerQuestion(${index})"><span class="option-key">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join("")}
    </div>
    <div class="feedback" id="feedback" role="status" aria-live="polite"></div>
    <div class="actions"><div class="actions-right" id="nextAction" hidden><button class="button button-primary" type="button" onclick="nextQuestion()">${currentQuestion === quizQuestions.length - 1 ? "Ver resultado" : "Próxima questão"} <span aria-hidden="true">→</span></button></div></div>
  `);
}

function answerQuestion(choiceIndex) {
  if (answered) return;
  answered = true;
  const item = quizQuestions[currentQuestion];
  const correct = choiceIndex === item.answer;
  if (correct) quizScore += 1;
  document.querySelectorAll(".quiz-answer").forEach((button) => {
    button.disabled = true;
    const selected = Number(button.dataset.answer);
    if (selected === item.answer) button.classList.add("selected-correct");
    else if (selected === choiceIndex) button.classList.add("selected-wrong");
  });
  const feedback = document.getElementById("feedback");
  feedback.className = `feedback visible ${correct ? "correct" : "wrong"}`;
  feedback.innerHTML = `<div class="feedback-title ${correct ? "correct" : "wrong"}">${correct ? "✓ Resposta correta" : "✕ Resposta incorreta"}</div><p>${item.explanation}</p>`;
  document.getElementById("nextAction").hidden = false;
  document.querySelector("#nextAction button").focus();
}

function nextQuestion() {
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion += 1;
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const errors = quizQuestions.length - quizScore;
  const percentage = Math.round((quizScore / quizQuestions.length) * 100);
  const analysis = percentage >= 90
    ? "Excelente domínio: você conecta as etapas e identifica como cada decisão afeta o resultado da operação."
    : percentage >= 70
      ? "Bom desempenho: você compreende a maior parte do fluxo. Revise as etapas em que a conferência e o registro evitam retrabalho."
      : percentage >= 50
        ? "Você está construindo uma boa base. Retome as etapas de armazenagem, picking e expedição para conectar o fluxo completo."
        : "Este é um ponto de partida. Rever as sete etapas ajudará a entender como erros no início podem chegar até o cliente.";
  stageLabel.textContent = "LEVEL UP · RESULTADO DA AVALIAÇÃO";
  setProgress("LEVEL UP · Avaliação concluída", quizQuestions.length, quizQuestions.length);
  render(`
    <div class="eyebrow phase-level">LEVEL UP · Avaliação concluída</div>
    <h2>Seu desempenho</h2>
    <div class="result-score"><strong>${quizScore}</strong><span>acertos de ${quizQuestions.length}</span></div>
    <div class="score-grid"><div><strong>${errors}</strong><span>erros</span></div><div><strong>${percentage}%</strong><span>aproveitamento</span></div></div>
    <div class="scenario-panel"><strong>Análise</strong><p>${analysis}</p></div>
    <div class="actions"><button class="button button-primary" type="button" onclick="showNextLevel()">Ir para NEXT LEVEL <span aria-hidden="true">→</span></button></div>
  `);
}

function showNextLevel() {
  stageLabel.textContent = "NEXT LEVEL · REFLEXÃO E ENCERRAMENTO";
  setActivePhase("next");
  setProgress("NEXT LEVEL · Encerramento", 1, 1);
  render(`
    <div class="completion-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg></div>
    <div class="eyebrow phase-next">MISSÃO CONCLUÍDA · NEXT LEVEL</div>
    <h2>Logística eficiente é trabalho integrado.</h2>
    <p class="lead">Você percorreu o fluxo do recebimento até a expedição e tomou decisões em situações reais de operação.</p>
    <div class="learning-grid">
      <div><span>01</span><p>Recebimento e conferência corretos criam uma base confiável para todo o processo.</p></div>
      <div><span>02</span><p>Organização e identificação mantêm o estoque localizável, seguro e atualizado.</p></div>
      <div><span>03</span><p>Separação e embalagem corretas protegem o pedido e a experiência do cliente.</p></div>
      <div><span>04</span><p>A expedição confere e encaminha os produtos para a entrega ao cliente.</p></div>
    </div>
    <div class="reflection-card"><span class="scenario-label">Pergunta para reflexão</span><p>“Como uma falha no armazenamento pode comprometer toda a cadeia de distribuição e a satisfação do cliente?”</p></div>
    <div class="scenario-panel reality-panel"><strong>Na realidade profissional</strong><p>Esses processos acontecem todos os dias em centros de distribuição, supermercados, indústrias e transportadoras. Equipes recebem, conferem, armazenam, localizam, separam, protegem e despacham produtos para manter o fluxo de abastecimento.</p></div>
    <div class="closing-note"><strong>Eficiência logística depende da integração de todas as etapas.</strong><span>Dúvidas ou contribuições? Este é o momento para compartilhar suas ideias com o grupo.</span></div>
    <div class="actions"><button class="button button-primary" type="button" onclick="restart()">↻ Voltar ao início</button></div>
  `);
}

function restart() {
  currentQuestion = 0;
  quizScore = 0;
  currentChallenge = 0;
  simulationScore = 0;
  simulationDecisions = [];
  answered = false;
  showIntro();
}

// Atalho de teclado para avançar pelos slides de conteúdo.
document.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === "ArrowRight") && currentSlide >= 0 && currentSlide < contentSlides.length) {
    if (document.activeElement?.tagName === "BUTTON") return;
    nextSlide();
  }
});

showIntro();
