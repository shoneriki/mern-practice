import {Button, Box, Typography} from "@mui/material"

export const AuthForm = ({username, setUsername, password, setPassword, handleSubmit, label}) => {
  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Typography variant={'h6'} sx={{margin: "1rem 0"}}>{label}</Typography>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            margin: "1rem 0"
          }}
        >
          {label}
        </Button>
      </form>
    </Box>
  );
}
