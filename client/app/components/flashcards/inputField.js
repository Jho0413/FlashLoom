import { TextField } from "@mui/material";

const InputField = ({ name, label, rows, value, setValue, required }) => {
  return (
    <TextField
      name={name}
      value={value[name]}
      onChange={(e) => setValue(prev => (
        {...prev, [e.target.name]: e.target.value}
      ))}
      label={label}
      fullWidth
      multiline
      rows={rows}
      required={required}
      variant="outlined"
      sx={{ 
        mb: 2, 
        color: "white",
        "& .MuiInputLabel-root": { color: 'white' }, 
        "& .MuiInputLabel-root.Mui-focused": { color: "rgb(21, 101, 192)" },
        "& .MuiOutlinedInput-root": { "& > fieldset": { borderColor: "white" }},
        "&:hover .MuiOutlinedInput-root": { "& > fieldset": { borderColor: "rgb(21, 101, 192)" }},
      }}
      inputProps={{
        style: { 
          color: "white",
        },
      }}
    />
  )
}

export default InputField;