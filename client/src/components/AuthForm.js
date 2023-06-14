export const AuthForm = ({username, setUsername, password, setPassword, handleSubmit, authText}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>{authText}</h2>
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
        <button type="submit">{authText}</button>
      </form>
    </div>
  );
}
