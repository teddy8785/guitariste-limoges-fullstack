function ErrorDisplay({ title = "Erreur", message }) {
  if (!message) return null;

  return (
    <div className="form__error">
      <h2>⚠️ {title}</h2>
      {Array.isArray(message) ? (
        <ul>
          {message.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

export default ErrorDisplay;