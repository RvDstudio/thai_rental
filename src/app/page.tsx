import Hero from "@/components/Hero";
import { RecentProjects } from "@/components/RecentProjects";

export default function Home() {
  return (
    <div className="container mx-auto px-6 sm:px-6 lg:px-0">
      <div className="flex flex-col">
      <Hero />
      <RecentProjects />
    </div>
    </div>
  );
}
