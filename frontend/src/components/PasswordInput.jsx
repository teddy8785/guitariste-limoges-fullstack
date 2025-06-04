import React, { useState } from "react";

const PasswordInput = ({ value, onChange, name, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form__input-container">
      <input
        type={showPassword ? "text" : "password"}
        className="form__input"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      <i
        className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} form__toggle--password`}
        onClick={() => setShowPassword(!showPassword)}
        role="button"
        tabIndex={0}
        aria-label="Afficher ou masquer le mot de passe"
      />
    </div>
  );
};

export default PasswordInput;