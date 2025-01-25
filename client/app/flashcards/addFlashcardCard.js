import { Fade, Grid, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter } from "next/navigation";

const AddFlashcardCard = () => {

  const router = useRouter();

  return (
    <Fade in timeout={200}>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ minHeight: 200 }}>
          <CardActionArea sx={{ minHeight: 200 }} onClick={() => router.push("/generate")}>
            <CardContent 
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h6">Click here to create one!</Typography>
              <AddCircleIcon />
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Fade>
  );
}

export default AddFlashcardCard;