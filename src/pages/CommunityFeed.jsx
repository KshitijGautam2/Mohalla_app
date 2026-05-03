import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Heart, MessageCircle, Share2, Pin } from 'lucide-react';

const SAMPLE_USERS = [
  'Rahul M.', 'Priya S.', 'Amit K.', 'Sneha R.', 'Vikram P.',
  'Anjali T.', 'Rohit D.', 'Kavya N.', 'Arjun B.', 'Divya L.'
];

const AVATARS = ['🧑', '👩', '👨', '👧', '🧔', '👩‍🦱', '👨‍🦳', '👩‍🦰', '🧑‍🦱', '👩‍🦳'];

const generatePosts = (communityName, topics = []) => {
  const baseTopics = topics.length > 0 ? topics : [
    'What does everyone think about this?',
    'Has anyone else noticed this recently?',
    'Great to have a community for this!',
    'Would love to hear more opinions.',
  ];

  return [
    {
      id: 'p1',
      user: SAMPLE_USERS[0],
      avatar: AVATARS[0],
      time: '2 min ago',
      text: `Just joined this community! Really excited to discuss ${communityName} with everyone here. ${baseTopics[0] || ''}`,
      likes: 12,
      comments: 3,
      liked: false,
      pinned: true,
    },
    {
      id: 'p2',
      user: SAMPLE_USERS[1],
      avatar: AVATARS[1],
      time: '15 min ago',
      text: baseTopics[1] || `The situation around ${communityName} has been quite interesting lately. Would love to hear what people think.`,
      likes: 8,
      comments: 5,
      liked: false,
      pinned: false,
    },
    {
      id: 'p3',
      user: SAMPLE_USERS[2],
      avatar: AVATARS[2],
      time: '32 min ago',
      text: baseTopics[2] || `I've been following this closely. Here are my thoughts — happy to discuss further with anyone interested!`,
      likes: 24,
      comments: 11,
      liked: true,
      pinned: false,
    },
    {
      id: 'p4',
      user: SAMPLE_USERS[3],
      avatar: AVATARS[3],
      time: '1 hr ago',
      text: baseTopics[3] || `Anyone from the local area want to meetup and talk about this in person? Would be great!`,
      likes: 6,
      comments: 2,
      liked: false,
      pinned: false,
    },
    {
      id: 'p5',
      user: SAMPLE_USERS[4],
      avatar: AVATARS[4],
      time: '2 hr ago',
      text: `This community is exactly what our mohalla needed. Finally a place to discuss ${communityName} with people nearby!`,
      likes: 31,
      comments: 7,
      liked: false,
      pinned: false,
    },
  ];
};

export default function CommunityFeed() {
  useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('mohalla_user') || '{}');
  const messagesEndRef = useRef(null);

  // Get community from localStorage (saved when user clicks into it)
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [tab, setTab] = useState('posts'); // posts | chat

  // Chat messages
  const [messages, setMessages] = useState([
    { id: 'm1', user: SAMPLE_USERS[0], avatar: AVATARS[0], text: 'Hey everyone! 👋', time: '10:02 AM' },
    { id: 'm2', user: SAMPLE_USERS[1], avatar: AVATARS[1], text: 'Welcome to the community!', time: '10:04 AM' },
    { id: 'm3', user: SAMPLE_USERS[2], avatar: AVATARS[2], text: 'Great to have more people here. What are your thoughts?', time: '10:08 AM' },
    { id: 'm4', user: SAMPLE_USERS[3], avatar: AVATARS[3], text: 'Really excited about this. Been waiting for a local platform like Mohalla!', time: '10:15 AM' },
    { id: 'm5', user: SAMPLE_USERS[4], avatar: AVATARS[4], text: 'Same here! Finally something built for us 🙌', time: '10:18 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mohalla_current_community');
    if (saved) {
      const c = JSON.parse(saved);
      setCommunity(c);
      setPosts(generatePosts(c.name, c.discussionTopics));
    } else {
      navigate('/home');
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLike = (postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: `p_${Date.now()}`,
      user: user.name || 'You',
      avatar: '🧑',
      time: 'Just now',
      text: newPost.trim(),
      likes: 0,
      comments: 0,
      liked: false,
      pinned: false,
    };
    setPosts(prev => [post, ...prev]);
    setNewPost('');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: `m_${Date.now()}`,
      user: user.name || 'You',
      avatar: '🧑',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');

    // Simulate a reply after 2 seconds
    setTimeout(() => {
      const replies = [
        'That\'s a great point! 👍',
        'Totally agree with you.',
        'Interesting perspective!',
        'Thanks for sharing this.',
        'Has anyone else thought about this?',
      ];
      const reply = {
        id: `m_reply_${Date.now()}`,
        user: SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)],
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  if (!community) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading community...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col">

      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate('/home')}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className="text-2xl">{community.emoji}</div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 text-sm leading-tight truncate">{community.name}</h1>
            <p className="text-xs text-gray-500">{community.memberCount} members · {community.postsPerDay} posts/day</p>
          </div>
          {community.isLive && (
            <span className="flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('posts')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'posts' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            📝 Posts
          </button>
          <button
            onClick={() => setTab('chat')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'chat' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            💬 Live Chat
          </button>
        </div>
      </div>

      {/* POSTS TAB */}
      {tab === 'posts' && (
        <div className="flex-1 overflow-y-auto">
          {/* Write a post */}
          <div className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex gap-3">
              <div className="text-2xl">🧑</div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder={`Share something with ${community.name}...`}
                  className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={handlePost}
                disabled={!newPost.trim()}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  newPost.trim()
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Post
              </button>
            </div>
          </div>

          {/* Posts list */}
          <div className="px-4 py-3 pb-28 space-y-3">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                {post.pinned && (
                  <div className="flex items-center gap-1 text-xs text-orange-500 mb-2">
                    <Pin size={11} />
                    <span>Pinned post</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-900">{post.user}</span>
                      <span className="text-xs text-gray-400">{post.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">{post.text}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                          post.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                        }`}
                      >
                        <Heart size={14} fill={post.liked ? 'currentColor' : 'none'} />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-400 transition-colors">
                        <MessageCircle size={14} />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition-colors">
                        <Share2 size={14} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHAT TAB */}
      {tab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!msg.isMe && (
                  <div className="text-xl flex-shrink-0">{msg.avatar}</div>
                )}
                <div className={`max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!msg.isMe && (
                    <span className="text-xs text-gray-500 mb-1 ml-1">{msg.user}</span>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    msg.isMe
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-gray-400 mt-1 mx-1">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 mb-0">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Say something..."
                className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-3 rounded-2xl transition-all ${
                  newMessage.trim()
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}