import { useState } from "react";

function App() {
  const [handle, setHandle] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    setError("");
    setUserData(null);

    try {
      const res = await fetch(
        `https://codeforces.com/api/user.info?handles=${handle}`
      );

      const data = await res.json();   

      
      if (data.status === "FAILED") {
        setError("Invalid Codeforces handle");
        return;
      }

      setUserData(data.result[0]);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div>
      <h1>Codeforces Analytics Dashboard</h1>

      <input
        type="text"
        placeholder="Enter Codeforces handle"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />

      <button onClick={fetchUser}>Analyze</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

{userData && (
  <div>
    <p><b>Handle:</b> {userData.handle}</p>
    <p><b>Rating:</b> {userData.rating ?? "Unrated"}</p>
    <p><b>Max Rating:</b> {userData.maxRating ?? "Unrated"}</p>
    <p><b>Rank:</b> {userData.rank ?? "Unranked"}</p>
  </div>
)}


    </div>
  );
}

export default App;
