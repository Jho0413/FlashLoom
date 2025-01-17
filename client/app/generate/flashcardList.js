import { Grid } from "@mui/material";
import Flashcard from "./flashcard";

const FlashCardList = ({ flashcards, flippedStates, setFlippedStates }) => {

  const handleCardClick = (index) => {
    setFlippedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (flashcards.length > 0) {
    return (
      <Grid container spacing={2}>
        {flashcards.map((flashcard, index) => (
          <Flashcard 
            key={index}
            {...flashcard}
            flipped={flippedStates[index]}
            handleCardClick={handleCardClick}
            index={index}
          />
        ))}
      </Grid>
    );
  }
  return <div></div>
}

export default FlashCardList;