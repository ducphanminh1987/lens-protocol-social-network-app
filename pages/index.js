import React, { useEffect, useState } from "react";
import { apolloClient, ProfileQuery } from "./query.js";
import { gql } from "@apollo/client";
import Link from "next/link.js";
import Image from "next/image";

export default function Home() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    const response = await apolloClient.query({
      query: gql(ProfileQuery),
    });
    setProfiles(response.data.recommendedProfiles.slice(0, 20));
  }

  return (
    <div>
      {profiles.map((profile) => (
        <ProfileDetails key={profile.id} profile={profile} />
      ))}
    </div>
  );
}

const ProfileDetails = ({ profile }) => {
  return (
    <div>
      <Link href={`/profile/${profile.id}`}>
        <Image
          width={60}
          height={60}
          alt={profile.name}
          src={getImageUrl(profile?.picture?.original?.url)}
        ></Image>
      </Link>
      <h4>{profile.name}</h4>
      <p>{profile.bio}</p>
    </div>
  );
};

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return;

  if (imageUrl.startsWith("https")) return imageUrl;

  const id = imageUrl.replaceAll("ipfs://", "");
  return `https://ipfs.io/ipfs/${id}`;
};
