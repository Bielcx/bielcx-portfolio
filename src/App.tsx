import { Fundo } from './components/Fundo'
import { Menu } from './components/Menu'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Metodo } from './sections/Metodo'
import { Services } from './sections/Services'

export default function App() {
  /* `relative isolate` é o par do `-z-10` do `Fundo`: o isolamento cria o
     contexto de empilhamento em que a camada negativa fica ATRÁS das seções e
     à frente do `<body>`. Sem ele a camada escapa para trás do body e some. */
  return (
    <main className="relative isolate">
      <Fundo />
      <Menu />
      <Hero />
      <Metodo />
      <Services />
      <Footer />
    </main>
  )
}
