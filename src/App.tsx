import { Menu } from './components/Menu'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Metodo } from './sections/Metodo'
import { Services } from './sections/Services'

export default function App() {
  return (
    <main>
      <Menu />
      <Hero />
      <Metodo />
      <Services />
      <Footer />
    </main>
  )
}
