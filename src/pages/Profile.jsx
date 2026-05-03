import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Edit2, Save, X, MapPin, LogOut, ChevronRight, Check } from 'lucide-react';
import Navbar from '../components/Navbar';

const INTERESTS = [
  { id: 'cricket', label: '🏏 Cricket' },
  { id: 'bollywood', label: '🎬 Bollywood' },
  { id: 'politics', label: '🗳️ Politics' },
  { id: 'food', label: '🍛 Food & Recipes' },
  { id: 'startups', label: '🚀 Startups & Tech' },
  { id: 'fitness', label: '💪 Fitness' },
  { id: 'gaming', label: '🎮 Gaming' },
  { id: 'music', label: '🎵 Music' },
  { id: 'local_news', label: '📰 Local News' },
  { id: 'finance', label: '💰 Finance & Investing' },
  { id: 'fashion', label: '👗 Fashion' },
  { id: 'travel', label: '✈️ Travel' },
  { id: 'spirituality', label: '🙏 Spirituality' },
  { id: 'education', label: '📚 Education' },
  { id: 'comedy', label: '😂 Memes & Comedy' },
  { id: 'automobiles', label: '🚗 Cars & Bikes' },
];

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('mohalla_user') || '{}');

  const [name, setName] = useState(user.name || '');
  const [city, setCity] = useState(user.city || '');
  const [locality, setLocality] = useState(user.locality || '');
  const [interests, setInterests] = useState(user.interests || []);
  const [avatar, setAvatar] = useState(user.avatar || null);
  const [editingName, setEditingName] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [editingInterests, setEditingInterests] = useState(false);
  const [saved, setSaved] = useState(false);

  const joinedCommunities = JSON.parse(localStorage.getItem('mohalla_joined') || '[]');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const toggleInterest = (id) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    const updated = {
      ...user,
      name: name.trim() || user.name,
      city: city.trim() || user.city,
      locality: locality.trim() || user.locality,
      interests,
      avatar,
    };
    localStorage.setItem('mohalla_user', JSON.stringify(updated));
    setEditingName(false);
    setEditingLocation(false);
    setEditingInterests(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-28">

      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save</>}
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">

        {/* Avatar Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center border-4 border-orange-200">
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">
                  {name?.charAt(0)?.toUpperCase() || '🧑'}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin size={12} className="text-orange-400" />
            {locality ? `${locality}, ${city}` : city || 'Location not set'}
          </p>
          <div className="flex gap-4 mt-4 text-center">
            <div>
              <p className="font-bold text-gray-900">{joinedCommunities.length}</p>
              <p className="text-xs text-gray-500">Communities</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div>
              <p className="font-bold text-gray-900">{interests.length}</p>
              <p className="text-xs text-gray-500">Interests</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div>
              <p className="font-bold text-gray-900">
                {user.joinedAt
                  ? new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
                  : 'Today'}
              </p>
              <p className="text-xs text-gray-500">Joined</p>
            </div>
          </div>
        </div>

        {/* Name Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">Display Name</h3>
            <button
              onClick={() => setEditingName(e => !e)}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {editingName ? <X size={14} className="text-gray-600" /> : <Edit2 size={14} className="text-gray-600" />}
            </button>
          </div>
          {editingName ? (
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-2 border-orange-300 rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="Your name"
              autoFocus
            />
          ) : (
            <p className="text-gray-700 text-sm px-1">{name || 'Not set'}</p>
          )}
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">📍 Location</h3>
            <button
              onClick={() => setEditingLocation(e => !e)}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {editingLocation ? <X size={14} className="text-gray-600" /> : <Edit2 size={14} className="text-gray-600" />}
            </button>
          </div>
          {editingLocation ? (
            <div className="space-y-3">
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full border-2 border-orange-300 rounded-xl px-4 py-3 text-sm outline-none"
                placeholder="City (e.g. Jodhpur)"
              />
              <input
                type="text"
                value={locality}
                onChange={e => setLocality(e.target.value)}
                className="w-full border-2 border-orange-300 rounded-xl px-4 py-3 text-sm outline-none"
                placeholder="Locality (e.g. Sardarpura)"
              />
            </div>
          ) : (
            <p className="text-gray-700 text-sm px-1">
              {locality ? `${locality}, ${city}` : city || 'Not set'}
            </p>
          )}
        </div>

        {/* Interests Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">✨ My Interests ({interests.length})</h3>
            <button
              onClick={() => setEditingInterests(e => !e)}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {editingInterests ? <X size={14} className="text-gray-600" /> : <Edit2 size={14} className="text-gray-600" />}
            </button>
          </div>

          {editingInterests ? (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {INTERESTS.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium text-left transition-all border-2 ${
                    interests.includes(interest.id)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {interest.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {interests.length === 0 && (
                <p className="text-gray-400 text-sm">No interests selected</p>
              )}
              {interests.map(id => {
                const interest = INTERESTS.find(i => i.id === id);
                return interest ? (
                  <span key={id} className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full font-medium">
                    {interest.label}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Joined Communities */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">
            🏘️ Joined Communities ({joinedCommunities.length})
          </h3>
          {joinedCommunities.length === 0 ? (
            <p className="text-gray-400 text-sm">You haven't joined any communities yet.</p>
          ) : (
            <p className="text-sm text-gray-600">
              You're part of {joinedCommunities.length} communities in your Mohalla.
            </p>
          )}
          <button
            onClick={() => navigate('/home')}
            className="mt-3 flex items-center gap-1 text-sm text-orange-500 font-medium"
          >
            Browse communities <ChevronRight size={14} />
          </button>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">ℹ️ About Mohalla</h3>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium text-gray-700">1.0.0 Beta</span>
            </div>
            <div className="flex justify-between">
              <span>AI Engine</span>
              <span className="font-medium text-gray-700">Gemini 2.5 Flash</span>
            </div>
            <div className="flex justify-between">
              <span>Your Mohalla</span>
              <span className="font-medium text-gray-700">{locality || city || 'India'}</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border-2 border-red-100 text-red-500 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Sign out & Reset
        </button>

      </div>

      <Navbar active="profile" />
    </div>
  );
}