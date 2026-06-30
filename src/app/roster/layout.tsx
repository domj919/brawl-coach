import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Roster",
  description:
    "Set up your Brawl Stars brawler roster — track power levels, gadgets, star powers, gears, hypercharges and buffies so draft recommendations are personalised to what you own.",
  keywords: [
    "brawl stars roster", "brawl stars brawler levels", "brawl stars gadgets star powers",
    "brawl stars upgrade tracker",
  ],
};

export default function RosterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
