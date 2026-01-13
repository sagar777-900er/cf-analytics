import { useState } from "react";

function App() {
  const [handle, setHandle] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const [solvedCount, setSolvedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ratingMap, setRatingMap] = useState({});
  const [bucketMap, setBucketMap] = useState({});




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
const ratingCount = {};

data.result.forEach((sub) => {
  if (sub.verdict === "OK") {
    const name = sub.problem.name;
    const rating = sub.problem.rating;

    if (!rating) return;   

    if (!solvedSet.has(name)) {
      solvedSet.add(name);

      if (ratingCount[rating]) {
        ratingCount[rating]++;
      } else {
        ratingCount[rating] = 1;
      }
    }
  }
}
);

setSolvedCount(solvedSet.size);
setRatingMap(ratingCount);


const buckets = {};

Object.entries(ratingCount).forEach(([rating, count]) => {
  const r = Number(rating);

  const bucketStart = Math.floor(r / 200) * 200;
  const bucketEnd = bucketStart + 200;

  const key = `${bucketStart}-${bucketEnd}`;

  if (buckets[key]) {
    buckets[key] += count;
  } else {
    buckets[key] = count;
  }
});

setBucketMap(buckets);



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

{Object.keys(ratingMap).length > 0 && (
  <div>
    <h3>Solved by Rating</h3>

    {Object.entries(ratingMap)
      .sort((a, b) => a[0] - b[0])
      .map(([rating, count]) => (
        <p key={rating}>
          {rating} : {count}
        </p>
      ))}
  </div>
)}




{Object.keys(bucketMap).length > 0 && (
  <div>
    <h3>Solved by Rating Buckets</h3>

    {Object.entries(bucketMap)
      .sort((a, b) => {
        const aStart = Number(a[0].split("-")[0]);
        const bStart = Number(b[0].split("-")[0]);
        return aStart - bStart;
      })
      .map(([bucket, count]) => (
        <p key={bucket}>
          {bucket} : {count}
        </p>
      ))}
  </div>
)}



  </div>
);

}

export default App;
