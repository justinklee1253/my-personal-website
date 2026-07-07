function shape(track, playedAt) {
  if (!track?.name || !track.external_urls?.spotify) return null;
  const images = track.album?.images ?? [];
  return {
    title: track.name,
    artist: (track.artists ?? []).map((a) => a.name).join(", "),
    art: images.at(-1)?.url ?? null,
    artLarge: images[1]?.url ?? images[0]?.url ?? null,
    url: track.external_urls.spotify,
    playedAt,
  };
}

export function trimRecent(payload) {
  return (payload.items ?? [])
    .map(({ track, played_at }) => shape(track, played_at))
    .filter(Boolean);
}

export function trimTop(payload) {
  return (payload.items ?? []).map((track) => shape(track, null)).filter(Boolean);
}
