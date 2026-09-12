import { useTheme } from './components/hooks/useTheme.js';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/sections/Hero.jsx';
import CategoryRibbon from './components/sections/CategoryRibbon.jsx';
import Categories from './components/sections/Categories.jsx';
import Featured from './components/sections/Featured.jsx';
import LatestVideos from './components/sections/LatestVideos.jsx';
import About from './components/sections/About.jsx';
import Follow from './components/sections/Follow.jsx';
import videos from './data/videos.json';

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-red focus:px-5 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Navbar theme={theme} toggle={toggle} />

      <main id="main">
        <Hero />
        <CategoryRibbon />
        <Categories />
        <Featured videos={videos.featured} />
        <LatestVideos videos={videos.latest} updatedAt={videos.updatedAt} />
        <About />
        <Follow />
      </main>

      <Footer />
    </>
  );
}
