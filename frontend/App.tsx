import "./index.css";

function App() {
  return (
    <div className="flex flex-col items-center gap-4 min-h-screen bg-gray-950 text-slate-100">
      <p className="text-3xl font-bold underline">Hello</p>
      <div>
        <button
          className="px-4 py-2 border-white border-2"
          onClick={() => {
            console.log("clicked");
            const doStuff = async () => {
              const response = await fetch("http://localhost:8002/json");
              console.log(response);
              const json = await response.json();
              console.log(json);
            };
            doStuff();
          }}
        >
          Test backend
        </button>
      </div>
    </div>
  );
}

export default App;
