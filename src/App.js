import React, { useState, useRef, useEffect, useCallback } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import {
  Camera, Upload, Gem, Mountain, Sparkles, KeyRound, Loader2, FlaskConical,
  X, RefreshCw, AlertTriangle, Info, Eye, MapPin, ChevronDown, ChevronUp,
  CheckCircle2, HelpCircle, Microscope,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Claude API integration
// ---------------------------------------------------------------------------

const MODEL = 'claude-opus-4-8';

const SYSTEM_PROMPT = `You are an expert field geologist and mineralogist helping hobbyists identify rocks, minerals, fossils, and meteorites from photographs.

Work from what is actually visible in the image: color, luster, crystal habit, cleavage or fracture, grain size, banding or layering, transparency, and any visible weathering. If the user supplies results of simple physical tests (streak color, Mohs hardness scratch tests, magnetism, acid reaction) treat those as strong evidence — they often distinguish visual lookalikes.

Be honest about uncertainty. A photograph cannot always distinguish similar specimens; when that is the case, say so, name the plausible alternatives, and suggest the simplest at-home tests that would settle it. If the image does not show a rock, mineral, fossil, or meteorite, say so plainly.`;

// Structured-output schema: guarantees the response is valid JSON we can render.
const IDENTIFICATION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'is_geological_specimen', 'name', 'category', 'classification', 'confidence',
    'summary', 'observed_features', 'composition', 'formation', 'alternatives',
    'confirmation_tests', 'fun_fact',
  ],
  properties: {
    is_geological_specimen: {
      type: 'boolean',
      description: 'True if the image shows a rock, mineral, fossil, or meteorite.',
    },
    name: {
      type: 'string',
      description: 'Most likely identification, e.g. "Amethyst (variety of Quartz)". If not a specimen, a short description of what the image shows.',
    },
    category: {
      type: 'string',
      enum: ['rock', 'mineral', 'fossil', 'meteorite', 'man-made', 'unknown'],
    },
    classification: {
      type: 'string',
      description: 'Rock type (igneous/sedimentary/metamorphic) or mineral class (silicate, carbonate, etc.).',
    },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    summary: {
      type: 'string',
      description: 'Two or three sentences explaining the identification and reasoning.',
    },
    observed_features: {
      type: 'array',
      items: { type: 'string' },
      description: 'Diagnostic features visible in the photo, e.g. "vitreous luster", "hexagonal crystal terminations".',
    },
    composition: { type: 'string', description: 'Chemical or mineralogical composition.' },
    formation: { type: 'string', description: 'How and where this typically forms.' },
    alternatives: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'how_to_distinguish'],
        properties: {
          name: { type: 'string' },
          how_to_distinguish: { type: 'string' },
        },
      },
      description: 'Plausible lookalikes and how to tell them apart. Empty if confidence is high.',
    },
    confirmation_tests: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['test', 'instructions', 'expected_result'],
        properties: {
          test: { type: 'string' },
          instructions: { type: 'string' },
          expected_result: { type: 'string' },
        },
      },
      description: 'Simple at-home tests (streak, hardness, magnet, vinegar) that would confirm the identification.',
    },
    fun_fact: { type: 'string' },
  },
};

function buildUserPrompt(observations) {
  const lines = ['Please identify the specimen in this photo.'];
  const obs = [];
  if (observations.streak) obs.push(`Streak color (on unglazed tile): ${observations.streak}`);
  if (observations.hardness) obs.push(`Hardness observations: ${observations.hardness}`);
  if (observations.magnetic !== 'untested') obs.push(`Magnet test: ${observations.magnetic === 'yes' ? 'attracted to a magnet' : 'not attracted to a magnet'}`);
  if (observations.acid !== 'untested') obs.push(`Vinegar/acid test: ${observations.acid === 'yes' ? 'fizzes' : 'no reaction'}`);
  if (observations.location) obs.push(`Found near: ${observations.location}`);
  if (observations.notes) obs.push(`Other notes: ${observations.notes}`);
  if (obs.length > 0) {
    lines.push('', 'I also performed some simple field tests:', ...obs.map((o) => `- ${o}`));
  }
  return lines.join('\n');
}

async function identifySpecimen(apiKey, imageDataUrl, observations) {
  // Direct-from-browser call. Fine for a personal tool; route through a small
  // server proxy before sharing this app so the key never ships to clients.
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/s);
  if (!match) throw new Error('Could not read the captured image.');
  const [, mediaType, base64Data] = match;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    output_config: { format: { type: 'json_schema', schema: IDENTIFICATION_SCHEMA } },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
          { type: 'text', text: buildUserPrompt(observations) },
        ],
      },
    ],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('The model declined to analyze this image. Try a different photo.');
  }
  if (response.stop_reason === 'max_tokens') {
    throw new Error('The response was cut off. Please try again.');
  }

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock) throw new Error('No analysis was returned. Please try again.');
  return JSON.parse(textBlock.text);
}

// ---------------------------------------------------------------------------
// Image helpers
// ---------------------------------------------------------------------------

const MAX_IMAGE_EDGE = 1568;

function downscaleDataUrl(dataUrl, maxEdge = MAX_IMAGE_EDGE) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => reject(new Error('Could not load the selected image.'));
    img.src = dataUrl;
  });
}

// ---------------------------------------------------------------------------
// UI building blocks
// ---------------------------------------------------------------------------

const CONFIDENCE_STYLES = {
  high: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  medium: 'bg-amber-100 text-amber-800 border-amber-300',
  low: 'bg-red-100 text-red-800 border-red-300',
};

const CATEGORY_ICONS = {
  rock: Mountain,
  mineral: Gem,
  fossil: Microscope,
  meteorite: Sparkles,
  'man-made': Info,
  unknown: HelpCircle,
};

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
    <h3 className="flex items-center text-sm font-semibold text-stone-700 uppercase tracking-wide mb-2">
      <Icon size={16} className="mr-2 text-amber-700" /> {title}
    </h3>
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------

const App = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic_api_key') || '');
  const [showSettings, setShowSettings] = useState(false);

  // capture | preview | analyzing | result
  const [stage, setStage] = useState('capture');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showObservations, setShowObservations] = useState(false);
  const [observations, setObservations] = useState({
    streak: '', hardness: '', magnetic: 'untested', acid: 'untested', location: '', notes: '',
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      setCameraActive(true);
      // Wait a tick for the <video> element to mount before attaching the stream
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch (err) {
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. You can still upload a photo instead.'
          : `Could not start the camera (${err.message}). You can upload a photo instead.`,
      );
    }
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = await downscaleDataUrl(canvas.toDataURL('image/jpeg', 0.95));
    stopCamera();
    setImage(dataUrl);
    setStage('preview');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = await downscaleDataUrl(reader.result);
        stopCamera();
        setImage(dataUrl);
        setStage('preview');
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const reset = () => {
    stopCamera();
    setStage('capture');
    setImage(null);
    setResult(null);
    setError('');
    setObservations({ streak: '', hardness: '', magnetic: 'untested', acid: 'untested', location: '', notes: '' });
    setShowObservations(false);
  };

  const analyze = async () => {
    if (!apiKey) {
      setShowSettings(true);
      setError('Add your Anthropic API key first (top right).');
      return;
    }
    setError('');
    setStage('analyzing');
    try {
      const identification = await identifySpecimen(apiKey, image, observations);
      setResult(identification);
      setStage('result');
    } catch (err) {
      if (err instanceof Anthropic.AuthenticationError) {
        setError('Your API key was rejected. Double-check it in settings (top right).');
        setShowSettings(true);
      } else if (err instanceof Anthropic.RateLimitError) {
        setError('Rate limit reached. Wait a moment and try again.');
      } else if (err instanceof Anthropic.APIError) {
        setError(`API error (${err.status}): ${err.message}`);
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
      setStage('preview');
    }
  };

  const saveApiKey = (value) => {
    setApiKey(value);
    localStorage.setItem('anthropic_api_key', value);
  };

  const updateObservation = (field, value) => setObservations((prev) => ({ ...prev, [field]: value }));

  // ------------------------------------------------------------------ render

  const renderSettings = () => (
    <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-stone-800 flex items-center"><KeyRound size={18} className="mr-2 text-amber-700" /> Anthropic API key</h2>
        <button onClick={() => setShowSettings(false)} className="text-stone-400 hover:text-stone-600" aria-label="Close settings"><X size={18} /></button>
      </div>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => saveApiKey(e.target.value)}
        placeholder="sk-ant-..."
        className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-mono"
      />
      <p className="text-xs text-stone-500 leading-relaxed">
        Stored only in this browser (localStorage) and sent directly to Anthropic. Get a key at{' '}
        <a href="https://platform.claude.com" target="_blank" rel="noreferrer" className="text-amber-700 underline">platform.claude.com</a>.
        For a shared or public deployment, route requests through a small server so the key never leaves your backend.
      </p>
    </div>
  );

  const renderCaptureStage = () => (
    <div className="space-y-4">
      {cameraActive ? (
        <div className="relative rounded-2xl overflow-hidden bg-black shadow-lg">
          <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-[60vh] object-contain" />
          <div className="absolute bottom-0 inset-x-0 p-4 flex justify-center items-center gap-4 bg-gradient-to-t from-black/60 to-transparent">
            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white border-4 border-amber-500 shadow-lg hover:scale-105 transition-transform"
              aria-label="Take photo"
            />
            <button onClick={stopCamera} className="absolute right-4 text-white/90 hover:text-white" aria-label="Stop camera">
              <X size={28} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-stone-300 p-10 text-center space-y-6 shadow-sm">
          <div className="flex justify-center"><div className="p-4 bg-amber-100 rounded-full"><Gem size={40} className="text-amber-700" /></div></div>
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Snap a photo of your specimen</h2>
            <p className="text-sm text-stone-500 mt-1">
              Fill the frame, use natural light, and include a fresh (unweathered) surface if you can.
            </p>
          </div>
          {cameraError && (
            <p className="text-sm text-red-600 flex items-center justify-center"><AlertTriangle size={16} className="mr-2 shrink-0" /> {cameraError}</p>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-800 transition-colors flex items-center justify-center"
            >
              <Camera size={20} className="mr-2" /> Open camera
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors flex items-center justify-center"
            >
              <Upload size={20} className="mr-2" /> Upload a photo
            </button>
          </div>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
    </div>
  );

  const renderObservationsPanel = () => (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
      <button
        onClick={() => setShowObservations(!showObservations)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <span className="flex items-center text-sm font-semibold text-stone-700">
          <FlaskConical size={16} className="mr-2 text-amber-700" /> Optional field tests (boost accuracy)
        </span>
        {showObservations ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
      </button>
      {showObservations && (
        <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
          <p className="text-xs text-stone-500">
            None of these are required — but a streak test or magnet check often settles lookalikes a photo can't.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-stone-600">Streak color <span className="text-stone-400">(scratch on unglazed tile)</span></span>
              <input type="text" value={observations.streak} onChange={(e) => updateObservation('streak', e.target.value)} placeholder="e.g. white, reddish-brown" className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500" />
            </label>
            <label className="block text-sm">
              <span className="text-stone-600">Hardness <span className="text-stone-400">(what scratches it?)</span></span>
              <input type="text" value={observations.hardness} onChange={(e) => updateObservation('hardness', e.target.value)} placeholder="e.g. scratches glass, fingernail marks it" className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500" />
            </label>
            <label className="block text-sm">
              <span className="text-stone-600">Sticks to a magnet?</span>
              <select value={observations.magnetic} onChange={(e) => updateObservation('magnetic', e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-amber-500">
                <option value="untested">Not tested</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-stone-600">Fizzes with vinegar?</span>
              <select value={observations.acid} onChange={(e) => updateObservation('acid', e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-amber-500">
                <option value="untested">Not tested</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-stone-600 flex items-center"><MapPin size={14} className="mr-1" /> Where was it found?</span>
              <input type="text" value={observations.location} onChange={(e) => updateObservation('location', e.target.value)} placeholder="e.g. riverbed in Colorado, beach in Maine" className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500" />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-stone-600">Anything else?</span>
              <input type="text" value={observations.notes} onChange={(e) => updateObservation('notes', e.target.value)} placeholder="e.g. unusually heavy for its size" className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500" />
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreviewStage = () => (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-black">
        <img src={image} alt="Specimen to identify" className="w-full max-h-[50vh] object-contain" />
        <button onClick={reset} className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70" aria-label="Discard photo">
          <X size={18} />
        </button>
      </div>
      {renderObservationsPanel()}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-start">
          <AlertTriangle size={16} className="mr-2 mt-0.5 shrink-0" /> {error}
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={reset} className="px-5 py-3 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 flex items-center">
          <RefreshCw size={18} className="mr-2" /> Retake
        </button>
        <button onClick={analyze} className="flex-1 px-5 py-3 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-800 flex items-center justify-center">
          <Sparkles size={18} className="mr-2" /> Identify it
        </button>
      </div>
    </div>
  );

  const renderAnalyzingStage = () => (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
        <img src={image} alt="Specimen being analyzed" className="w-full max-h-[40vh] object-contain opacity-70" />
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center shadow-sm">
        <Loader2 size={32} className="mx-auto text-amber-700 animate-spin" />
        <p className="mt-3 font-medium text-stone-700">Examining your specimen…</p>
        <p className="text-sm text-stone-500 mt-1">Checking luster, crystal habit, color, and texture</p>
      </div>
    </div>
  );

  const renderResultStage = () => {
    if (!result) return null;
    const CategoryIcon = CATEGORY_ICONS[result.category] || HelpCircle;
    return (
      <div className="space-y-4">
        <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
          <img src={image} alt="Identified specimen" className="w-full max-h-[35vh] object-contain" />
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-xl"><CategoryIcon size={28} className="text-amber-700" /></div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">{result.name}</h2>
                <p className="text-sm text-stone-500 capitalize">{result.category}{result.classification ? ` · ${result.classification}` : ''}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize shrink-0 ${CONFIDENCE_STYLES[result.confidence] || CONFIDENCE_STYLES.low}`}>
              {result.confidence} confidence
            </span>
          </div>
          <p className="mt-3 text-sm text-stone-700 leading-relaxed">{result.summary}</p>
        </div>

        {!result.is_geological_specimen && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start">
            <Info size={16} className="mr-2 mt-0.5 shrink-0" />
            This doesn't appear to be a rock or mineral — try another photo if that's unexpected.
          </div>
        )}

        {result.observed_features?.length > 0 && (
          <Section icon={Eye} title="What the AI saw">
            <ul className="space-y-1.5">
              {result.observed_features.map((feature, i) => (
                <li key={i} className="text-sm text-stone-700 flex items-start">
                  <CheckCircle2 size={15} className="mr-2 mt-0.5 text-emerald-600 shrink-0" /> {feature}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {(result.composition || result.formation) && (
          <Section icon={Mountain} title="Geology">
            {result.composition && <p className="text-sm text-stone-700"><span className="font-medium">Composition:</span> {result.composition}</p>}
            {result.formation && <p className="text-sm text-stone-700 mt-2"><span className="font-medium">Formation:</span> {result.formation}</p>}
          </Section>
        )}

        {result.alternatives?.length > 0 && (
          <Section icon={HelpCircle} title="Could also be">
            <ul className="space-y-2">
              {result.alternatives.map((alt, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium text-stone-800">{alt.name}</span>
                  <span className="text-stone-600"> — {alt.how_to_distinguish}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {result.confirmation_tests?.length > 0 && (
          <Section icon={FlaskConical} title="Confirm it at home">
            <div className="space-y-3">
              {result.confirmation_tests.map((test, i) => (
                <div key={i} className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                  <p className="text-sm font-medium text-stone-800">{test.test}</p>
                  <p className="text-sm text-stone-600 mt-1">{test.instructions}</p>
                  <p className="text-xs text-amber-800 mt-1.5 font-medium">Expected if correct: {test.expected_result}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-3">
              Run any of these, then re-analyze the same photo with your results filled in under "field tests" for a firmer ID.
            </p>
          </Section>
        )}

        {result.fun_fact && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
            <p className="text-sm text-amber-900"><Sparkles size={15} className="inline mr-1.5 -mt-0.5" /><span className="font-semibold">Fun fact:</span> {result.fun_fact}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => { setStage('preview'); setShowObservations(true); }}
            className="px-5 py-3 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 flex items-center"
          >
            <FlaskConical size={18} className="mr-2" /> Add test results
          </button>
          <button onClick={reset} className="flex-1 px-5 py-3 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-800 flex items-center justify-center">
            <Camera size={18} className="mr-2" /> Identify another
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans">
      <header className="bg-gradient-to-r from-stone-800 to-stone-900 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Gem size={26} className="text-amber-400" />
            <div>
              <h1 className="text-lg font-bold leading-tight">Rock &amp; Mineral Identifier</h1>
              <p className="text-xs text-stone-400">Point your camera at a specimen — AI does the rest</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${apiKey ? 'text-stone-300 hover:text-white hover:bg-white/10' : 'text-amber-400 bg-white/10 hover:bg-white/20'}`}
            aria-label="API key settings"
          >
            <KeyRound size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {showSettings && renderSettings()}
        {stage === 'capture' && renderCaptureStage()}
        {stage === 'preview' && renderPreviewStage()}
        {stage === 'analyzing' && renderAnalyzingStage()}
        {stage === 'result' && renderResultStage()}
      </main>

      <footer className="max-w-2xl mx-auto px-4 pb-8">
        <p className="text-xs text-stone-400 text-center leading-relaxed">
          AI identification from a photo is a strong first pass, not a lab analysis. For valuable specimens
          (suspected gems or meteorites), confirm with a local geology department or gem lab.
        </p>
      </footer>
    </div>
  );
};

export default App;
