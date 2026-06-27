# MN Animat — template de site com PIX e cartão

Template responsivo para **Vercel**, com formulário de pedido e integração do **Checkout Pro do Mercado Pago**. O cliente escolhe um pacote no site e é redirecionado ao ambiente seguro do Mercado Pago, onde pode pagar com PIX ou cartão.

## O que está pronto

- Página inicial responsiva para celular e computador.
- Serviços, portfólio, processo, preços e perguntas frequentes.
- Formulário de briefing com validação.
- Pacotes com valores de sinal definidos no servidor.
- Checkout Pro do Mercado Pago.
- Páginas de pagamento aprovado, pendente e não concluído.
- Webhook de pagamento e opção de encaminhar eventos para Make, Zapier ou n8n.
- Termos e política de privacidade como modelos editáveis.
- Artes da MN Animat incluídas em `assets/`.

## 1. Personalize antes de publicar

### WhatsApp

Abra `script.js` e troque:

```js
whatsapp: "55SEUDDDSEUNUMERO"
```

Use apenas números: `55 + DDD + telefone`.

### E-mail, CNPJ e textos

Procure por:

- `contato@mnanimat.com.br`
- `CNPJ: adicione o seu`
- preços dos pacotes
- dados dos termos e política de privacidade

### Preços

Os preços cobrados de verdade ficam em `api/create-checkout.js`, no objeto `CATALOG`. **Não confie em valores vindos do navegador.** Sempre altere o preço visual no `index.html` e o preço real no arquivo da API.

## 2. Criar a integração no Mercado Pago

1. Entre na área de desenvolvedores do Mercado Pago.
2. Crie uma aplicação em **Suas integrações**.
3. Copie o **Access Token de teste**.
4. Faça primeiro os testes usando `MP_ENV=sandbox`.
5. Quando tudo estiver correto, troque pelo Access Token de produção e remova o modo sandbox.

Nunca cole o Access Token em `script.js`, HTML, GitHub público ou qualquer arquivo enviado ao navegador.

## 3. Publicar na Vercel

### Método mais simples: GitHub

1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta para o repositório.
3. Na Vercel, escolha **Add New > Project**.
4. Importe o repositório.
5. Em **Framework Preset**, use `Other`.
6. Não configure comando de build nem diretório de saída.
7. Adicione as variáveis de ambiente descritas abaixo.
8. Clique em **Deploy**.

### Variáveis de ambiente na Vercel

Em **Project > Settings > Environment Variables**, crie:

| Nome | Exemplo | Obrigatória |
|---|---|---|
| `MP_ACCESS_TOKEN` | `APP_USR-...` | Sim |
| `MP_ENV` | `sandbox` | Durante testes |
| `SITE_URL` | `https://seu-projeto.vercel.app` | Sim |
| `ORDER_WEBHOOK_URL` | URL do Make/Zapier/n8n | Não |

Depois de criar o primeiro deploy, copie a URL gerada pela Vercel para `SITE_URL` e faça um novo deploy.

### Publicar pela linha de comando

```bash
npm i -g vercel
vercel
vercel --prod
```

## 4. Testar o pagamento

1. Mantenha `MP_ENV=sandbox`.
2. Abra o site publicado; não teste retorno usando `localhost`.
3. Preencha o pedido e selecione um pacote.
4. Confira se o site redireciona para o checkout de teste.
5. Valide as páginas `sucesso.html`, `pendente.html` e `erro.html`.
6. Confira os logs em **Vercel > Deployments > Functions**.

## 5. Receber aviso automático do pedido

O endpoint `api/webhook.js` consulta os detalhes do pagamento. Por padrão, a venda aparece no painel do Mercado Pago e o evento aparece nos logs da Vercel.

Para mandar os dados automaticamente para outra ferramenta, configure `ORDER_WEBHOOK_URL` com um webhook do Make, Zapier ou n8n. O site enviará um JSON contendo o pagamento e os metadados do briefing.

## 6. Estrutura dos arquivos

```text
mn-animat-site/
├── api/
│   ├── create-checkout.js
│   └── webhook.js
├── assets/
│   ├── hero-mn-animat.png
│   ├── post-principal.png
│   ├── post-servicos.png
│   └── post-story.png
├── index.html
├── styles.css
├── script.js
├── sucesso.html
├── pendente.html
├── erro.html
├── termos.html
├── privacidade.html
├── vercel.json
└── .env.example
```

## Observações importantes

- O Checkout Pro redireciona o comprador ao ambiente do Mercado Pago.
- A disponibilidade de PIX, cartão, parcelamento e outros meios depende da sua conta e da configuração do Mercado Pago.
- Revise preços, prazos, política de cancelamento, direitos autorais e dados empresariais antes de vender.
- O template não substitui orientação contábil ou jurídica.
