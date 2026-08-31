import FlashcardGrid from "../components/ui/FlashcardGrid";
import Flashcard from "../components/ui/Flashcard";

export default function FlashcardList({ flashcards }) {
  if (!flashcards || flashcards.length === 0) return null;

  return (
    <FlashcardGrid>
      {flashcards.map((card, index) => (
        <Flashcard key={`${index}:${card.front}`} index={index} front={card.front} back={card.back} />
      ))}
    </FlashcardGrid>
  );
}
