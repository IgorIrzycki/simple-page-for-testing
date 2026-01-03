import "./App.css";
import FormElements from "./components/FormElements";
import InteractiveElements from "./components/InteractiveElements";
import DynamicElements from "./components/DynamicElements";
import DataDisplay from "./components/DataDisplay";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 data-testid="page-title">UI Automation Test Lab</h1>
        <p className="subtitle">
          A demo application for testing various user interface components.
        </p>
      </header>

      <main>
        <section id="forms">
          <FormElements />
        </section>

        <section id="interactive">
          <InteractiveElements />
        </section>

        <section id="dynamic">
          <DynamicElements />
        </section>

        <section id="data">
          <DataDisplay />
        </section>
      </main>

      <footer>
        <p>© 2025 | Master's Thesis: Automation of Web UI Testing</p>
      </footer>
    </div>
  );
}

export default App;
