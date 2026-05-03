import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, ChevronRight, Search, Radio } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function MyCommunities() {
  const navigate = useNavigate();
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get all joined community IDs
    const joinedIds = JSON.parse(localStorage.getItem('mohalla_joined') || '[]');

    // Get all communities ever seen/cached
    const cached = JSON.parse(localStorage.getItem('mohalla_all_communities') || '[]');

    // Filter to only joined ones
    const joined = cached.filter(c => joinedIds.includes(c.id));
    setJoinedCommunities(joined);
  }, []);

  const handleOpen = (community) => {
    localStorage.setItem('mohalla_current_community', JSON.stringify(community));
    navigate(`/community/${community.id}`);
  };

  const handleLeave = (e, communityId) => {
    e.stopPropagation();
    const joinedIds = JSON.parse(localStorage.getItem('mohalla_joined') || '[]');
    const updated = joinedIds.filter(id => id !== communityId);
    localStorage.setItem('mohalla_joined', JSON.stringify(updated));
    setJoinedCommunities(prev => prev.filter(c => c.id !== communityId));
  };

  const filtered = joinedCommunities.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CATEGORY_COLORS = {
    trending_global: 'bg-blue-100 text-blue-600',
    trending_local: 'bg-green-100 text-green-700',
    interest_local: 'bg-orange-100 text-orange-600',
    events: 'bg-purple-100 text-purple-600',
  };

  const CATEGORY_LABELS = {
    trending_global: '🌍 Global',
    trending_local: '📍 Local',
    interest_local: '🤝 People',
    events: '📅 Event',
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">

      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-3">🏘️ My Communities</h1>
        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search your communities..."
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="px-4 py-4 pb-28">

        {/* Empty state */}
        {joinedCommunities.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏘️</div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">No communities yet</h2>
            <p className="text-sm text-gray-500 mb-6">
              Join communities from your home feed to see them here.
            </p>
            <button
              onClick={() => navigate('/home')}
              className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-orange-600 transition-colors"
            >
              Explore Communities →
            </button>
          </div>
        )}

        {/* Search empty state */}
        {joinedCommunities.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-gray-500 text-sm">No communities match "{searchQuery}"</p>
          </div>
        )}

        {/* Communities list */}
        {filtered.length > 0 && (
          <>
            <p className="text-xs text-gray-500 mb-3">
              {filtered.length} communit{filtered.length === 1 ? 'y' : 'ies'} joined
            </p>
            <div className="space-y-3">
              {filtered.map(community => (
                <div
                  key={community.id}
                  onClick={() => handleOpen(community)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-orange-200 transition-all active:scale-98"
                >
                  {/* Category + Live badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[community.category] || 'bg-gray-100 text-gray-600'}`}>
                      {CATEGORY_LABELS[community.category] || '✨ Community'}
                    </span>
                    {community.isLive && (
                      <span className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                        <Radio size={10} className="animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Main row */}
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">{community.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">
                        {community.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Users size={11} className="text-gray-400" />
                          <span className="text-xs text-gray-400">{community.memberCount}</span>
                        </div>
                        <span className="text-gray-300">·</span>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={11} className="text-gray-400" />
                          <span className="text-xs text-gray-400">{community.postsPerDay} posts/day</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {community.shortDescription}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-1" />
                  </div>

                  {/* Tags */}
                  {community.tags?.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-3">
                      {community.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom row */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className="text-xs text-green-600 font-medium">✓ Joined</span>
                    <button
                      onClick={(e) => handleLeave(e, community.id)}
                      className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Navbar active="communities" />
    </div>
  );
}