export function artworkSize(art) {
  const dimensions = art.dimensions.match(/^\s*(\d+(?:\.\d+)?)\s*["″]?\s*[x×]\s*(\d+(?:\.\d+)?)/i);
  if (!dimensions) return null;
  const longestEdge = Math.max(Number(dimensions[1]), Number(dimensions[2]));
  return longestEdge <= 16 ? 'Small' : longestEdge <= 24 ? 'Medium' : 'Large';
}

export function matchesFilters(art, filters) {
  const framed = art.category === 'Framed' || /\bframed\b/i.test(art.style);
  return (!filters.available || !art.sold)
    && (!filters.framed || framed)
    && (!filters.sizes.size || filters.sizes.has(artworkSize(art)));
}
