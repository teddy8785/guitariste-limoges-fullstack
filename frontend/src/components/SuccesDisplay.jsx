function SuccessDisplay({ title = "Succès", message }) {
  if (!message) return null;

  return (
    <div className="form__error">
      <h2>✅ {title}</h2>
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

export default SuccessDisplay;