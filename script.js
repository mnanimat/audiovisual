/*
  CONFIGURAÇÃO RÁPIDA
  Troque o número abaixo pelo WhatsApp da MN Animat no formato: 55 + DDD + número.
  Exemplo Bahia/Salvador: 5571999999999
*/
const SITE_CONFIG = {
  whatsapp: "55SEUDDDSEUNUMERO",
  defaultMessage: "Olá! Vi o site da MN Animat e gostaria de falar sobre um projeto de animação 3D."
};

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.js-whatsapp').forEach((link) => {
  const validNumber = /^\d{12,13}$/.test(SITE_CONFIG.whatsapp);
  link.href = validNumber
    ? `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.defaultMessage)}`
    : '#pedido';
  link.target = validNumber ? '_blank' : '_self';
  link.rel = validNumber ? 'noopener noreferrer' : '';
});

const form = document.querySelector('#order-form');
const packageSelect = document.querySelector('#package-select');
const description = form?.elements?.description;
const descriptionCount = document.querySelector('#description-count');
const formStatus = document.querySelector('#form-status');
const checkoutButton = form?.querySelector('.button--checkout');

function setStatus(message = '', type = '') {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status${type ? ` is-${type}` : ''}`;
}

function scrollToOrder() {
  document.querySelector('#pedido')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('.js-select-package').forEach((button) => {
  button.addEventListener('click', () => {
    const packageId = button.dataset.package;
    if (packageSelect && packageId) packageSelect.value = packageId;
    scrollToOrder();
    window.setTimeout(() => packageSelect?.focus(), 650);
  });
});

description?.addEventListener('input', () => {
  if (descriptionCount) descriptionCount.textContent = String(description.value.length);
});

function validateForm(formData) {
  const required = ['name', 'email', 'phone', 'deadline', 'packageId', 'description'];
  for (const field of required) {
    if (!String(formData.get(field) || '').trim()) return 'Preencha todos os campos obrigatórios.';
  }
  const email = String(formData.get('email'));
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Digite um e-mail válido.';
  const phoneDigits = String(formData.get('phone')).replace(/\D/g, '');
  if (phoneDigits.length < 10 || phoneDigits.length > 13) return 'Digite um WhatsApp válido com DDD.';
  if (String(formData.get('description')).trim().length < 20) return 'Descreva o projeto com pelo menos 20 caracteres.';
  if (!formData.get('terms')) return 'Você precisa aceitar os termos e a política de privacidade.';
  return '';
}

function openCustomQuote(formData) {
  const details = [
    'Olá! Gostaria de solicitar um orçamento personalizado na MN Animat.',
    '',
    `Nome: ${formData.get('name')}`,
    `E-mail: ${formData.get('email')}`,
    `WhatsApp: ${formData.get('phone')}`,
    `Prazo: ${formData.get('deadline')}`,
    `Projeto: ${formData.get('description')}`,
    formData.get('referenceUrl') ? `Referências: ${formData.get('referenceUrl')}` : ''
  ].filter(Boolean).join('\n');

  if (!/^\d{12,13}$/.test(SITE_CONFIG.whatsapp)) {
    setStatus('Edite o número de WhatsApp no arquivo script.js antes de publicar o site.', 'error');
    return;
  }

  window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(details)}`, '_blank', 'noopener,noreferrer');
  setStatus('Seu briefing foi preparado. Conclua o envio na janela do WhatsApp.', 'success');
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus();
  const formData = new FormData(form);
  const validationError = validateForm(formData);
  if (validationError) {
    setStatus(validationError, 'error');
    return;
  }

  if (formData.get('packageId') === 'custom') {
    openCustomQuote(formData);
    return;
  }

  checkoutButton?.classList.add('is-loading');
  if (checkoutButton) checkoutButton.disabled = true;

  const payload = Object.fromEntries(formData.entries());
  payload.terms = Boolean(formData.get('terms'));

  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.checkoutUrl) {
      throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
    }

    setStatus('Checkout criado. Redirecionando para o Mercado Pago...', 'success');
    window.location.assign(data.checkoutUrl);
  } catch (error) {
    console.error(error);
    setStatus(error.message || 'Ocorreu um erro ao preparar o checkout.', 'error');
    checkoutButton?.classList.remove('is-loading');
    if (checkoutButton) checkoutButton.disabled = false;
  }
});

document.querySelector('#current-year').textContent = String(new Date().getFullYear());
