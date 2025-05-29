import { useRef } from "react";
import emailjs from "@emailjs/browser";

export const ContactUs = () => {
  const form = useRef();

  const SERVICE_ID = "service_dicf7dq";
  const TEMPLATE_ID = "template_gs4rnjf";
  const PUBLIC_KEY = "KUsWFUTSrViBBXM6W";

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target, PUBLIC_KEY).then(
      () => {
        console.log("SUCCESS!");
      },
      (error) => {
        console.log("FAILED...", error.text);
      }
    );
    e.target.reset();
  };

  return (
    <form className="contact__form" ref={form} onSubmit={sendEmail}>
      <label htmlFor="nom">Ecrivez votre nom :</label>
      <input
        type="text"
        className="contact__input"
        id="nom"
        name="nom"
        required
      ></input>
      <br />
      <label htmlFor="mail">Ecrivez votre email :</label>
      <input
        type="email"
        className="contact__input"
        id="mail"
        name="email"
        required
      ></input>
      <br />
      <label htmlFor="objet">Ecrivez l'objet de votre message :</label>
      <input
        type="text"
        className="contact__input"
        id="objet"
        name="objet"
        required
      ></input>
      <br />
      <label htmlFor="msg">
        Ecrivez ce que voulez qui apparaîssent sur votre profil :
      </label>
      <textarea
        className="contact__msg"
        id="msg"
        name="message"
        placeholder="Si vous voulez apparaître sur le site,veuillez remplir le formulaire svp."
        required
      ></textarea>
      <br />
      <button type="submit" className="contact__button">
        Envoyer
      </button>
    </form>
  );
};

function Contact() {
  return (
    <section id="contact" className="contact">
      <h2 className="contact__title">CONTACTER :</h2>
      <ContactUs />
    </section>
  );
}

export default Contact;
