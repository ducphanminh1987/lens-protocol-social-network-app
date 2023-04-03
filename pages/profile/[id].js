import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { QueryProfile, apolloClient, QueryPublications } from "../query";
import { gql } from "@apollo/client";
import Image from "next/image";

export default function Profile() {
  const router = useRouter();

  const { id } = router.query;

  const [profile, setProfile] = useState();

  const [publications, setPublications] = useState([]);

  useEffect(() => {
    if (id) {
      loadProfile(id).then(setProfile);
      loadPublications(id).then(setPublications);
    }
  }, [id]);

  async function loadProfile(id) {
    const response = await apolloClient.query({
      query: gql(QueryProfile),
      variables: {
        id,
      },
    });
    console.log("🚀 ~ file: [id].js:24 ~ loadProfile ~ response:", response);
    return response.data.profiles.items[0];
  }

  async function loadPublications(id) {
    const response = await apolloClient.query({
      query: gql(QueryPublications),
      variables: {
        id,
      },
    });
    console.log(
      "🚀 ~ file: [id].js:41 ~ loadPublications ~ response:",
      response
    );
    return response.data.publications.items;
  }

  return (
    <>
      {profile && (
        <div>
          <Image
            width={120}
            height={120}
            alt={profile.name}
            src={getImageUrl(profile?.picture?.original?.url)}
          ></Image>
          <h4>{profile?.name}</h4>
          <p>{profile?.bio}</p>
          <p>Total Followers: {profile?.stats?.totalFollowers ?? 0}</p>
          <p>Total Following: {profile?.stats?.totalFollowing ?? 0}</p>
          <h4>POSTS</h4>
          {publications.map((publication) => (
            <PublicationDetails
              key={publication.id}
              publication={publication}
            ></PublicationDetails>
          ))}
        </div>
      )}
    </>
  );
}

const PublicationDetails = ({ publication }) => {
  return (
    <p>{`Post on ${publication.createdAt}: ${
      publication?.metadata?.content ?? ""
    }`}</p>
  );
};

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return;

  if (imageUrl.startsWith("https")) return imageUrl;

  const id = imageUrl.replaceAll("ipfs://", "");
  return `https://ipfs.io/ipfs/${id}`;
};
