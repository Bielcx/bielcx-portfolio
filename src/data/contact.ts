/**
 * Os canais de contato. Ficam aqui, e não na copy, porque não são texto: são
 * endereço. O que muda de tom — rótulo de botão, mensagem que abre a conversa
 * — vive no `content.pt.ts`.
 *
 * `whatsapp` é só dígitos, no formato internacional: 55 + DDD + número. São 13
 * ao todo para um celular: 55 + 2 do DDD + 9 do número. Contar antes de trocar
 * — faltando um dígito o `wa.me` não reclama, só abre uma conversa vazia, e aí
 * TODO CTA do site vira link morto sem nenhum aviso.
 */
export const whatsapp = '5511960137983'

/** Canal de quem prefere escrever — vive no rodapé, ao pé do CTA. */
export const email = 'biel.cavalcanti1@hotmail.com'

/** O portfólio web3, para quem sabe o que é. Ver a nota no `content.pt.ts`. */
export const web3Url = 'https://gabrielcavalcanti.vercel.app'

/** Monta um link do WhatsApp com a mensagem já digitada na conversa. */
export const waLink = (message: string) =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
