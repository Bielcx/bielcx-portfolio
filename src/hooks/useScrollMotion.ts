import { useEffect, useRef } from 'react'
import { createScope, createTimeline, onScroll, type ScrollObserverParams, type Timeline } from 'animejs'

/**
 * Movimento de entrada dirigido pela rolagem, com o anime.js.
 *
 * `build` recebe o elemento do `ref` e monta ali dentro as timelines — cada
 * uma criada pelo `naRolagem` e fechada pelo `assentar` —, então quem dirige o progresso é a posição
 * da página e subir de volta desfaz o movimento. Nada de estado acumulado.
 *
 * Tudo nasce dentro de um `createScope`, e o `revert()` da limpeza desfaz
 * animações, observadores de rolagem e os `splitText` de uma vez, devolvendo
 * os estilos inline e o texto original. É o que deixa o StrictMode montar duas
 * vezes sem duplicar nada.
 *
 * O estado inicial (opacidade 0, deslocado) só existe enquanto o script roda:
 * no CSS não há nada escondido. Com movimento reduzido o hook nem monta, e a
 * página fica como está no markup — inteira e parada.
 *
 * `build` precisa ser estável (função de módulo), senão o efeito refaz tudo a
 * cada render.
 */
export function useScrollMotion<T extends HTMLElement>(build: (root: T) => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const scope = createScope({ root }).add(() => build(root))
    return () => scope.revert()
  }, [build])

  return ref
}

/**
 * Timeline amarrada à rolagem de `target`. `enter`/`leave` são "janela alvo":
 * `'bottom top'` é o topo do bloco encostando no pé da janela. O `sync`
 * numérico suaviza o progresso (interpola em direção à posição real a cada
 * quadro) — é o deslizar do site do anime.js, e continua nos dois sentidos.
 * As posições e durações de quem a usa são fração do curso, não tempo.
 */
export const naRolagem = (
  target: HTMLElement,
  leave: ScrollObserverParams['leave'] = '45% top',
  enter: ScrollObserverParams['enter'] = 'bottom top',
) =>
  createTimeline({
    autoplay: onScroll({ target, enter, leave, sync: 0.35 }),
    defaults: { ease: 'outQuad', duration: 500 },
  })

/**
 * **Chame no fim de toda timeline montada.** O anime.js só escreve o valor
 * inicial de um tween quando o progresso chega ao começo dele: até lá o
 * elemento fica como no markup, VISÍVEL. Sem isto, a palavra que ainda não
 * entrou aparece inteira e some quando a vez dela chega — um pisca ao
 * contrário. Ir ao fim e voltar ao zero, sem disparar callbacks, escreve o
 * estado inicial de todos; o observador de rolagem põe no lugar certo no
 * quadro seguinte.
 */
export const assentar = (tl: Timeline) => tl.seek(tl.duration, true).seek(0, true)
