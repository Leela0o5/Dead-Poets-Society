import React, { useMemo } from "react";

const Avatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-32 h-32",
  };
  const avatarUrl = useMemo(() => {
    //  DETERMINE THE SEED
    // We prioritize the Unique ID (_id) because it is guaranteed to be unique for every user.
    // If _id is missing, we check username.
    // If 'user' is just a string ID (sometimes happens in props), we use that.
    let seed =
      user?._id || user?.username || (typeof user === "string" ? user : null);

    // RANDOM FALLBACK
    // If we still don't have a seed (e.g., anonymous user), generate a random one
    // so they don't look like a generic placeholder.
    if (!seed) {
      seed = Math.random().toString(36).substring(7);
    }

    // GENERATE URL
    // 'notionists' style allows for great variety.
    // We strictly use the unique seed to ensure no repeats.
    // We randomized the background colors to ensure visual distinction.
    return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,fdcce5,e6e6e6&radius=50`;
  }, [user]);

  return (
    <img
      src={avatarUrl}
      alt="User Avatar"
      className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200 shadow-sm bg-gray-50`}
      // If the image fails (rare), fallback to a random initial
      onError={(e) => {
        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${Math.random()}`;
      }}
    />
  );
};

export default Avatar;
