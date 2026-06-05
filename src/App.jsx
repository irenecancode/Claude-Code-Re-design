import { useState, useRef, useEffect } from 'react';

const SESSIONS = [
  { title: 'change the side bar icons', age: '2m' },
  { title: 'is my changes committed?', age: '25m' },
];

function HistoryDropdown({ onClose, onNavigate, activePanel }) {
  const [tab, setTab] = useState('local');
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
      <div style={{ position: 'absolute', top: 30, right: 0, width: 260, zIndex: 40,
        background: '#1c1c1c', border: '1px solid #383838', borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 6, padding: '8px 10px', borderBottom: '1px solid #2a2a2a' }}>
          {['local', 'web'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '5px 0',
              background: tab === t ? '#3a3a3a' : 'transparent',
              border: '1px solid ' + (tab === t ? '#555' : 'transparent'),
              borderRadius: 6,
              color: tab === t ? '#ffffff' : '#8b949e',
              fontWeight: tab === t ? 700 : 400,
              fontSize: '12px', fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
              {t === 'local' ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              )}
              {t === 'local' ? 'Local' : 'Web'}
            </button>
          ))}
        </div>
        <div style={{ padding: '8px 10px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#252525',
            border: '1px solid #383838', borderRadius: 5, padding: '5px 9px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ fontSize: '11px', color: '#8c8c8c' }}>Search sessions...</span>
          </div>
        </div>
        <div style={{ padding: '4px 0 8px' }}>
          {SESSIONS.map((s, i) => {
            const isActive = activePanel === i + 1;
            return (
              <div key={i} onClick={() => { onNavigate(i + 1); onClose(); }} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 14px', cursor: 'pointer', gap: 8,
                background: isActive ? '#2a3a4a' : 'transparent',
                borderLeft: isActive ? '2px solid #4a9eff' : '2px solid transparent',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#252525'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                  color: isActive ? '#ffffff' : '#cccccc',
                  fontWeight: isActive ? 700 : 400 }}>
                  {s.title}
                </span>
                <span style={{ fontSize: '11px', color: isActive ? '#6e9fc8' : '#8c8c8c', flexShrink: 0 }}>{s.age}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ActionLogDropdown({ onClose, title, entries, resetMap, onReset, lastUpdateTime, agentState }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const relativeTime = () => {
    if (agentState === 'offline' || !lastUpdateTime) return '—';
    const s = Math.floor((Date.now() - lastUpdateTime) / 1000);
    if (s < 10) return 'just now';
    if (s < 60) return '10 seconds ago';
    const m = Math.floor(s / 60);
    return m === 1 ? '1 min ago' : `${m} mins ago`;
  };

  const dotClass = `log-dot log-dot-${agentState}`;
  const isOffline = agentState === 'offline';

  const now = () => {
    const d = new Date();
    const m = d.getMonth() + 1, day = d.getDate(), y = d.getFullYear().toString().slice(-2);
    let h = d.getHours(); const min = d.getMinutes().toString().padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return { full: `${m}/${day}/${y} ${h}:${min} ${ap}`, short: `${h}:${min} ${ap}` };
  };

  const resetEntries = entries
    .map((e, i) => resetMap[i] ? { ts: resetMap[i].full, description: e.description } : null)
    .filter(Boolean);

  const linkStyle = () => ({
    marginTop: 2, marginLeft: 12, fontSize: '11px', color: '#8c8c8c',
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    fontFamily: 'Consolas, monospace', display: 'block',
    fontStyle: 'italic', textDecoration: 'underline',
  });

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
      <div style={{
        position: 'absolute', top: 30, right: 0, width: 260, zIndex: 40,
        background: '#1c1c1c', border: '1px solid #383838', borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)', overflow: 'hidden',
      }}>
        <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: '11px', color: isOffline ? '#8c8c8c' : '#cccccc' }}>Context {title}</div>
          <div style={{ fontSize: '11px', color: isOffline ? '#8c8c8c' : '#858585', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'block', width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: agentState === 'active' ? '#3fb950' : agentState === 'waiting' ? '#8b949e' : '#555',
              animation: agentState === 'active' ? 'log-dot-active 1.8s ease-in-out infinite' : agentState === 'waiting' ? 'log-dot-waiting 3.5s ease-in-out infinite' : 'none',
            }} />
            <span>Last update: {relativeTime()}</span>
          </div>
        </div>
        <div style={{ padding: '8px 12px 10px' }}>
          {entries.map((entry, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: '11px', fontFamily: 'Consolas, monospace', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                <span style={{ color: '#858585' }}>[{entry.timestamp}]</span>
                <span style={{ color: '#cccccc' }}> {entry.description}</span>
              </div>
              {resetMap[i] ? (
                <>
                  <div style={{ fontSize: '11px', color: '#858585', fontFamily: 'Consolas, monospace', marginTop: 2, marginLeft: 12 }}>
                    Reset at {resetMap[i].short}
                  </div>
                  <button style={linkStyle()} onClick={() => onReset(i, null)}
                    onMouseEnter={e => { e.currentTarget.style.color = '#cccccc'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#8c8c8c'; }}
                  >undo</button>
                </>
              ) : (
                <button style={linkStyle()} onClick={() => onReset(i, now())}
                  onMouseEnter={e => { e.currentTarget.style.color = '#cccccc'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#8c8c8c'; }}
                >reset</button>
              )}
            </div>
          ))}
          {resetEntries.map((re, i) => (
            <div key={`r${i}`} style={{ marginBottom: i < resetEntries.length - 1 ? 10 : 0 }}>
              <div style={{ fontSize: '11px', fontFamily: 'Consolas, monospace', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                <span style={{ color: '#858585' }}>[{re.ts}]</span>
                <span style={{ color: '#8b949e' }}> Reset: {re.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const verbPill = (verb) => (
  <span style={{
    display: 'inline-block', fontSize: '11px', fontStyle: 'italic',
    color: '#d0d0d0', background: '#2e2e2e', border: '1px solid #555',
    borderRadius: 4, padding: '1px 7px', marginRight: 7,
    lineHeight: '1.5', verticalAlign: 'middle', flexShrink: 0, fontWeight: 700,
  }}>{verb}</span>
);

function GitCheckPanel({ visible, onNavigate, activePanel }) {
  const STAGES = ['idle','submitted','thinking','bash1','bash1_ok','bash2','bash2_ok','text1','bash3','bash3_ok','done'];
  const [stage, setStage] = useState('idle');
  const [showHistory, setShowHistory] = useState(false);
  const [showActionLog, setShowActionLog] = useState(false);
  const [actionLog, setActionLog] = useState([]);
  const [resetMap, setResetMap] = useState({});
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [typing, setTyping] = useState(false);
  const [abortedMsg, setAbortedMsg] = useState(null);
  const [restoredMsg, setRestoredMsg] = useState(false);
  const chatRef = useRef(null);
  const typingActive = useRef(false);
  const idx = STAGES.indexOf(stage);
  const at = s => idx >= STAGES.indexOf(s);
  const is = s => stage === s;
  const pendingCmd = is('bash1') ? 1 : is('bash2') ? 2 : is('bash3') ? 3 : null;
  const agentState = is('idle') ? 'offline' : pendingCmd ? 'waiting' : 'active';
  const ENTRY_STAGES_GC = ['bash1_ok', 'bash2_ok', 'bash3_ok'];
  const ENTRY_COMMIT_REFS_GC = ['e4f2c18', 'a1b3d56', '7c9e2f4'];
  const ENTRY_PENDING_STAGES_GC = ['bash1', 'bash2', 'bash3'];
  const handleReset = (index, ts) => {
    if (ts === null) {
      setResetMap(prev => { const next = { ...prev }; delete next[index]; return next; });
      if (abortedMsg) setRestoredMsg(true);
      return;
    }
    if (is('done')) {
      setStage(ENTRY_PENDING_STAGES_GC[index] || 'bash1');
      setShowActionLog(false);
      return;
    }
    setResetMap(prev => ({ ...prev, [index]: ts }));
    if (pendingCmd) {
      setAbortedMsg(ENTRY_COMMIT_REFS_GC[index] || 'e4f2c18');
      setStage(ENTRY_STAGES_GC[index] || 'bash1_ok');
      setShowActionLog(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [stage]);

  useEffect(() => {
    if (stage !== 'idle') setLastUpdateTime(Date.now());
  }, [stage]);

  useEffect(() => {
    const i = STAGES.indexOf(stage);
    const entries = [];
    if (i >= STAGES.indexOf('bash1_ok')) entries.push({ timestamp: '6/4/26 2:27 PM', description: 'Bash: git status — working tree clean' });
    if (i >= STAGES.indexOf('bash2_ok')) entries.push({ timestamp: '6/4/26 2:28 PM', description: 'Bash: git log homepage — 5 commits found' });
    if (i >= STAGES.indexOf('bash3_ok')) entries.push({ timestamp: '6/4/26 2:30 PM', description: 'Bash: git checkout homepage — switched branch' });
    setActionLog(entries);
  }, [stage]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!pendingCmd) return;
      if (e.key === '1') allow(pendingCmd);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pendingCmd]);

  const runStages = () => {
    setTimeout(() => {
      setStage('thinking');
      setTimeout(() => setStage('bash1'), 900);
    }, 600);
  };

  const start = (forced) => {
    const msg = (forced ?? inputVal).trim();
    if (!is('idle') || !msg) return;
    setUserMsg(msg);
    setInputVal('');
    setStage('submitted');
    runStages();
  };

  const handleFocus = () => {
    if (!is('idle') || typing || inputVal) return;
    const prompt = 'is my changes of homepage committed?';
    setTyping(true);
    typingActive.current = true;
    let i = 0;
    const tick = () => {
      if (!typingActive.current) return;
      i++;
      setInputVal(prompt.slice(0, i));
      if (i < prompt.length) {
        setTimeout(tick, 38);
      } else {
        setTyping(false);
        typingActive.current = false;
        setTimeout(() => start(prompt), 500);
      }
    };
    setTimeout(tick, 120);
  };

  const allow = n => {
    if (n === 1) {
      setStage('bash1_ok');
      setTimeout(() => setStage('bash2'), 500);
    } else if (n === 2) {
      setStage('bash2_ok');
      setTimeout(() => {
        setStage('text1');
        setTimeout(() => setStage('bash3'), 900);
      }, 500);
    } else {
      setStage('bash3_ok');
      setTimeout(() => setStage('done'), 400);
    }
  };

  const reset = () => {
    setStage('idle');
    setInputVal('');
    setUserMsg('');
    setTyping(false);
    typingActive.current = false;
    setResetMap({});
    setLastUpdateTime(null);
    setAbortedMsg(null);
    setRestoredMsg(false);
  };

  if (!visible) return null;

  const dot = (color = '#3fb950') => (
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }} />
  );
  const row = (color, content) => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      {dot(color)}
      <div style={{ flex: 1, minWidth: 0 }}>{content}</div>
    </div>
  );
  const tLabel = (kind, file, sub) => (
    <div style={{ marginBottom: sub ? 3 : 0 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {verbPill(kind)}
        <span style={{ fontSize: '12px', color: '#8b949e' }}>{file}</span>
      </div>
      {sub && <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 1 }}>{sub}</div>}
    </div>
  );

  const bash1Cmd = 'git status';
  const bash1Out = "On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean";
  const bash2Cmd = 'git log homepage --oneline -5';
  const bash2Out = "e4f2c18 Update homepage hero section\na1b3d56 Add homepage animations\n7c9e2f4 Redesign homepage layout\n3d8a1c7 Fix homepage navigation\n9f5b2e0 Initial homepage changes";
  const bash3Cmd = 'git checkout homepage';
  const bash3Out = "Switched to branch 'homepage'\nYour branch is up to date with 'origin/homepage'.";

  const renderModal = n => {
    const cmd = n === 1 ? bash1Cmd : n === 2 ? bash2Cmd : bash3Cmd;
    const isDestructive = n === 3;
    const info = {
      1: { action: 'Check working tree status.', risk1: 'This command reads the current repository state.', risk2: 'No files will be modified.' },
      2: { action: 'View homepage commit history.', risk1: 'This command reads commit history for the homepage branch.', risk2: 'No files will be modified.' },
      3: { action: 'Switch to homepage branch.', risk1: 'This command will switch your active branch from [main] to [homepage].', risk2: 'Code will be rewritten.' },
    }[n];
    return (
      <div style={{ position: 'absolute', bottom: 68, left: 12, right: 12, zIndex: 20,
        background: '#1c1c1c', border: '1px solid #383838', borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)', padding: '14px 14px 10px', fontSize: '12px' }}>
        <div style={{ color: '#888', fontSize: '11px', marginBottom: 6 }}>Allow this bash command?</div>
        <div style={{ color: '#e1e1e1', fontWeight: 700, marginBottom: 8 }}>{info.action}</div>
        <div style={{ color: '#e8b84b', fontStyle: 'italic', fontSize: '11px', marginBottom: 10, lineHeight: 1.5 }}>
          {info.risk1}<br />{info.risk2}
        </div>
        <div style={{ fontFamily: 'Consolas, monospace', fontSize: '11px', color: '#858585',
          background: '#0d0d0d', borderRadius: 4, padding: '6px 9px', marginBottom: 10,
          whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.5 }}>{cmd}</div>
        {[
          { label: 'Yes', hi: true },
          { label: `Yes, allow ${cmd.split(' ')[0]}... for this project (just you)`, hi: false },
          { label: 'No', hi: false },
        ].map((opt, i) => (
          <button key={i} onClick={opt.label === 'No' ? undefined : () => allow(n)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '7px 10px', marginBottom: 4,
            background: opt.hi ? '#1f6feb' : '#252525',
            color: opt.hi ? '#fff' : '#cccccc',
            border: '1px solid ' + (opt.hi ? '#1f6feb' : '#383838'),
            borderRadius: 5, cursor: opt.label === 'No' ? 'default' : 'pointer',
            fontSize: '12px', fontFamily: 'inherit', textAlign: 'left',
          }}>
            <span style={{ color: opt.hi ? 'rgba(255,255,255,0.5)' : '#8c8c8c', fontWeight: 600, minWidth: 12 }}>{i + 1}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.label}</span>
          </button>
        ))}
        <input placeholder="Tell Claude what to do instead" style={{
          width: '100%', background: '#252525', border: '1px solid #383838', borderRadius: 5,
          padding: '6px 9px', color: '#8c8c8c', fontSize: '12px', fontFamily: 'inherit',
          outline: 'none', boxSizing: 'border-box', marginTop: 2,
        }} />
        <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 7 }}>Esc to cancel</div>
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a2a2a', flexShrink: 0, position: 'relative' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#e1e1e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>is my changes of homepage committed?</span>
        <div style={{ display: 'flex', gap: '8px', color: '#858585', flexShrink: 0, alignItems: 'center' }}>
          <svg onClick={() => { setShowActionLog(v => !v); setShowHistory(false); }} style={{ cursor: 'pointer', color: showActionLog ? '#cccccc' : '#858585' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/>
            <line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>
          </svg>
          <svg onClick={() => { setShowHistory(v => !v); setShowActionLog(false); }} style={{ cursor: 'pointer', color: showHistory ? '#cccccc' : '#858585' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ cursor: 'pointer', fontSize: '14px' }}>⊕</span>
        </div>
        {showActionLog && <ActionLogDropdown onClose={() => setShowActionLog(false)} title="is my changes committed?" entries={actionLog} resetMap={resetMap} onReset={handleReset} lastUpdateTime={lastUpdateTime} agentState={agentState} />}
        {showHistory && <HistoryDropdown onClose={() => setShowHistory(false)} onNavigate={onNavigate} activePanel={activePanel} />}
      </div>

      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 13 }}>
        {at('submitted') && userMsg && (
          <div style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.6 }}>{userMsg}</div>
        )}

        {at('thinking') && row('#555',
          <span style={{ fontSize: '12px', color: '#8b949e', display: 'inline-flex', alignItems: 'center' }}>
            {verbPill('Think')}Thinking <span style={{ fontSize: 10 }}>›</span>
          </span>
        )}

        {at('bash1') && row('#3fb950',
          <div>
            {tLabel('Bash', 'Check current branch status')}
            <BashBlock cmd={bash1Cmd} out={at('bash1_ok') ? bash1Out : null} />
          </div>
        )}

        {at('bash2') && row('#3fb950',
          <div>
            {tLabel('Bash', 'Check homepage branch commits')}
            <BashBlock cmd={bash2Cmd} out={at('bash2_ok') ? bash2Out : null} />
          </div>
        )}

        {at('text1') && row('#555',
          <p style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.65, margin: 0 }}>
            Yes — your homepage changes are committed, but on a different branch. The{' '}
            <code style={{ background: '#2a2a2a', padding: '1px 4px', borderRadius: 3, fontSize: 10, color: '#cccccc' }}>homepage</code>{' '}
            branch has 5 commits with your edits. You&apos;re currently on{' '}
            <code style={{ background: '#2a2a2a', padding: '1px 4px', borderRadius: 3, fontSize: 10, color: '#cccccc' }}>main</code>.
            Want me to switch you over?
          </p>
        )}

        {at('bash3') && row('#3fb950',
          <div>
            {tLabel('Bash', 'Switch to homepage branch')}
            <BashBlock cmd={bash3Cmd} out={at('bash3_ok') ? bash3Out : null} />
          </div>
        )}

        {abortedMsg && row('#e8b84b',
          <div style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.6 }}>
            {verbPill('Modify')}
            <span style={{ color: '#e08080' }}>Active process aborted.</span>{' '}
            Workspace reset to commit/state:{' '}
            <code style={{ background: '#2a2a2a', padding: '1px 4px', borderRadius: 3, fontSize: 10, color: '#cccccc' }}>{abortedMsg}</code>
            <button onClick={reset} style={{
              marginTop: 10, display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: '1px solid #383838', borderRadius: 5,
              padding: '5px 10px', color: '#8b949e', fontSize: '11px', fontFamily: 'inherit',
              cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#cccccc'; e.currentTarget.style.borderColor = '#555'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.borderColor = '#383838'; }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
              Start over
            </button>
          </div>
        )}

        {restoredMsg && row('#3fb950',
          <div style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.6 }}>
            {verbPill('Restore')}
            Modified data has returned to the earlier state.
          </div>
        )}

        {at('done') && row('#3fb950',
          <div style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.7 }}>
            Switched to <code style={{ background: '#2a2a2a', padding: '1px 4px', borderRadius: 3, fontSize: 10, color: '#cccccc' }}>homepage</code>. Here&apos;s a summary of all the changes made:<br />
            <strong>Changes:</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              <li style={{ marginBottom: 3 }}>
                Confirmed 5 commits on <span style={{ color: '#79b8ff' }}>homepage</span> branch
              </li>
              <li>
                Switched active branch from <span style={{ color: '#79b8ff' }}>main</span> → <span style={{ color: '#79b8ff' }}>homepage</span>
              </li>
            </ul>
            <button onClick={reset} style={{
              marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: '1px solid #383838', borderRadius: 5,
              padding: '5px 10px', color: '#8b949e', fontSize: '11px', fontFamily: 'inherit',
              cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#cccccc'; e.currentTarget.style.borderColor = '#555'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.borderColor = '#383838'; }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
              Start over
            </button>
          </div>
        )}
      </div>

      {pendingCmd && renderModal(pendingCmd)}

      <div style={{ borderTop: '1px solid #2a2a2a', padding: '8px 10px', flexShrink: 0 }}>
        <div style={{ background: '#252525', border: '1px solid #383838', borderRadius: 6, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            value={inputVal}
            onChange={e => { if (is('idle') && !typing) setInputVal(e.target.value); }}
            onKeyDown={e => { if (e.key === 'Enter' && !typing) start(); }}
            onFocus={handleFocus}
            placeholder={is('idle') && !typing ? 'Ask Claude...' : ''}
            readOnly={typing || !is('idle')}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: typing ? '#8b949e' : '#cccccc', fontSize: '11px', fontFamily: 'inherit', cursor: is('idle') ? 'text' : 'default' }}
          />
          <svg onClick={start} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={is('idle') ? '#858585' : '#444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, cursor: is('idle') ? 'pointer' : 'default' }}>
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#8c8c8c', marginTop: 5 }}>⌘ Esc to focus or unfocus Claude</div>
      </div>
    </div>
  );
}

function DiffView({ subtitle, left, right }) {
  return (
    <div style={{ marginTop: 5 }}>
      {subtitle && <div style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: 4 }}>{subtitle}</div>}
      <div style={{ display: 'flex', fontSize: '11px', fontFamily: 'Consolas, monospace', border: '1px solid #2a2a2a', borderRadius: 4, overflow: 'hidden', lineHeight: '1.65' }}>
        <div style={{ flex: 1, background: '#161616', minWidth: 0, padding: '4px 0' }}>
          {left.map((ln, i) => (
            <div key={i} style={{ padding: '0 10px', whiteSpace: 'pre',
              background: ln.del ? 'rgba(210,60,60,0.18)' : ln.hatch ? 'repeating-linear-gradient(-45deg,transparent,transparent 4px,rgba(255,255,255,0.02) 4px,rgba(255,255,255,0.02) 8px)' : 'transparent',
              color: ln.del ? '#e08080' : '#8c8c8c' }}>
              {ln.text}
            </div>
          ))}
        </div>
        <div style={{ width: 16, background: '#0d0d0d', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }}>
          {left.map((ln, i) => (
            <div key={i} style={{ fontSize: '9px', color: ln.del || ln.hatch ? '#444' : '#222', lineHeight: '1.65em', userSelect: 'none' }}>□</div>
          ))}
        </div>
        <div style={{ flex: 1, background: '#161616', minWidth: 0, padding: '4px 0' }}>
          {right.map((ln, i) => (
            <div key={i} style={{ padding: '0 10px', whiteSpace: 'pre',
              background: ln.add ? 'rgba(60,180,60,0.18)' : 'transparent',
              color: ln.add ? '#80cc80' : '#8c8c8c' }}>
              {ln.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BashBlock({ cmd, out }) {
  return (
    <div style={{ marginTop: 6, background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', fontSize: '11px', fontFamily: 'Consolas, monospace' }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: out ? 8 : 0 }}>
        <span style={{ color: '#4a8fcc', fontWeight: 700, minWidth: 28, flexShrink: 0 }}>IN</span>
        <span style={{ color: '#cccccc', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.55 }}>{cmd}</span>
      </div>
      {out && (
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ color: '#8b949e', fontWeight: 700, minWidth: 28, flexShrink: 0 }}>OUT</span>
          <span style={{ color: '#858585', whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{out}</span>
        </div>
      )}
    </div>
  );
}

function AgentSimPanel({ visible, onNavigate, activePanel }) {
  const STAGES = ['idle','submitted','thinking','read1','edit1','text1','edit2','bash1','bash1_ok','bash2','bash2_ok','done'];
  const [stage, setStage] = useState('idle');
  const [showHistory, setShowHistory] = useState(false);
  const [showActionLog, setShowActionLog] = useState(false);
  const [actionLog, setActionLog] = useState([]);
  const [resetMap, setResetMap] = useState({});
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [typing, setTyping] = useState(false);
  const [abortedMsg, setAbortedMsg] = useState(null);
  const [restoredMsg, setRestoredMsg] = useState(false);
  const chatRef = useRef(null);
  const typingActive = useRef(false);
  const idx = STAGES.indexOf(stage);
  const at = s => idx >= STAGES.indexOf(s);
  const is = s => stage === s;
  const pendingCmd = is('bash1') ? 1 : is('bash2') ? 2 : null;
  const agentState = is('idle') ? 'offline' : pendingCmd ? 'waiting' : 'active';
  const ENTRY_STAGES_AS = ['bash1_ok', 'bash2_ok'];
  const ENTRY_COMMIT_REFS_AS = ['7c9e2f4', 'a1b3d56'];
  const ENTRY_PENDING_STAGES_AS = ['bash1', 'bash2'];
  const handleReset = (index, ts) => {
    if (ts === null) {
      setResetMap(prev => { const next = { ...prev }; delete next[index]; return next; });
      if (abortedMsg) setRestoredMsg(true);
      return;
    }
    if (is('done')) {
      setStage(ENTRY_PENDING_STAGES_AS[index] || 'bash1');
      setShowActionLog(false);
      return;
    }
    setResetMap(prev => ({ ...prev, [index]: ts }));
    if (pendingCmd) {
      setAbortedMsg(ENTRY_COMMIT_REFS_AS[index] || '7c9e2f4');
      setStage(ENTRY_STAGES_AS[index] || 'bash1_ok');
      setShowActionLog(false);
    }
  };

  useEffect(() => {
    if (stage !== 'idle') setLastUpdateTime(Date.now());
  }, [stage]);

  useEffect(() => {
    const i = STAGES.indexOf(stage);
    const entries = [];
    if (i >= STAGES.indexOf('bash1_ok')) entries.push({ timestamp: '6/4/26 2:24 PM', description: 'Edit App.css: Resized .icon from 22px → 26px' });
    if (i >= STAGES.indexOf('bash2_ok')) entries.push({ timestamp: '6/4/26 2:25 PM', description: 'Edit App.css: Added flex centering rules' });
    setActionLog(entries);
  }, [stage]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [stage]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!pendingCmd) return;
      if (e.key === '1') allow(pendingCmd);
      if (e.key === '2') { /* No — dismiss without acting */ }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pendingCmd]);

  const runStages = () => {
    setTimeout(() => {
      setStage('thinking');
      setTimeout(() => {
        setStage('read1');
        setTimeout(() => {
          setStage('edit1');
          setTimeout(() => {
            setStage('text1');
            setTimeout(() => {
              setStage('edit2');
              setTimeout(() => setStage('bash1'), 500);
            }, 600);
          }, 600);
        }, 500);
      }, 900);
    }, 600);
  };

  const start = (forced) => {
    const msg = (forced ?? inputVal).trim();
    if (!is('idle') || !msg) return;
    setUserMsg(msg);
    setInputVal('');
    setStage('submitted');
    runStages();
  };

  const handleFocus = () => {
    if (!is('idle') || typing || inputVal) return;
    const prompt = 'resize the icons in the sidebar by 20% and center the text down below the icons';
    setTyping(true);
    typingActive.current = true;
    let i = 0;
    const tick = () => {
      if (!typingActive.current) return;
      i++;
      setInputVal(prompt.slice(0, i));
      if (i < prompt.length) {
        setTimeout(tick, 38);
      } else {
        setTyping(false);
        typingActive.current = false;
        setTimeout(() => start(prompt), 500);
      }
    };
    setTimeout(tick, 120);
  };

  const allow = n => {
    if (n === 1) { setStage('bash1_ok'); setTimeout(() => setStage('bash2'), 500); }
    else { setStage('bash2_ok'); setTimeout(() => setStage('done'), 400); }
  };

  const reset = () => {
    setStage('idle');
    setInputVal('');
    setUserMsg('');
    setTyping(false);
    typingActive.current = false;
    setResetMap({});
    setLastUpdateTime(null);
    setAbortedMsg(null);
    setRestoredMsg(false);
  };

  if (!visible) return null;

  const dot = (color = '#3fb950') => (
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }} />
  );
  const row = (color, content) => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      {dot(color)}
      <div style={{ flex: 1, minWidth: 0 }}>{content}</div>
    </div>
  );
  const toolLabel = (kind, file, sub) => (
    <div style={{ marginBottom: sub ? 3 : 0 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {verbPill(kind)}
        <span style={{ fontSize: '12px', color: '#8b949e' }}>{file}</span>
      </div>
      {sub && <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 1 }}>{sub}</div>}
    </div>
  );

  const edit1L = [
    { text: '.icon {' }, { text: '  margin-bottom: 16px;', del: true },
    { text: '  width: 22px;', del: true }, { text: '  height: 22px;', del: true }, { text: '}' },
  ];
  const edit1R = [
    { text: '.icon {' }, { text: '  margin-bottom: 8px;', add: true },
    { text: '  width: 26px;', add: true }, { text: '  height: 26px;', add: true }, { text: '}' },
  ];
  const edit2L = [
    { text: '.icon {' }, { text: '  margin-bottom: 8px;' },
    { text: '', hatch: true }, { text: '', hatch: true },
    { text: '  width: 26px;' }, { text: '  height: 26px;' }, { text: '}' },
  ];
  const edit2R = [
    { text: '.icon {' }, { text: '  margin-bottom: 8px;' },
    { text: '  display: flex;', add: true }, { text: '  justify-content: center;', add: true },
    { text: '  width: 26px;' }, { text: '  height: 26px;' }, { text: '}' },
  ];

  const bash1Cmd = 'grep -n ".icon\\|display\\|justify" src/App.css';
  const bash1Out = '.icon {\n  margin-bottom: 8px;\n  display: flex;\n  justify-content: center;\n  width: 26px;\n  height: 26px;\n}';
  const bash2Cmd = "sed -i '' '/\\.icon {/,/}/ s/margin-bottom: 8px;/margin-bottom: 8px;\\n  display: flex;\\n  justify-content: center;/' src/App.css";
  const bash2Out = '(Bash completed with no output)';

  const renderModal = n => {
    const cmd = n === 1 ? bash1Cmd : bash2Cmd;
    const isDestructive = n === 2;
    const info = n === 1
      ? { action: 'Verify icon styles in App.css.', risk1: 'This command searches App.css for matching lines and prints them to stdout.', risk2: 'No files will be modified.' }
      : { action: 'Insert flex centering into App.css.', risk1: 'This command edits App.css in-place, modifying the .icon block permanently.', risk2: 'Code will be overwritten.' };

    return (
      <div style={{ position: 'absolute', bottom: 68, left: 12, right: 12, zIndex: 20,
        background: '#1c1c1c', border: '1px solid #383838', borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)', padding: '14px 14px 10px', fontSize: '12px' }}>
        <div style={{ color: '#888', fontSize: '11px', marginBottom: 6 }}>Allow this bash command?</div>
        <div style={{ color: '#e1e1e1', fontWeight: 700, marginBottom: 8 }}>{info.action}</div>
        <div style={{ color: '#e8b84b', fontStyle: 'italic', fontSize: '11px', marginBottom: 10, lineHeight: 1.5 }}>
          {info.risk1}<br />{info.risk2}
        </div>
        <div style={{ fontFamily: 'Consolas, monospace', fontSize: '11px', color: '#858585',
          background: '#0d0d0d', borderRadius: 4, padding: '6px 9px', marginBottom: 10,
          whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.5 }}>{cmd}</div>
        {[
          { label: 'Yes', hi: true },
          { label: `Yes, allow ${cmd.split(' ')[0]}... for this project (just you)`, hi: false },
          { label: 'No', hi: false },
        ].map((opt, i) => (
          <button key={i} onClick={opt.label === 'No' ? undefined : () => allow(n)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '7px 10px', marginBottom: 4,
            background: opt.hi ? '#1f6feb' : '#252525',
            color: opt.hi ? '#fff' : '#cccccc',
            border: '1px solid ' + (opt.hi ? '#1f6feb' : '#383838'),
            borderRadius: 5, cursor: opt.label === 'No' ? 'default' : 'pointer',
            fontSize: '12px', fontFamily: 'inherit', textAlign: 'left',
          }}>
            <span style={{ color: opt.hi ? 'rgba(255,255,255,0.5)' : '#8c8c8c', fontWeight: 600, minWidth: 12 }}>{i + 1}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.label}</span>
          </button>
        ))}
        <input placeholder="Tell Claude what to do instead" style={{
          width: '100%', background: '#252525', border: '1px solid #383838', borderRadius: 5,
          padding: '6px 9px', color: '#8c8c8c', fontSize: '12px', fontFamily: 'inherit',
          outline: 'none', boxSizing: 'border-box', marginTop: 2,
        }} />
        <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 7 }}>Esc to cancel</div>
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a2a2a', flexShrink: 0, position: 'relative' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#e1e1e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>change the side bar icons</span>
        <div style={{ display: 'flex', gap: '8px', color: '#858585', flexShrink: 0, alignItems: 'center' }}>
          <svg onClick={() => { setShowActionLog(v => !v); setShowHistory(false); }} style={{ cursor: 'pointer', color: showActionLog ? '#cccccc' : '#858585' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/>
            <line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>
          </svg>
          <svg onClick={() => { setShowHistory(v => !v); setShowActionLog(false); }} style={{ cursor: 'pointer', color: showHistory ? '#cccccc' : '#858585' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ cursor: 'pointer', fontSize: '14px' }}>⊕</span>
        </div>
        {showActionLog && <ActionLogDropdown onClose={() => setShowActionLog(false)} title="change the side bar icons" entries={actionLog} resetMap={resetMap} onReset={handleReset} lastUpdateTime={lastUpdateTime} agentState={agentState} />}
        {showHistory && <HistoryDropdown onClose={() => setShowHistory(false)} onNavigate={onNavigate} activePanel={activePanel} />}
      </div>

      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 13 }}>
        {at('submitted') && userMsg && (
          <div style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.6 }}>
            {userMsg}
          </div>
        )}

        {at('thinking') && row('#555',
          <span style={{ fontSize: '12px', color: '#8b949e', display: 'inline-flex', alignItems: 'center' }}>
            {verbPill('Think')}Thinking <span style={{ fontSize: 10 }}>›</span>
          </span>
        )}

        {at('read1') && row('#3fb950',
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {verbPill('Read')}
              <span style={{ fontSize: '12px', color: '#8b949e' }}>App.css</span>
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 1 }}>Scanning current icon styles</div>
          </div>
        )}

        {at('edit1') && row('#3fb950',
          <div>
            {toolLabel('Edit', 'App.css', 'Modified')}
            <DiffView left={edit1L} right={edit1R} />
          </div>
        )}

        {at('text1') && row('#555',
          <p style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.65, margin: 0 }}>
            Now add flex centering to align text directly below the icons:
          </p>
        )}

        {at('edit2') && row('#3fb950',
          <div>
            {toolLabel('Edit', 'App.css', 'Added 2 lines')}
            <DiffView left={edit2L} right={edit2R} />
          </div>
        )}

        {at('bash1') && row('#3fb950',
          <div>
            {toolLabel('Bash', 'Verify icon styles')}
            <BashBlock cmd={bash1Cmd} out={at('bash1_ok') ? bash1Out : null} />
          </div>
        )}

        {at('bash2') && row('#3fb950',
          <div>
            {toolLabel('Bash', 'Edit App.css')}
            <BashBlock cmd={bash2Cmd} out={at('bash2_ok') ? bash2Out : null} />
          </div>
        )}

        {abortedMsg && row('#e8b84b',
          <div style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.6 }}>
            {verbPill('Modify')}
            <span style={{ color: '#e08080' }}>Active process aborted.</span>{' '}
            Workspace reset to commit/state:{' '}
            <code style={{ background: '#2a2a2a', padding: '1px 4px', borderRadius: 3, fontSize: 10, color: '#cccccc' }}>{abortedMsg}</code>
            <button onClick={reset} style={{
              marginTop: 10, display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: '1px solid #383838', borderRadius: 5,
              padding: '5px 10px', color: '#8b949e', fontSize: '11px', fontFamily: 'inherit',
              cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#cccccc'; e.currentTarget.style.borderColor = '#555'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.borderColor = '#383838'; }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
              Start over
            </button>
          </div>
        )}

        {restoredMsg && row('#3fb950',
          <div style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.6 }}>
            {verbPill('Restore')}
            Modified data has returned to the earlier state.
          </div>
        )}

        {at('done') && row('#3fb950',
          <div style={{ fontSize: '12px', color: '#cccccc', lineHeight: 1.7 }}>
            No errors. Here's a summary of all the changes made:<br />
            <strong>Changes:</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              <li style={{ marginBottom: 3 }}>
                <span style={{ color: '#79b8ff' }}>App.css</span> — Resized{' '}
                <code style={{ background: '#2a2a2a', padding: '1px 4px', borderRadius: 3, fontSize: 10, color: '#cccccc' }}>.icon</code>{' '}
                from 22px → 26px (+20%)
              </li>
              <li>
                <span style={{ color: '#79b8ff' }}>App.css</span> — Added{' '}
                <code style={{ background: '#2a2a2a', padding: '1px 4px', borderRadius: 3, fontSize: 10, color: '#cccccc' }}>display: flex; justify-content: center</code>{' '}
                to center text below icons
              </li>
            </ul>
            <button onClick={reset} style={{
              marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: '1px solid #383838', borderRadius: 5,
              padding: '5px 10px', color: '#8b949e', fontSize: '11px', fontFamily: 'inherit',
              cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#cccccc'; e.currentTarget.style.borderColor = '#555'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.borderColor = '#383838'; }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
              Start over
            </button>
          </div>
        )}
      </div>

      {pendingCmd && renderModal(pendingCmd)}

      <div style={{ borderTop: '1px solid #2a2a2a', padding: '8px 10px', flexShrink: 0 }}>
        <div style={{ background: '#252525', border: '1px solid #383838', borderRadius: 6, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            value={inputVal}
            onChange={e => { if (is('idle') && !typing) setInputVal(e.target.value); }}
            onKeyDown={e => { if (e.key === 'Enter' && !typing) start(); }}
            onFocus={handleFocus}
            placeholder={is('idle') && !typing ? 'Ask Claude...' : ''}
            readOnly={typing || !is('idle')}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: typing ? '#8b949e' : '#cccccc', fontSize: '11px', fontFamily: 'inherit', cursor: is('idle') ? 'text' : 'default' }}
          />
          <svg onClick={start} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={is('idle') ? '#858585' : '#444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, cursor: is('idle') ? 'pointer' : 'default' }}>
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#8c8c8c', marginTop: 5 }}>⌘ Esc to focus or unfocus Claude</div>
      </div>
    </div>
  );
}

export default function App() {
  const [activePanel, setActivePanel] = useState(1);
  const [claudeWidth, setClaudeWidth] = useState(() => Math.round(window.innerWidth / 3));
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const claudeFraction = useRef(1 / 3);
  const resizeTarget = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!resizeTarget.current) return;
      const delta = e.clientX - startX.current;
      if (resizeTarget.current === 'sidebar') {
        setSidebarWidth(Math.max(120, Math.min(500, startWidth.current + delta)));
      } else {
        const newWidth = Math.max(180, Math.min(window.innerWidth * 0.6, startWidth.current - delta));
        setClaudeWidth(newWidth);
        claudeFraction.current = newWidth / window.innerWidth;
      }
    };
    const onMouseUp = () => { resizeTarget.current = null; };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  useEffect(() => {
    const onWindowResize = () => {
      setClaudeWidth(Math.round(claudeFraction.current * window.innerWidth));
    };
    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
  }, []);

  const onSidebarResizeStart = (e) => {
    resizeTarget.current = 'sidebar';
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    e.preventDefault();
  };

  const onClaudeResizeStart = (e) => {
    resizeTarget.current = 'claude';
    startX.current = e.clientX;
    startWidth.current = claudeWidth;
    e.preventDefault();
  };

  const j = { key: '#9cdcfe', str: '#ce9178', punc: '#cccccc' };

  const mcpLines = [
    { n:  1, t: [['{', 'punc']] },
    { n:  2, t: [['  ', null], ['"mcpServers"', 'key'], [': {', 'punc']] },
    { n:  3, t: [['    ', null], ['"figma"', 'key'], [': {', 'punc']] },
    { n:  4, t: [['      ', null], ['"type"', 'key'], [': ', 'punc'], ['"http"', 'str'], [',', 'punc']] },
    { n:  5, t: [['      ', null], ['"url"', 'key'], [': ', 'punc'], ['"https://figma.mcp.server/sse"', 'str'], [',', 'punc']] },
    { n:  6, t: [['      ', null], ['"headers"', 'key'], [': {', 'punc']] },
    { n:  7, t: [['        ', null], ['"X-Figma-Token"', 'key'], [': ', 'punc'], ['"${env:FIGMA_API_KEY}"', 'str']] },
    { n:  8, t: [['      ', null], ['}', 'punc']] },
    { n:  9, t: [['    ', null], ['}', 'punc'], [',', 'punc']] },
    { n: 10, t: [['    ', null], ['"filesystem"', 'key'], [': {', 'punc']] },
    { n: 11, t: [['      ', null], ['"command"', 'key'], [': ', 'punc'], ['"npx"', 'str'], [',', 'punc']] },
    { n: 12, t: [['      ', null], ['"args"', 'key'], [': [', 'punc'], ['"-y"', 'str'], [',', 'punc']] },
    { n: 13, t: [['        ', null], ['"@modelcontextprotocol/server-filesystem"', 'str'], [',', 'punc']] },
    { n: 14, t: [['        ', null], ['"/Users/irene/Desktop/claude-code-redesign"', 'str']] },
    { n: 15, t: [['      ', null], [']', 'punc']] },
    { n: 16, t: [['    ', null], ['}', 'punc'], [',', 'punc']] },
    { n: 17, t: [['    ', null], ['"github"', 'key'], [': {', 'punc']] },
    { n: 18, t: [['      ', null], ['"command"', 'key'], [': ', 'punc'], ['"npx"', 'str'], [',', 'punc']] },
    { n: 19, t: [['      ', null], ['"args"', 'key'], [': [', 'punc'], ['"-y"', 'str'], [', ', 'punc'], ['"@modelcontextprotocol/server-github"', 'str'], [']', 'punc'], [',', 'punc']] },
    { n: 20, t: [['      ', null], ['"env"', 'key'], [': {', 'punc']] },
    { n: 21, t: [['        ', null], ['"GITHUB_TOKEN"', 'key'], [': ', 'punc'], ['"${env:GITHUB_TOKEN}"', 'str']] },
    { n: 22, t: [['      ', null], ['}', 'punc']] },
    { n: 23, t: [['    ', null], ['}', 'punc']] },
    { n: 24, t: [['  ', null], ['}', 'punc']] },
    { n: 25, t: [['}', 'punc']] },
  ];

  const sidebar = [
    { label: 'CLAUDE-CODE-REDESIGN', depth: 0, kind: 'root', open: true },
    { label: '.claude', depth: 1, kind: 'folder', open: true },
    { label: '.mcp.json', depth: 2, kind: 'json', active: true },
    { label: 'settings.local.json', depth: 2, kind: 'json' },
    { label: 'node_modules', depth: 1, kind: 'folder', open: false },
    { label: 'public', depth: 1, kind: 'folder', open: true },
    { label: 'vite.svg', depth: 2, kind: 'text' },
    { label: 'src', depth: 1, kind: 'folder', open: true },
    { label: 'assets', depth: 2, kind: 'folder', open: false },
    { label: 'App.css', depth: 2, kind: 'css' },
    { label: 'App.jsx', depth: 2, kind: 'jsx' },
    { label: 'index.css', depth: 2, kind: 'css' },
    { label: 'main.jsx', depth: 2, kind: 'jsx' },
    { label: '.gitignore', depth: 1, kind: 'config' },
    { label: 'eslint.config.js', depth: 1, kind: 'js' },
    { label: 'index.html', depth: 1, kind: 'html' },
    { label: 'package-lock.json', depth: 1, kind: 'json' },
    { label: 'package.json', depth: 1, kind: 'json' },
    { label: 'README.md', depth: 1, kind: 'text' },
    { label: 'vite.config.js', depth: 1, kind: 'js' },
  ];

  const icons = {
    json:   { glyph: '{}', color: '#e8c27a' },
    jsx:    { glyph: '⚛', color: '#61dafb' },
    js:     { glyph: 'JS', color: '#f0db4f' },
    css:    { glyph: '~', color: '#42a5f5' },
    html:   { glyph: '</>', color: '#e87b40' },
    text:   { glyph: '≡', color: '#858585' },
    config: { glyph: '⚙', color: '#9e9e9e' },
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1e1e1e', color: '#cccccc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif', fontSize: '13px', overflow: 'hidden' }}>

      <div style={{ height: '35px', background: '#3c3c3c', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }} />
        </div>
        <span style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#cccccc' }}>.mcp.json — claude-code-redesign</span>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        <div style={{ width: sidebarWidth + 'px', background: '#252526', flexShrink: 0, overflow: 'auto' }}>
          <div style={{ padding: '8px 12px 4px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#bbbbbb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            EXPLORER <span style={{ fontWeight: 400, fontSize: '13px', color: '#8c8c8c', letterSpacing: 0, cursor: 'pointer' }}>⋯⋯⋯</span>
          </div>
          {sidebar.map((item, i) => {
            const ic = icons[item.kind];
            const isFolder = item.kind === 'folder' || item.kind === 'root';
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '3px',
                padding: '2px 4px 2px ' + (4 + item.depth * 12) + 'px',
                fontSize: item.kind === 'root' ? '11px' : '13px',
                fontWeight: item.kind === 'root' ? 700 : 400,
                letterSpacing: item.kind === 'root' ? '0.08em' : 'normal',
                color: item.active ? '#ffffff' : item.kind === 'root' ? '#bbbbbb' : '#cccccc',
                background: item.active ? '#094771' : 'transparent',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                {isFolder ? (
                  <span style={{ color: '#c5a028', fontSize: '10px', minWidth: '12px', textAlign: 'center' }}>
                    {item.open ? '▾' : '▸'}
                  </span>
                ) : (
                  <span style={{ color: ic ? ic.color : '#858585', fontSize: '11px', minWidth: '16px', textAlign: 'center', fontFamily: 'Consolas, monospace' }}>
                    {ic ? ic.glyph : '·'}
                  </span>
                )}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
              </div>
            );
          })}
        </div>
        <div className="sidebar-resize-handle" onMouseDown={onSidebarResizeStart} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ height: '35px', background: '#252526', display: 'flex', alignItems: 'stretch', borderBottom: '1px solid #252526', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 14px', background: '#1e1e1e', borderTop: '1px solid #007acc', borderRight: '1px solid #3c3c3c', fontSize: '13px', color: '#cccccc', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#e8c27a', fontSize: '12px', fontFamily: 'Consolas, monospace' }}>{'{}'}</span>
              .mcp.json
              <span style={{ fontSize: '11px', color: '#858585' }}>×</span>
            </div>
            <div style={{ flex: 1, background: '#2d2d2d', borderBottom: '1px solid #3c3c3c' }} />
          </div>
          <div style={{ height: '22px', background: '#1e1e1e', display: 'flex', alignItems: 'center', padding: '0 14px', borderBottom: '1px solid #2a2a2a', fontSize: '12px', color: '#858585', flexShrink: 0, gap: '4px' }}>
            <span>.claude</span><span style={{ fontSize: '10px' }}>›</span><span style={{ color: '#cccccc' }}>.mcp.json</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto', background: '#141414', paddingTop: '8px', paddingBottom: '40px' }}>
            {mcpLines.map(({ n, t }) => (
              <div key={n} style={{ display: 'flex', lineHeight: '19px', minHeight: '19px' }}>
                <span style={{ color: '#858585', minWidth: '44px', textAlign: 'right', paddingRight: '18px', paddingLeft: '8px', userSelect: 'none', fontSize: '13px', fontFamily: 'Consolas, "Courier New", monospace', flexShrink: 0 }}>{n}</span>
                <span style={{ fontFamily: 'Consolas, "Courier New", monospace', fontSize: '13px', whiteSpace: 'pre', flex: 1 }}>
                  {t.map(([text, ck], idx) => (
                    <span key={idx} style={{ color: ck ? j[ck] : '#cccccc' }}>{text}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="claude-resize-handle" onMouseDown={onClaudeResizeStart} />
        <div style={{ width: claudeWidth + 'px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #3c3c3c', background: '#1a1a1a', flexShrink: 0 }}>
          {/* ── Shared tab bar ── */}
          <div style={{ height: '35px', display: 'flex', background: '#2d2d2d', borderBottom: '1px solid #3c3c3c', flexShrink: 0 }}>
            {[1, 2].map(n => (
              <div key={n} onClick={() => setActivePanel(n)} style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: '5px', padding: '0 8px',
                cursor: 'pointer',
                background: activePanel === n ? '#252526' : '#2d2d2d',
                borderTop: '1px solid ' + (activePanel === n ? '#e07b00' : 'transparent'),
                borderLeft: n === 2 ? '1px solid #3c3c3c' : 'none',
              }}>
                <span style={{ color: '#e07b00', fontSize: '12px', flexShrink: 0 }}>✳</span>
                <span style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                  color: activePanel === n ? '#cccccc' : '#9a9a9a' }}>
                  {n === 1 ? 'change the side bar icons' : 'is my changes committed?'}
                </span>
                {activePanel === n && <span style={{ color: '#8c8c8c', fontSize: '11px', flexShrink: 0 }}>×</span>}
              </div>
            ))}
          </div>
          <AgentSimPanel visible={activePanel === 1} onNavigate={setActivePanel} activePanel={activePanel} />
          <GitCheckPanel visible={activePanel === 2} onNavigate={setActivePanel} activePanel={activePanel} />
        </div>

      </div>

      <div style={{ height: '22px', background: '#007acc', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '12px', color: '#ffffff', flexShrink: 0, gap: '16px' }}>
        <span>⎋  homepage</span>
        <span style={{ flex: 1 }} />
        <span>Ln 12, Col 1</span>
        <span>UTF-8</span>
        <span>JSON</span>
      </div>

    </div>
  );
}
