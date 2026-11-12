import HeroSection from '../components/HeroSection';
import MoodDiscoverySection from '../components/MoodDiscoverySection';
import FeaturedDrinksSection from '../components/FeaturedDrinksSection';
import MoodMatchSection from '../components/MoodMatchSection';
import CollabSection from '../components/CollabSection';
import BrandStorySection from '../components/BrandStorySection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MoodDiscoverySection />
      <FeaturedDrinksSection />
      <MoodMatchSection />
      <CollabSection />
      <BrandStorySection />
    </main>
  );
}
