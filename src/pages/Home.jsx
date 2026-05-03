import React, { useState, useEffect } from 'react';
import { generateLocalCommunities } from '../utils/gemini';
import CommunityCard from '../components/CommunityCard';
import CommunityModal from '../components/CommunityModal';
import Navbar from '../components/Navbar';
import { Loader2, RefreshCw, MapPin, Globe, Users, CalendarDays } from 'lucide-react';

const FALLBACK = {
  trending_global: [
    {
      id: 'tg1', name: 'IPL 2025 — Live Updates', emoji: '🏏',
      category: 'trending_global',
      shortDescription: 'Live scores, reactions and spicy takes from every IPL match.',
      fullDescription: 'The whole country is watching IPL 2025. Share live reactions, debate selections, celebrate sixes and mourn wickets together in real time.',
      memberCount: '2.1L', postsPerDay: 8400, isLive: true, eventDate: null,
      tags: ['ipl', 'cricket', 'live'], discussionTopics: ['Live match reactions', 'Player of the match debates', 'Fantasy cricket tips'],
      aiGenerated: true, trending: true,
    },
    {
      id: 'tg2', name: 'Budget 2025 Decoded', emoji: '💰',
      category: 'trending_global',
      shortDescription: 'What does the Union Budget actually mean for your pocket?',
      fullDescription: 'Economists, salaried folks, business owners and students decoding Budget 2025 together. No jargon, just plain talk about what changed for you.',
      memberCount: '45.3K', postsPerDay: 1200, isLive: false, eventDate: null,
      tags: ['budget', 'finance', 'india'], discussionTopics: ['Tax slab changes', 'What got cheaper', 'Impact on middle class'],
      aiGenerated: true, trending: true,
    },
  ],
  trending_local: [
    {
      id: 'tl1', name: 'Lajpat Nagar Power Cuts', emoji: '⚡',
      category: 'trending_local',
      shortDescription: 'Residents discussing the ongoing power outages in Lajpat Nagar.',
      fullDescription: 'Multiple blocks in Lajpat Nagar facing daily power cuts. Residents sharing updates, BSES complaint numbers and alternative solutions together.',
      memberCount: '340', postsPerDay: 45, isLive: false, eventDate: null,
      tags: ['lajpatnagar', 'powercut', 'delhi'], discussionTopics: ['Which blocks are affected', 'BSES complaint process', 'Generator/inverter recommendations'],
      aiGenerated: true, trending: false,
    },
  ],
  interest_local: [
    {
      id: 'il1', name: 'Morning Runners — Lajpat Nagar', emoji: '🏃',
      category: 'interest_local',
      shortDescription: 'Early risers who run in and around Lajpat Nagar park every morning.',
      fullDescription: 'A tight-knit group of morning runners from Lajpat Nagar who meet at the park daily. Share routes, motivate each other and plan weekend runs together.',
      memberCount: '128', postsPerDay: 18, isLive: false, eventDate: null,
      tags: ['running', 'fitness', 'lajpatnagar'], discussionTopics: ['Best running routes nearby', 'Morning meetup timings', 'Gear recommendations'],
      aiGenerated: true, trending: false,
    },
  ],
  events: [
    {
      id: 'ev1', name: 'Dilli Haat Craft Mela', emoji: '🎨',
      category: 'events',
      shortDescription: 'Annual craft fair at Dilli Haat — find out what\'s happening this year.',
      fullDescription: 'Dilli Haat\'s summer craft mela is back. Artisans from 25 states, live performances and incredible food. Plan your visit with fellow Delhiites.',
      memberCount: '2.1K', postsPerDay: 210, isLive: false, eventDate: 'Sat, 17 May',
      tags: ['dillihaat', 'craftmela', 'delhi'], discussionTopics: ['Best stalls to visit', 'Parking tips', 'Timings and entry'],
      aiGenerated: true, trending: false,
    },
  ],
};

const TABS = [
  { id: 'all', label: '✨ All', icon: null },
  { id: 'trending_global', label: '🌍 Global', icon: Globe },
  { id: 'trending_local', label: '📍 Local', icon: MapPin },
  { id: 'interest_local', label: '🤝 People', icon: Users },
  { id: 'events', label: '📅 Events', icon: CalendarDays },
];

const SECTION_HEADERS = {
  trending_global: { title: '🌍 Global Trending', subtitle: 'What all of India is talking about right now' },
  trending_local: { title: '📍 Local Buzz', subtitle: 'What\'s happening in your area' },
  interest_local: { title: '🤝 Find Your People Nearby', subtitle: 'Others in your locality with the same interests' },
  events: { title: '📅 Events Near You', subtitle: 'Join the conversation around upcoming events' },
};

export default function Home() {
  const user = JSON.parse(localStorage.getItem('mohalla_user') || '{}');
  const [communities, setCommunities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [joinedIds, setJoinedIds] = useState(() =>
    JSON.parse(localStorage.getItem('mohalla_joined') || '[]')
  );

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { loadCommunities(); }, []);

  const loadCommunities = async () => {
    const result = await generateLocalCommunities(user);
const data = result || FALLBACK;
setCommunities(data);

// Cache all communities so MyCommunities page can access them
const allComms = [
  ...(data.trending_global || []),
  ...(data.trending_local || []),
  ...(data.interest_local || []),
  ...(data.events || []),
];
// Merge with existing cache so previously seen communities aren't lost
const existingCache = JSON.parse(localStorage.getItem('mohalla_all_communities') || '[]');
const existingIds = new Set(existingCache.map(c => c.id));
const merged = [...existingCache, ...allComms.filter(c => !existingIds.has(c.id))];
localStorage.setItem('mohalla_all_communities', JSON.stringify(merged));

setLoading(false);
  };

  const handleJoin = (id) => {
    const updated = joinedIds.includes(id)
      ? joinedIds.filter(j => j !== id)
      : [...joinedIds, id];
    setJoinedIds(updated);
    localStorage.setItem('mohalla_joined', JSON.stringify(updated));
  };

  const getFilteredCommunities = () => {
    if (!communities) return [];
    if (activeTab === 'all') {
      return [
        ...(communities.trending_global || []),
        ...(communities.trending_local || []),
        ...(communities.interest_local || []),
        ...(communities.events || []),
      ];
    }
    return communities[activeTab] || [];
  };

  const renderSectionedAll = () => {
    if (!communities) return null;
    const order = ['trending_global', 'trending_local', 'interest_local', 'events'];
    return order.map(cat => {
      const items = communities[cat];
      if (!items || items.length === 0) return null;
      const header = SECTION_HEADERS[cat];
      return (
        <div key={cat} className="mb-6">
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 text-base">{header.title}</h2>
            <p className="text-xs text-gray-500">{header.subtitle}</p>
          </div>
          <div className="space-y-3">
            {items.map(community => (
              <CommunityCard
                key={community.id}
                community={community}
                onJoin={handleJoin}
                onOpen={setSelectedCommunity}
                joined={joinedIds.includes(community.id)}
              />
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">

      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-3 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">🏘️ Mohalla</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-orange-500" />
              <p className="text-xs text-gray-500">
                {user.locality
                  ? `${user.locality}, ${user.city}`
                  : user.city || 'India'} · Namaste, {user.name?.split(' ')[0]} 👋
              </p>
            </div>
          </div>
          <button
            onClick={loadCommunities}
            disabled={loading}
            className="p-2 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 pb-28">
        {loading ? (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
              <Loader2 size={18} className="text-purple-500 animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-purple-800">
                  AI is scanning your Mohalla...
                </p>
                <p className="text-xs text-purple-500 mt-0.5">
                  Finding global trends + what's happening in {user.locality || user.city || 'your area'}
                </p>
              </div>
            </div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse border border-gray-100">
                <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-40 mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-24" />
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-4" />
                <div className="flex gap-2">
                  <div className="h-9 bg-orange-100 rounded-xl flex-1" />
                  <div className="h-9 bg-gray-100 rounded-xl w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* AI banner */}
            {/* Debug + AI banner */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 mb-5 text-white">
            <p className="text-xs font-semibold opacity-80 mb-1">✨ Gemini AI · Live Search</p>
            <p className="text-sm font-bold">
                {getFilteredCommunities().length} communities curated for {user.locality || user.city || 'you'}
            </p>
            <p className="text-xs opacity-75 mt-0.5">
                Powered by real-time Google Search · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            </div>

            {activeTab === 'all'
              ? renderSectionedAll()
              : (
                <div className="space-y-3">
                  {communities[activeTab]?.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-3xl mb-2">🔍</p>
                      <p className="text-sm">No communities in this category yet</p>
                      <button onClick={loadCommunities} className="mt-3 text-orange-500 text-sm font-medium">
                        Try refreshing
                      </button>
                    </div>
                  )}
                  {getFilteredCommunities().map(community => (
                    <CommunityCard
                      key={community.id}
                      community={community}
                      onJoin={handleJoin}
                      onOpen={setSelectedCommunity}
                      joined={joinedIds.includes(community.id)}
                    />
                  ))}
                </div>
              )
            }
          </>
        )}
      </div>

      {selectedCommunity && (
        <CommunityModal
          community={selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
          onJoin={handleJoin}
          joined={joinedIds.includes(selectedCommunity.id)}
        />
      )}

      <Navbar active="home" />
    </div>
  );
}