import { useState } from "react";

function App() {
  const [handle, setHandle] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [solvedCount, setSolvedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ratingMap, setRatingMap] = useState({});
  const [bucketMap, setBucketMap] = useState({});
  const [bestRating, setBestRating] = useState(null);





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
   



const buildRatingMap = (submissions) => {
  const solvedSet = new Set();
  const ratingCount = {};

  submissions.forEach((sub) => {
    if (sub.verdict === "OK") {
      const name = sub.problem.name;
      const rating = sub.problem.rating;

      if (!rating) return;

      if (!solvedSet.has(name)) {
        solvedSet.add(name);
        ratingCount[rating] = (ratingCount[rating] || 0) + 1;
      }
    }
  });

  return {
    solvedCount: solvedSet.size,
    ratingCount
  };
};





const buildBucketMap = (ratingMap) => {
  const buckets = {};

  Object.entries(ratingMap).forEach(([rating, count]) => {
    const r = Number(rating);
    const start = Math.floor(r / 200) * 200;
    const end = start + 200;
    const key = `${start}-${end}`;

    buckets[key] = (buckets[key] || 0) + count;
  });

  return buckets;
};





 const fetchSolved = async () => {
  if (!handle.trim()) return;

  setLoading(true);
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

    const { solvedCount, ratingCount } = buildRatingMap(data.result);
    const buckets = buildBucketMap(ratingCount);


    let maxRating = null;
    Object.keys(ratingCount).forEach((r) => {
      const rating = Number(r);
      if (maxRating === null || rating > maxRating) {
        maxRating = rating;
      }
    });


    setSolvedCount(solvedCount);
    setRatingMap(ratingCount);
    setBucketMap(buckets);
    setBestRating(maxRating);

  } catch (err) {
    setError("Something went wrong");
  }

  setLoading(false);
};


//return  //////



 return (
  <div>
    <h1>Codeforces Analytics Dashboard</h1>
    
    <div style={{ marginBottom: "12px" }}></div>


   <form
  onSubmit={(e) => {
    e.preventDefault(); 
    fetchUser();
    fetchSolved();
  }}
>
  <input
    type="text"
    placeholder="Enter Codeforces handle"
    value={handle}
    onChange={(e) => setHandle(e.target.value)}
  />

  <button type="submit">
    Analyze
  </button>
</form>



    {error && <p style={{ color: "red" }}>{error}</p>}

    {userData && (
      <div>
        <hr />
        <h2>User Info</h2>
        <p><b>Handle:</b> {userData.handle}</p>
        <p><b>Rating:</b> {userData.rating ?? "Unrated"}</p>
        <p><b>Max Rating:</b> {userData.maxRating ?? "Unrated"}</p>
        <p><b>Rank:</b> {userData.rank ?? "Unranked"}</p>
      </div>
    )}
   
  
  
  
   {(solvedCount > 0 || Object.keys(ratingMap).length > 0) && (
  <>
    <hr />
    <h2>Analytics</h2>
  </>
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


{bestRating && (
  <p>
    <b>Highest Rated Problem Solved:</b> {bestRating}
  </p>
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
