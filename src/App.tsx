import { useState } from "react";
import Articles from "./components/Articles";

function App() {
  // Déclaration du state pour le nom
  const [name, setName] = useState<string>(""); // valeur initiale vide

  // Fonction pour gérer le changement de l'input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mon App</h1>
      {/* Input lié au state */}
      <input
        type="text"
        placeholder="Tape ton nom..."
        value={name}
        onChange={handleChange}
        style={{ padding: "5px", marginBottom: "10px" }}
      />

      {/* On passe le state à Articles */}
      <Articles name={name} age={24} />
    </div>
  );
}

export default App;
