export const site = {
  name: 'Bangla Vibe Daily',
  shortName: 'BVD',
  tagline: "Bangla's vibe, the world's stories",
  taglineBn: 'বাংলার ভাইব, বিশ্বের গল্প',
  pitch:
    'Interesting stories, amazing facts, inspiring ideas and entertainment — from Bangladesh and around the world. New video every day!',
  pitchBn: 'বাংলাদেশ ও সারা বিশ্বের মজার গল্প, অবাক করা তথ্য, অনুপ্রেরণা আর বিনোদন — প্রতিদিন নতুন ভিডিও।',
  url: 'https://banglavibedaily.github.io',
};

export const links = {
  youtube: 'https://www.youtube.com/@BanglaVibeDaily',
  subscribe: 'https://www.youtube.com/@BanglaVibeDaily?sub_confirmation=1',
  facebook: 'https://www.facebook.com/BanglaVibeDaily',
  channelId: 'UCECjH_U3T2l4SSXiVtBrajQ',
  feedUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCECjH_U3T2l4SSXiVtBrajQ',
  youtubeHandle: '@BanglaVibeDaily',
  facebookHandle: '/BanglaVibeDaily',
};

export const nav = [
  { id: 'categories', label: 'Categories' },
  { id: 'videos', label: 'Videos' },
  { id: 'about', label: 'About' },
  { id: 'follow', label: 'Follow' },
];

export const categories = [
  {
    id: 'stories',
    emoji: '🎬',
    name: 'Stories',
    nameBn: 'গল্প',
    blurb: 'Real-life tales, legends and stories that stay with you.',
  },
  {
    id: 'facts',
    emoji: '🧠',
    name: 'Facts & Knowledge',
    nameBn: 'তথ্য ও জ্ঞান',
    blurb: 'Surprising facts and easy explainers about how the world works.',
  },
  {
    id: 'ideas',
    emoji: '💡',
    name: 'Ideas & Inspiration',
    nameBn: 'আইডিয়া ও অনুপ্রেরণা',
    blurb: 'Motivation, life lessons and ideas worth trying.',
  },
  {
    id: 'world',
    emoji: '🌍',
    name: 'Bangladesh & World',
    nameBn: 'বাংলাদেশ ও বিশ্ব',
    blurb: 'History, places and people — from Bangladesh to every corner of the globe.',
  },
  {
    id: 'trending',
    emoji: '🔥',
    name: 'Trending Topics',
    nameBn: 'আলোচিত বিষয়',
    blurb: 'What everyone is talking about, explained simply.',
  },
  {
    id: 'entertainment',
    emoji: '😂',
    name: 'Entertainment',
    nameBn: 'বিনোদন',
    blurb: 'Fun, laughter and feel-good moments.',
  },
  {
    id: 'tech',
    emoji: '🤖',
    name: 'Technology & AI',
    nameBn: 'প্রযুক্তি ও এআই',
    blurb: "Gadgets, apps and AI — what's new and why it matters.",
  },
];

export const about = {
  heading: 'Our Vibe',
  headingBn: 'আমাদের ভাইব',
  paragraphs: [
    'Bangla Vibe Daily is a home for curious minds. Every day we bring you stories, facts, ideas and entertainment — told in a way that feels close to home.',
    'From the rivers of Bangladesh to the latest in technology and AI, we explore what is interesting, inspiring and worth knowing. New content, every single day.',
  ],
};

// Hand-picked videos. Accepts a watch URL, youtu.be link, shorts link or a bare video id.
export const featured = [];

// Keeps third-party uploads out of the automatic "Latest videos" grid.
// Matching is a case-insensitive substring check against the video title.
// Remove 'rhyme' once Bangla Vibe Daily publishes its own rhyme videos.
export const skip = {
  titleKeywords: ['infobells', 'movkidz', 'rhyme'],
  videoIds: [],
};
