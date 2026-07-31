export interface StoryPreset {
  title: string;
  direction: string;
  category: string;
  theme: string;
  cefr_level: string;
  label: string;
  image: string;
}

export const storyPresets: StoryPreset[] = [
  { title: "The Missing Piece", label: "Berlin / thriller", direction: "EN_DE", category: "novel", cefr_level: "A2", theme: "A bike courier in Berlin accidentally picks up the wrong package and becomes the target of a smuggling ring.", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=85" },
  { title: "Last Train Home", label: "Night / connection", direction: "DE_EN", category: "novel", cefr_level: "B1", theme: "Two strangers miss the last train out of Hamburg and discover they may be headed toward the same secret.", image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85" },
  { title: "Café at 7:15", label: "Everyday / dialogue", direction: "EN_DE", category: "modern_genz", cefr_level: "B1", theme: "A regular at a small café finds a handwritten message tucked beneath their usual cup.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85" },
];
