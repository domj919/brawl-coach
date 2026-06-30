import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draft Advisor",
  description:
    "Pick the best Brawl Stars brawler for your ranked match. Select your map, enter enemy picks, and get instant counter-pick recommendations personalised to your roster.",
  keywords: [
    "brawl stars what to pick ranked", "brawl stars counter pick", "brawl stars draft",
    "best brawler gem grab", "best brawler brawl ball", "brawl stars ranked pick",
  ],
};

export default function DraftLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
