const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

console.log('Gemini Key loaded:', GEMINI_API_KEY ? 'YES ✓' : 'NO ✗');

const callGemini = async (prompt, useSearch = false) => {
  try {
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192, // increased significantly
      }
    };

    if (useSearch) {
      body.tools = [{ google_search: {} }];
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data?.error?.message);
      return null;
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const allText = parts.filter(p => p.text).map(p => p.text).join('');

    // Log response length so we can track truncation
    console.log(`Gemini response length: ${allText.length} chars`);
    return allText || null;

  } catch (err) {
    console.error('Gemini fetch error:', err.message);
    return null;
  }
};

const extractJSON = (text) => {
  if (!text) return null;

  // Strategy 1: ```json fence
  const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()); } catch (e) {}
  }

  // Strategy 2: plain ``` fence
  const plainFence = text.match(/```\s*([\s\S]*?)\s*```/);
  if (plainFence) {
    try { return JSON.parse(plainFence[1].trim()); } catch (e) {}
  }

  // Strategy 3: brace matching — finds largest complete { } block
  let depth = 0;
  let start = -1;
  let bestStart = -1;
  let bestEnd = -1;
  let bestLen = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (text[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const len = i - start + 1;
        if (len > bestLen) {
          bestLen = len;
          bestStart = start;
          bestEnd = i;
        }
      }
    }
  }

  if (bestStart !== -1) {
    try { return JSON.parse(text.slice(bestStart, bestEnd + 1)); } catch (e) {
      console.warn('Brace extraction failed:', e.message);
    }
  }

  // Strategy 4: direct parse
  try { return JSON.parse(text.trim()); } catch (e) {}

  return null;
};

export const askGemini = (prompt) => callGemini(prompt, false);
export const askGeminiWithSearch = (prompt) => callGemini(prompt, true);

export const generateLocalCommunities = async (user) => {
  const { name, interests = [], city = 'Delhi', locality = '' } = user;
  const area = locality || city;

  // Step 1 — fetch news with search grounding
  console.log('Step 1: Fetching live news for:', area, city);
  const newsPrompt = `Search the web and find what is happening RIGHT NOW this week in ${area}, ${city}, India:
1. Top 2 local news stories from ${area} or ${city} this week (specific names, dates)
2. Top 2 major national India news stories this week
3. One upcoming local event or festival in ${city} this week
Write as short bullet points only. Maximum 150 words total.`;

  const newsData = await callGemini(newsPrompt, true);
  console.log('News fetched:', newsData ? 'YES ✓' : 'FAILED');

  // Step 2 — generate communities — SHORTER prompt, less template
  const communityPrompt = `You are Mohalla AI for a hyperlocal Indian social media app.

User: ${name}, in ${area} ${city}. Interests: ${interests.slice(0,4).join(', ')}.

NEWS THIS WEEK in ${area}, ${city}:
${newsData || `Generate realistic May 2025 events for ${city}, India`}

Return ONLY a JSON object (no markdown, no backticks, start with {, end with }).
Generate SHORT descriptions to save space.

{
  "trending_global": [
    {"id":"tg1","name":"<national news community>","emoji":"🌍","category":"trending_global","shortDescription":"<under 80 chars>","fullDescription":"<2 sentences max>","memberCount":"45K","postsPerDay":1200,"isLive":false,"eventDate":null,"tags":["tag1","tag2"],"discussionTopics":["topic1","topic2","topic3"],"aiGenerated":true,"trending":true},
    {"id":"tg2","name":"<second national news>","emoji":"📰","category":"trending_global","shortDescription":"<under 80 chars>","fullDescription":"<2 sentences max>","memberCount":"22K","postsPerDay":800,"isLive":false,"eventDate":null,"tags":["tag1","tag2"],"discussionTopics":["topic1","topic2","topic3"],"aiGenerated":true,"trending":true}
  ],
  "trending_local": [
    {"id":"tl1","name":"<local community mentioning ${area}>","emoji":"📍","category":"trending_local","shortDescription":"<local issue in ${area} under 80 chars>","fullDescription":"<2 sentences about local issue>","memberCount":"412","postsPerDay":38,"isLive":false,"eventDate":null,"tags":["${area.toLowerCase().replace(/ /g,'')}","local"],"discussionTopics":["topic1","topic2","topic3"],"aiGenerated":true,"trending":false},
    {"id":"tl2","name":"<second local ${area} community>","emoji":"🏘️","category":"trending_local","shortDescription":"<under 80 chars>","fullDescription":"<2 sentences>","memberCount":"230","postsPerDay":25,"isLive":false,"eventDate":null,"tags":["local","community"],"discussionTopics":["topic1","topic2"],"aiGenerated":true,"trending":false},
    {"id":"tl3","name":"<third local community>","emoji":"🌿","category":"trending_local","shortDescription":"<under 80 chars>","fullDescription":"<2 sentences>","memberCount":"180","postsPerDay":18,"isLive":false,"eventDate":null,"tags":["local"],"discussionTopics":["topic1","topic2"],"aiGenerated":true,"trending":false}
  ],
  "interest_local": [
    {"id":"il1","name":"<interest group in ${area} for ${interests[0]||'local topics'}>","emoji":"🤝","category":"interest_local","shortDescription":"<under 80 chars>","fullDescription":"<2 sentences>","memberCount":"143","postsPerDay":19,"isLive":false,"eventDate":null,"tags":["local","${(interests[0]||'community').replace(/ /g,'')}"],"discussionTopics":["Meetup planning","Tips","Local spots"],"aiGenerated":true,"trending":false},
    {"id":"il2","name":"<second interest group in ${area}>","emoji":"🎯","category":"interest_local","shortDescription":"<under 80 chars>","fullDescription":"<2 sentences>","memberCount":"87","postsPerDay":11,"isLive":false,"eventDate":null,"tags":["interest","local"],"discussionTopics":["topic1","topic2"],"aiGenerated":true,"trending":false},
    {"id":"il3","name":"<third interest group>","emoji":"⭐","category":"interest_local","shortDescription":"<under 80 chars>","fullDescription":"<2 sentences>","memberCount":"64","postsPerDay":7,"isLive":false,"eventDate":null,"tags":["interest"],"discussionTopics":["topic1","topic2"],"aiGenerated":true,"trending":false}
  ],
  "events": [
    {"id":"ev1","name":"<real upcoming event in ${city}>","emoji":"📅","category":"events","shortDescription":"<under 80 chars>","fullDescription":"<2 sentences>","memberCount":"1.2K","postsPerDay":120,"isLive":false,"eventDate":"<real date like Sat 10 May>","tags":["event","${city.toLowerCase().replace(/ /g,'')}"],"discussionTopics":["Event details","How to attend","What to expect"],"aiGenerated":true,"trending":false},
    {"id":"ev2","name":"<second event in ${city}>","emoji":"🎉","category":"events","shortDescription":"<under 80 chars>","fullDescription":"<2 sentences>","memberCount":"743","postsPerDay":62,"isLive":false,"eventDate":"<real date>","tags":["event"],"discussionTopics":["topic1","topic2"],"aiGenerated":true,"trending":false}
  ]
}

RULES: Replace all <placeholders> with real content. trending_local MUST mention ${area}. Return ONLY the JSON object.`;

  try {
    console.log('Step 2: Generating communities...');
    const response = await callGemini(communityPrompt, false);

    if (!response) {
      console.warn('No response from Gemini, showing fallback');
      return null;
    }

    console.log(`Response length: ${response.length} chars`);

    // Check if response looks truncated
    const trimmed = response.trim();
    if (!trimmed.endsWith('}')) {
      console.warn('Response appears truncated — attempting repair');
      // Try to repair by counting unclosed braces and adding closing braces
      let depth = 0;
      for (const ch of trimmed) {
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
      }
      const repaired = trimmed + '}'.repeat(Math.max(0, depth));
      try {
        const parsed = extractJSON(repaired);
        if (parsed && parsed.trending_global) {
          console.log('✓ Repaired truncated JSON successfully');
          return parsed;
        }
      } catch (e) {
        console.warn('Repair failed:', e.message);
      }
    }

    const parsed = extractJSON(response);

    if (!parsed) {
      console.error('Could not extract JSON');
      return null;
    }

    if (!parsed.trending_global || !parsed.trending_local) {
      console.error('Missing required keys:', Object.keys(parsed));
      return null;
    }

    console.log('✓ Communities ready:', {
      global: parsed.trending_global?.length,
      local: parsed.trending_local?.length,
      interest: parsed.interest_local?.length,
      events: parsed.events?.length,
    });

    return parsed;

  } catch (err) {
    console.error('generateLocalCommunities failed:', err.message);
    return null;
  }
};