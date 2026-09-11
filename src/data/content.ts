/**
 * Camada de conteúdo — ponto único de onde os componentes leem texto.
 *
 * O site nasceu só em português. O `sopa-agency`, de onde esta base veio, tem
 * duas locales estáticas (`/` e `/en/`) e este arquivo era o seletor entre
 * elas; aqui ele é só um reexport. Se um dia o inglês entrar, o caminho já
 * está desenhado: um `en/index.html` com o seu `lang`, um `content.en.ts` com
 * as mesmas chaves, e a escolha volta para cá lendo
 * `document.documentElement.lang`.
 *
 * Para mudar qualquer palavra do site, mexa em `content.pt.ts`. Nunca aqui.
 */

import { pt } from './content.pt'

export const { nav, hero, metodo, services, faq, footer, whatsappUrl } = pt
