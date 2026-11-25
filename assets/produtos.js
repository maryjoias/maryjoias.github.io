/* =========================================================
   MARY JOIAS · Dados do catálogo
   ---------------------------------------------------------
   Para trocar pelas peças reais, edite apenas esta lista.
   - id:        código da peça (vai na mensagem do WhatsApp)
   - cat:       alianca | anel | pingente | brinco | pulseira | colar | corrente | tornozeleira | piercing
   - mat:       joia | semijoia | folheado | ouro18k | tungstenio | prata | bijuteria
   - preco:     número (ex.: 189.9) ou null para "Sob consulta"
   - foto:      caminho da foto real (ex.: "fotos/MJ-A01.webp"). Se vazio, usa a ilustração.
   - desenho:   variação da ilustração provisória (só usada sem foto)
   - novo:      true mostra a etiqueta "Novidade"
   As peças abaixo são EXEMPLOS do protótipo.
   ========================================================= */

window.MJ_CATEGORIAS = [
  { id: "alianca",      nome: "Alianças",      aro: true  },
  { id: "anel",         nome: "Anéis",         aro: true  },
  { id: "pingente",     nome: "Pingentes"                 },
  { id: "brinco",       nome: "Brincos"                   },
  { id: "pulseira",     nome: "Pulseiras"                 },
  { id: "colar",        nome: "Colares"                   },
  { id: "corrente",     nome: "Correntes"                 },
  { id: "tornozeleira", nome: "Tornozeleiras"             },
  { id: "piercing",     nome: "Piercings"                 }
];

window.MJ_MATERIAIS = [
  { id: "joia",       nome: "Joia",        metal: "ouro"  },
  { id: "semijoia",   nome: "Semijoia",    metal: "semi"  },
  { id: "folheado",   nome: "Folheado",    metal: "semi"  },
  { id: "ouro18k",    nome: "Ouro 18K",    metal: "ouro"  },
  { id: "tungstenio", nome: "Tungstênio",  metal: "tung"  },
  { id: "prata",      nome: "Prata",       metal: "prata" },
  { id: "bijuteria",  nome: "Bijuteria",   metal: "rose"  }
];

window.MJ_PRODUTOS = [
  // Alianças
  { id: "MJ-A01", cat: "alianca", mat: "ouro18k",   nome: "Aliança Abaulada Tradicional 4mm", desc: "Modelo clássico, confortável para o uso diário. Vendida por unidade ou em par.", preco: null, desenho: "par", novo: false },
  { id: "MJ-A02", cat: "alianca", mat: "tungstenio",nome: "Aliança Reta Fosca 6mm",           desc: "Tungstênio de alta resistência a riscos, acabamento fosco com bordas polidas.", preco: null, desenho: "par", novo: true },
  { id: "MJ-A03", cat: "alianca", mat: "prata",     nome: "Aliança Anatômica com Friso",      desc: "Prata 925 com friso central polido. Ideal para compromisso.", preco: null, desenho: "par" },
  { id: "MJ-A04", cat: "alianca", mat: "folheado",  nome: "Par de Alianças Lisas",            desc: "Par folheado a ouro, ótimo custo-benefício para namoro.", preco: null, desenho: "par" },

  // Anéis
  { id: "MJ-N01", cat: "anel", mat: "prata",     nome: "Anel Solitário Zircônia",   desc: "Prata 925 com zircônia lapidada em garras. Delicado e atemporal.", preco: null, desenho: "solitario", novo: true },
  { id: "MJ-N02", cat: "anel", mat: "semijoia",  nome: "Anel Aparador Cravejado",   desc: "Fileira de zircônias, perfeito para usar junto da aliança.", preco: null, desenho: "aparador" },
  { id: "MJ-N03", cat: "anel", mat: "joia",      nome: "Anel de Formatura",         desc: "Pedra central e personalização com o curso. Consulte prazos.", preco: null, desenho: "formatura" },
  { id: "MJ-N04", cat: "anel", mat: "bijuteria", nome: "Anel Ajustável Flor",       desc: "Aro regulável, leve e divertido para o dia a dia.", preco: null, desenho: "flor" },

  // Pingentes
  { id: "MJ-P01", cat: "pingente", mat: "ouro18k",  nome: "Pingente Coração Vazado",    desc: "Ouro 18K, coração vazado com acabamento polido.", preco: null, desenho: "coracao" },
  { id: "MJ-P02", cat: "pingente", mat: "folheado", nome: "Pingente Letra Inicial",     desc: "Escolha a letra pelo WhatsApp. Combina com corrente fina.", preco: null, desenho: "letra", novo: true },
  { id: "MJ-P03", cat: "pingente", mat: "prata",    nome: "Pingente Gota de Luz",       desc: "Zircônia em formato de gota, presa em prata 925.", preco: null, desenho: "gota" },

  // Brincos
  { id: "MJ-B01", cat: "brinco", mat: "semijoia",  nome: "Brinco Argola Lisa Média",  desc: "Argola de 3cm com fecho click. Peça curinga.", preco: null, desenho: "argola" },
  { id: "MJ-B02", cat: "brinco", mat: "ouro18k",   nome: "Brinco Ponto de Luz",       desc: "Zircônia em garras, ouro 18K. Discreto e elegante.", preco: null, desenho: "ponto" },
  { id: "MJ-B03", cat: "brinco", mat: "bijuteria", nome: "Brinco Gota Cristal",       desc: "Gota de cristal com gancho, para ocasiões especiais.", preco: null, desenho: "gota" },
  { id: "MJ-B04", cat: "brinco", mat: "prata",     nome: "Ear Cuff Cravejado",        desc: "Prata 925, encaixa na cartilagem sem furo.", preco: null, desenho: "cuff", novo: true },

  // Pulseiras
  { id: "MJ-U01", cat: "pulseira", mat: "semijoia", nome: "Pulseira Riviera Zircônia", desc: "Fileira de zircônias com fecho gaveta.", preco: null, desenho: "riviera" },
  { id: "MJ-U02", cat: "pulseira", mat: "prata",    nome: "Pulseira Elos Cartier",     desc: "Prata 925, elos alternados. Unissex.", preco: null, desenho: "elos" },
  { id: "MJ-U03", cat: "pulseira", mat: "folheado", nome: "Pulseira de Berloques",     desc: "Base para berloques, monte do seu jeito.", preco: null, desenho: "berloques" },

  // Colares
  { id: "MJ-C01", cat: "colar", mat: "semijoia",  nome: "Colar Gravatinha",          desc: "Fio delicado com detalhe em Y e zircônia.", preco: null, desenho: "gravatinha" },
  { id: "MJ-C02", cat: "colar", mat: "bijuteria", nome: "Colar Choker de Pérolas",   desc: "Pérolas sintéticas, comprimento ajustável.", preco: null, desenho: "perolas", novo: true },
  { id: "MJ-C03", cat: "colar", mat: "ouro18k",   nome: "Colar Ponto de Luz",        desc: "Ouro 18K com zircônia central, 45cm.", preco: null, desenho: "ponto" },

  // Correntes
  { id: "MJ-R01", cat: "corrente", mat: "prata",    nome: "Corrente Cordão Baiano 60cm", desc: "Prata 925 maciça, elos trançados.", preco: null, desenho: "baiano" },
  { id: "MJ-R02", cat: "corrente", mat: "ouro18k",  nome: "Corrente Grumet 50cm",        desc: "Ouro 18K, elos achatados e brilho intenso.", preco: null, desenho: "grumet" },
  { id: "MJ-R03", cat: "corrente", mat: "folheado", nome: "Corrente Veneziana 45cm",     desc: "Fina e resistente, ideal para pingentes.", preco: null, desenho: "veneziana" },

  // Tornozeleiras
  { id: "MJ-T01", cat: "tornozeleira", mat: "prata",    nome: "Tornozeleira Bolinhas",  desc: "Prata 925 com bolinhas alternadas.", preco: null, desenho: "bolinhas" },
  { id: "MJ-T02", cat: "tornozeleira", mat: "folheado", nome: "Tornozeleira Estrelas",  desc: "Pingentes de estrela, leve e solar.", preco: null, desenho: "estrelas" },

  // Piercings
  { id: "MJ-K01", cat: "piercing", mat: "prata", nome: "Piercing Argola de Nariz", desc: "Argola fina em prata, encaixe seguro.", preco: null, desenho: "argola" },
  { id: "MJ-K02", cat: "piercing", mat: "joia",  nome: "Piercing Tragus Zircônia", desc: "Haste com rosca e zircônia frontal.", preco: null, desenho: "tragus" },
  { id: "MJ-K03", cat: "piercing", mat: "semijoia", nome: "Piercing Helix Bolinha", desc: "Argola com bolinha, para cartilagem.", preco: null, desenho: "helix" }
];

/* Contatos das lojas */
window.MJ_LOJAS = {
  tucano: { nome: "Tucano",            wa: "5575991106665" },
  pombal: { nome: "Ribeira do Pombal", wa: "5575988548714" }
};
