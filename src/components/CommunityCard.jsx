import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, Radio, Calendar } from 'lucide-react';

const CATEGORY_CONFIG = {
  trending_global: { label: '🌍 Global Trend', color: 'bg-blue-100 text-blue-600' },
  trending_local: { label: '📍 Local Buzz', color: 'bg-green-100 text-green-700' },
  interest_local: { label: '🤝 People Like You Nearby', color: 'bg-orange-100 text-orange-600' },
  events: { label: '📅 Upcoming Event', color: 'bg-purple-100 text-purple-600' },
};

export default function CommunityCard({ community, onJoin, onOpen, joined }) {
  const navigate = useNavigate();
  const catConfig = CATEGORY_CONFIG[community.category] || { label: '✨ AI Pick', color: 'bg-gray-100 text-gray-600' };

  const handleEnterCommunity = () => {
    // Save current community to localStorage so CommunityFeed can load it
    localStorage.setItem('mohalla_current_community', JSON.stringify(community));
    navigate(`/community/${community.id}`);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catConfig.color}`}>
          {catConfig.label}
        </span>
        <div className="flex items-center gap-2">
          {community.isLive && (
            <span className="flex items-center gap-1 text-xs text-red-500 font-semibold">
              <Radio size={10} className="animate-pulse" />
              LIVE
            </span>
          )}
          {community.eventDate && community.eventDate !== 'null' && !community.isLive && (
            <span className="flex items-center gap-1 text-xs text-purple-500">
              <Calendar size={10} />
              {community.eventDate}
            </span>
          )}
        </div>
      </div>

      <div
        className="flex items-start gap-3 mb-3 cursor-pointer"
        onClick={handleEnterCommunity}
      >
        <div className="text-3xl flex-shrink-0">{community.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm leading-tight">{community.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <Users size={11} className="text-gray-400" />
            <span className="text-xs text-gray-400">{community.memberCount} members</span>
            <span className="text-gray-300 mx-1">·</span>
            <span className="text-xs text-gray-400">{community.postsPerDay} posts/day</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
        {community.shortDescription}
      </p>

      <div className="flex gap-1 flex-wrap mb-3">
        {community.tags?.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onJoin(community.id)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            joined ? 'bg-gray-100 text-gray-500' : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {joined ? '✓ Joined' : '+ Join'}
        </button>
        <button
          onClick={handleEnterCommunity}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
        >
          Enter <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}