import React, { useState } from 'react';
import './App.css';

function App() {
  // ===== STATE ===== (This stores all user answers)
  const [houseSize, setHouseSize] = useState('Medium');
  const [doors, setDoors] = useState(['South']);
  const [totalDoors, setTotalDoors] = useState('2');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [restricted, setRestricted] = useState('');
  const [showPlan, setShowPlan] = useState(false);
  
  const [showTopError, setShowTopError] = useState(false);
  const [houseColor, setHouseColor] = useState('transparent');
  const [show3D, setShow3D] = useState(false);

  // ===== THEME TOGGLE =====
  const [darkMode, setDarkMode] = useState(false);

  // ===== DOOR HANDLING =====
  const toggleDoor = (door) => {
    if (doors.includes(door)) {
      setDoors(doors.filter(d => d !== door));
    } else {
      setDoors([...doors, door]);
    }
  };

  // ===== BUDGET FORMATTER =====
  const formatBudget = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    return numbers ? Number(numbers).toLocaleString('en-IN') : '';
  };

  const handleBudgetChange = (e) => {
    setBudget(formatBudget(e.target.value));
  };

  // ===== SHOW PLAN =====
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check required fields: houseSize, budget, duration
    if (!houseSize || !budget || !duration) {
      setShowTopError(true);
      setShowPlan(false);
      return;
    }

    setShowTopError(false);
    setShowPlan(true);
    setShow3D(false);
  };

  const changeTheme = (accentColor, darkTheme) => {
    document.documentElement.style.setProperty('--accent', accentColor);
    setDarkMode(darkTheme);
  };

  // ===== HOUSE SIZE OPTIONS =====
  const sizes = [
    { value: 'Small', label: '🏡', name: 'Small', desc: 'Up to 1,000 sq ft' },
    { value: 'Medium', label: '🏠', name: 'Medium', desc: '1,000 – 2,500 sq ft' },
    { value: 'Big', label: '🏰', name: 'Big', desc: '2,500+ sq ft' },
  ];

  const doorDirections = [
    { value: 'North', icon: '⬆️' },
    { value: 'South', icon: '⬇️' },
    { value: 'East', icon: '➡️' },
    { value: 'West', icon: '⬅️' },
  ];

  const sqftMap = {
    Small: 'Up to 1,000 sq ft',
    Medium: '1,000 – 2,500 sq ft',
    Big: '2,500+ sq ft'
  };

  const tips = {
    Small: '🏡 Cozy and efficient — easier to maintain and very budget-friendly!',
    Medium: '🏠 A perfect family home — room to grow without the overwhelm!',
    Big: '🏰 Grand living! Allow extra months in your timeline for finishing touches.',
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>

      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="toggle-wrap">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <div className="header-inner">
          <span className="header-emoji">🏠</span>
          <h1>Click. Connect. Construct. Craft.</h1>
          <p>Answer 4 quick questions and we'll craft your perfect plan! 🌟</p>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="main">
        {showTopError && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px 20px', borderRadius: '12px', borderLeft: '5px solid #dc2626', marginBottom: '20px', fontWeight: '700' }}>
            ⚠️ Please fill in ALL the details before seeing your plan!
          </div>
        )}

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit}>

          {/* ===== Q1: HOUSE SIZE ===== */}
          <div className="card">
            <div className="card-title-row">
              <span className="q-badge">1</span>
              <span className="card-title">House Construction Size &amp; Door Placement</span>
              <span className="card-emoji">📐</span>
            </div>

            <label className="field-label">Choose your house size</label>
            <div className="size-options">
              {sizes.map(size => (
                <div className="size-card" key={size.value}>
                  <input
                    type="radio"
                    name="houseSize"
                    id={`size${size.value}`}
                    value={size.value}
                    checked={houseSize === size.value}
                    onChange={(e) => setHouseSize(e.target.value)}
                  />
                  <label htmlFor={`size${size.value}`}>
                    <span className="size-icon">{size.label}</span>
                    <span className="size-name">{size.name}</span>
                    <span className="size-desc">{size.desc}</span>
                  </label>
                </div>
              ))}
            </div>

            {/* DOORS SECTION */}
            <div className="doors-section">
              <p className="doors-section-title">🚪 Select which faces will have doors</p>
              <div className="compass-grid">
                {doorDirections.map(dir => (
                  <label
                    className={`door-option ${doors.includes(dir.value) ? 'checked' : ''}`}
                    key={dir.value}
                  >
                    <input
                      type="checkbox"
                      checked={doors.includes(dir.value)}
                      onChange={() => toggleDoor(dir.value)}
                    />
                    <span className="door-dir-icon">{dir.icon}</span>
                    <span className="door-dir-name">{dir.value}</span>
                  </label>
                ))}
              </div>

              <div style={{ marginTop: '14px' }}>
                <label className="field-label" htmlFor="totalDoors">Total number of main doors</label>
                <div className="select-wrap">
                  <select
                    id="totalDoors"
                    value={totalDoors}
                    onChange={(e) => setTotalDoors(e.target.value)}
                  >
                    <option value="1">1 Door</option>
                    <option value="2">2 Doors</option>
                    <option value="3">3 Doors</option>
                    <option value="4">4 Doors</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Q2: BUDGET ===== */}
          <div className="card">
            <div className="card-title-row">
              <span className="q-badge">2</span>
              <span className="card-title">What's Your Budget?</span>
              <span className="card-emoji">💰</span>
            </div>
            <label className="field-label" htmlFor="budget">Enter your total budget</label>
            <div className="prefix-input-wrap">
              <span className="prefix">₹</span>
              <input
                type="text"
                id="budget"
                placeholder="e.g. 2500000"
                value={budget}
                onChange={handleBudgetChange}
              />
            </div>
            <p className="input-hint">💡 Tip: Type digits only — we'll format it for you!</p>
          </div>

          {/* ===== Q3: DURATION ===== */}
          <div className="card">
            <div className="card-title-row">
              <span className="q-badge">3</span>
              <span className="card-title">Project Duration</span>
              <span className="card-emoji">📅</span>
            </div>
            <label className="field-label" htmlFor="duration">How many months for construction?</label>
            <input
              type="number"
              id="duration"
              placeholder="e.g. 12"
              min="1"
              max="120"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <p className="input-hint">🏗️ Average home build takes 6 – 18 months</p>
          </div>

          {/* ===== Q4: RESTRICTED ===== */}
          <div className="card">
            <div className="card-title-row">
              <span className="q-badge">4</span>
              <span className="card-title">Restricted / No-Go Areas</span>
              <span className="card-emoji">🚫</span>
            </div>
            <label className="field-label" htmlFor="restricted">Describe any areas to avoid</label>
            <textarea
              id="restricted"
              rows="3"
              placeholder="e.g. No construction near the old tree, avoid the north garden, keep away from the well…"
              value={restricted}
              onChange={(e) => setRestricted(e.target.value)}
            />
            <p className="input-hint">✏️ Write as many or as few restrictions as you'd like</p>
          </div>

          {/* ===== SUBMIT ===== */}
          <div className="btn-wrap">
            <button type="submit" className="show-plan-btn">
              <span className="btn-icon">✨</span>
              SHOW MY PLAN
              <span className="btn-icon">🏠</span>
            </button>
          </div>

        </form>

        {/* ===== RESULT PANEL ===== */}
        {showPlan && (
          <div className="result-panel">
            <h2>🎉 Your Dream Home Plan!</h2>
            
            {/* 2D Plan Image */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img 
                src={
                  houseSize === 'Small' 
                    ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiYq0nxISL4cavRH6n_6O1Id0LsgBoONx2s31ron-Lqw&s=10' 
                    : houseSize === 'Medium' 
                    ? 'https://www.dkhomedesignx.com/wp-content/uploads/2021/05/TX83-GROUND-FLOOR_page-0001.jpg' 
                    : 'https://wpmedia.roomsketcher.com/content/uploads/2021/12/03123714/two-bedroom-house-plan-with-measurements.jpg'
                } 
                alt={`${houseSize} House Plan`} 
                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '10px', border: '2px solid var(--card-border)', objectFit: 'contain' }} 
              />
            </div>

            <div className="result-grid">
              <div className="result-item">
                <div className="res-label">House Size</div>
                <div className="res-value">{houseSize} ({sqftMap[houseSize]})</div>
              </div>
              <div className="result-item">
                <div className="res-label">Door Faces</div>
                <div className="res-value">{doors.length ? doors.join(', ') : 'None selected'}</div>
              </div>
              <div className="result-item">
                <div className="res-label">Total Doors</div>
                <div className="res-value">{totalDoors} {totalDoors > 1 ? 'doors' : 'door'}</div>
              </div>
              <div className="result-item">
                <div className="res-label">Budget</div>
                <div className="res-value">{budget ? '₹ ' + budget : '—'}</div>
              </div>
              <div className="result-item">
                <div className="res-label">Duration</div>
                <div className="res-value">{duration ? duration + (duration > 1 ? ' months' : ' month') : '—'}</div>
              </div>
              <div className="result-item">
                <div className="res-label">Restricted Areas</div>
                <div className="res-value">{restricted || 'None specified'}</div>
              </div>
            </div>
            <div className="result-note">
              ✅ Plan captured! {tips[houseSize]} Our team will use these details to design your dream home.
            </div>

            {/* Action Buttons */}
            {!show3D && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  onClick={() => setShow3D(true)} 
                  style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff', border: 'none', borderRadius: '60px', padding: '16px 40px', fontWeight: '700', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 8px 32px rgba(34, 197, 94, 0.45)' }}>
                  ✅ YES, Build This House!
                </button>
                <button 
                  type="button"
                  onClick={() => { setShowPlan(false); setShow3D(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', border: 'none', borderRadius: '60px', padding: '16px 40px', fontWeight: '700', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 8px 32px rgba(245, 158, 11, 0.45)' }}>
                  🔄 Change My Answers
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== 3D HOUSE CONTAINER ===== */}
        {show3D && (
          <div id="threeDContainer" className="three-d-container">
            <h2>🏠 Your 3D Dream Home</h2>
            <iframe
              title="3D Dream Home"
              src={
                houseSize === 'Small'
                  ? 'https://sketchfab.com/models/3e536217e25545448762004ec55f1786/embed'
                  : houseSize === 'Medium'
                  ? 'https://sketchfab.com/models/a4cf314ad1f64a1f978f839d3a9f284b/embed'
                  : 'https://sketchfab.com/models/cad05724ba58444587df1ac97b1f1097/embed'
              }
              width="100%"
              height="500"
              frameBorder="0"
              allowFullScreen
              style={{ 
                border: houseColor !== 'transparent' ? `4px solid ${houseColor}` : 'none', 
                borderRadius: '8px', 
                transition: 'all 0.3s ease',
                boxShadow: houseColor !== 'transparent' ? `0 0 30px ${houseColor}40, 0 8px 32px rgba(0,0,0,0.2)` : ''
              }}
            ></iframe>
          </div>
        )}

        {/* ===== HOUSE COLOR CHANGER ===== */}
        {show3D && (
          <div id="colorControls" className="color-theme-container" style={{ marginTop: '20px', textAlign: 'center' }}>
             <h3>🎨 Customize Your House Color!</h3>
             <div className="color-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setHouseColor('#ef4444')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s' }}>🔴 Red</button>
                <button type="button" onClick={() => setHouseColor('#3b82f6')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s' }}>🔵 Blue</button>
                <button type="button" onClick={() => setHouseColor('#10b981')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s' }}>🟢 Green</button>
                <button type="button" onClick={() => setHouseColor('#eab308')} style={{ background: '#eab308', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', textShadow: '0 0 2px rgba(0,0,0,0.5)', transition: 'transform 0.2s' }}>🟡 Yellow</button>
                <button type="button" onClick={() => setHouseColor('#ffffff')} style={{ background: '#ffffff', color: '#333', border: '1px solid #ccc', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s' }}>⚪ White</button>
             </div>
             <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-light)' }}>✨ Color changes the BORDER of your 3D house viewer!</p>
          </div>
        )}

      </main>

      <footer className="footer">
        Made with ❤️ for your family &nbsp;·&nbsp; My Dream Home Planner © 2026
      </footer>

    </div>
  );
}

export default App;