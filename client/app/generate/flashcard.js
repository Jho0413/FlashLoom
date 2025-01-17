import React from "react";
import { Grid, Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";

const Flashcard = ({ front, back, flipped, index, handleCardClick }) => {
  return (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card>
        <CardActionArea onClick={() => handleCardClick(index)}>
          <CardContent>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "240px",
                perspective: "1000px",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    padding: 2,
                    textAlign: "center",
                    overflow: "hidden",
                  }}
                >
                  <Typography component="div">
                    {front || "Front not available"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ddd",
                    padding: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography component="div">
                      {back || "Back not available"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
    );
};

export default Flashcard;