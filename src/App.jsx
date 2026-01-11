import { useState } from "react";

function App() {
  const [handle, setHandle] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const [solvedCount, setSolvedCount] = useState(0);
  const [loading, setLoading] = useState(false);


  const fetchUser = async () => {

    if (!handle.trim()) {
  setError("Please enter a Codeforces handle");
  return;
  }

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
   


  const fetchSolved = async () => {

    if (!handle.trim()) {
    return;
 }

  setLoading(true);
  setSolvedCount(0);
  setError("");

  try {
    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}`
    );

    const data = await res.json();

    if (data.status === "FAILED") {
      setError("Could not fetch submissions");
      setLoading(false);
      return;
    }

    const solvedSet = new Set();

    data.result.forEach((sub) => {
      if (sub.verdict === "OK") {
        solvedSet.add(sub.problem.name);
      }
    });

    setSolvedCount(solvedSet.size);
  } catch (err) {
    setError("Something went wrong");
  }

  setLoading(false);
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

    <button onClick={() => { fetchUser(); fetchSolved(); }}>
      Analyze
    </button>

    {error && <p style={{ color: "red" }}>{error}</p>}

    {userData && (
      <div>
        <p><b>Handle:</b> {userData.handle}</p>
        <p><b>Rating:</b> {userData.rating ?? "Unrated"}</p>
        <p><b>Max Rating:</b> {userData.maxRating ?? "Unrated"}</p>
        <p><b>Rank:</b> {userData.rank ?? "Unranked"}</p>
      </div>
    )}

    {loading && <p>Loading solved problems...</p>}

    {!loading && solvedCount > 0 && (
      <p><b>Total Solved Problems:</b> {solvedCount}</p>
    )}
  </div>
);

}

export default App;
