function ErrorDisplay({ title=" Erreur", message }) {
  return (
    <div className="form__error">
      <h2>⚠️{title}</h2>
      <p>{message}</p>
    </div>
  );
}

export default ErrorDisplay;