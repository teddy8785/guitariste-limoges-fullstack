import { useEffect, useState } from "react";

export function useLikes(items, token) {
  const [likesState, setLikesState] = useState({});

  useEffect(() => {
    if (!items?.length) return;

    const fetchLikes = async () => {
      try {
        const ids = items.map((i) => i._id);

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/likes/bulk`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({ ids }),
          }
        );

        if (!res.ok) throw new Error("bulk like error");

        const data = await res.json();
        setLikesState(data);
      } catch (err) {
        console.error("useLikes error:", err);
      }
    };

    fetchLikes();
  }, [items, token]);

  return likesState;
}