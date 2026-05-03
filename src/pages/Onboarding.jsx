import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const STEPS = ['welcome', 'name', 'interests', 'location', 'done'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [nameError, setNameError] = useState('');

  const currentStep = STEPS[step];

  const toggleInterest = (id) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNameNext = () => {
    if (name.trim().length < 2) {
      setNameError('Please enter your name');
      return;
    }
    setNameError('');
    setStep(s => s + 1);
  };

  const handleFinish = () => {
    const userData = {
      name: name.trim(),
      interests: selectedInterests,
      city: city.trim(),
      locality: locality.trim(),
      joinedAt: new Date().toISOString(),
    };
    localStorage.setItem('mohalla_user', JSON.stringify(userData));
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Progress Bar */}
        {currentStep !== 'welcome' && currentStep !== 'done' && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Setting up your Mohalla</span>
              <span>{step} of {STEPS.length - 2}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(step / (STEPS.length - 2)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP: Welcome */}
        {currentStep === 'welcome' && (
          <div className="text-center">
            <div className="text-7xl mb-6">🏘️</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mohalla</h1>
            <p className="text-orange-600 font-medium mb-3">अपना मोहल्ला, अपनी बात</p>
            <p className="text-gray-500 text-sm mb-10">
              Your AI-powered neighbourhood — discover communities, local deals, and conversations that actually matter to you.
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-orange-200"
            >
              Get Started →
            </button>
            <p className="text-xs text-gray-400 mt-4">Free forever. No spam. No ads... yet.</p>
          </div>
        )}

        {/* STEP: Name */}
        {currentStep === 'name' && (
          <div>
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">What should we call you?</h2>
            <p className="text-gray-500 text-sm mb-8">This is how your mohalla will know you.</p>

            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleNameNext()}
              placeholder="Your name"
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-2xl px-5 py-4 text-lg outline-none transition-colors"
              autoFocus
            />
            {nameError && <p className="text-red-500 text-sm mt-2">{nameError}</p>}

            <button
              onClick={handleNameNext}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl text-lg transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        {/* STEP: Interests */}
        {currentStep === 'interests' && (
          <div>
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              What's your scene, {name.split(' ')[0]}?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Pick at least 3 interests. Your AI will build your Mohalla around these.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 max-h-72 overflow-y-auto pr-1">
              {INTERESTS.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`py-3 px-4 rounded-2xl text-sm font-medium text-left transition-all border-2 ${
                    selectedInterests.includes(interest.id)
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {interest.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {selectedInterests.length} selected
              </span>
              <button
                onClick={() => selectedInterests.length >= 3 && setStep(s => s + 1)}
                disabled={selectedInterests.length < 3}
                className={`px-8 py-3 rounded-2xl font-semibold text-white transition-all ${
                  selectedInterests.length >= 3
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP: Location */}
        {currentStep === 'location' && (
          <div>
            <div className="text-5xl mb-4">📍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Where's your mohalla?</h2>
            <p className="text-gray-500 text-sm mb-8">
              This helps us show you local communities and nearby shops. We never share your location.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Delhi, Mumbai, Bengaluru"
                  className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-2xl px-5 py-4 text-base outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Locality / Area</label>
                <input
                  type="text"
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  placeholder="e.g. Lajpat Nagar, Koramangala"
                  className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-2xl px-5 py-4 text-base outline-none transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => city.trim() ? setStep(s => s + 1) : null}
              disabled={!city.trim()}
              className={`w-full mt-6 py-4 rounded-2xl font-semibold text-white text-lg transition-all ${
                city.trim() ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Almost there →
            </button>

            <button
              onClick={() => setStep(s => s + 1)}
              className="w-full mt-3 py-3 rounded-2xl font-medium text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* STEP: Done */}
        {currentStep === 'done' && (
          <div className="text-center">
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to your Mohalla, {name.split(' ')[0]}!
            </h2>
            <p className="text-gray-500 mb-4">
              We're building your personalised neighbourhood right now — communities, local conversations, and nearby shops, all curated by AI.
            </p>

            <div className="bg-white rounded-2xl p-4 mb-8 text-left shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Your profile</p>
              <p className="font-semibold text-gray-800">{name}</p>
              {city && <p className="text-sm text-gray-500">📍 {locality ? `${locality}, ` : ''}{city}</p>}
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedInterests.slice(0, 5).map(id => (
                  <span key={id} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    {INTERESTS.find(i => i.id === id)?.label}
                  </span>
                ))}
                {selectedInterests.length > 5 && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                    +{selectedInterests.length - 5} more
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-orange-200"
            >
              Enter my Mohalla 🏘️
            </button>
          </div>
        )}

      </div>
    </div>
  );
}