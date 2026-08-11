import React, { useState } from 'react';
import './App.css';

function App() {
  // ===== STATE ===== (This stores all user answers)
  // OLD: const [houseSize, setHouseSize] = useState('Medium');
  // NEW: house size now comes from three sliders instead of a radio pick
  const [sqft, setSqft] = useState(1500);
  const [length, setLength] = useState(40);
  const [width, setWidth] = useState(30);

  const [doors, setDoors] = useState(['South']);
  const [totalDoors, setTotalDoors] = useState('2');

  // NEW: floors
  const [numFloors, setNumFloors] = useState('1');
  const [floorPlan, setFloorPlan] = useState('Ground Floor');

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

  // ===== FLOORS: names available for the dropdown =====
  const floorNames = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];

  // When the number of floors changes, reset the floor-plan dropdown
  // back to "Ground Floor" so it never points at a floor that no longer exists.
  const handleNumFloorsChange = (value) => {
    setNumFloors(value);
    setFloorPlan(floorNames[0]);
  };

  const activeFloorOptions = floorNames.slice(0, parseInt(numFloors, 10));

  // ===== HOUSE SIZE (derived from square feet, not chosen directly anymore) =====
  const getSizeCategory = (value) => {
    if (value <= 1000) return 'Small';
    if (value <= 2500) return 'Medium';
    return 'Big';
  };
  const getSqftEmoji = (value) => {
    if (value <= 1000) return '🏡';
    if (value <= 2500) return '🏠';
    return '🏰';
  };
  const houseSize = getSizeCategory(sqft);

  // ===== SHOW PLAN =====
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check required fields: sqft, length, width, numFloors, budget, duration
    if (sqft <= 0 || length <= 0 || width <= 0 || !numFloors || !budget || !duration) {
      setShowTopError(true);
      setShowPlan(false);
      return;
    }

    setShowTopError(false);
    setShowPlan(true);
    setShow3D(false);
  };

  const doorDirections = [
    { value: 'North', icon: '⬆️' },
    { value: 'South', icon: '⬇️' },
    { value: 'East', icon: '➡️' },
    { value: 'West', icon: '⬅️' },
  ];

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

          {/* ===== Q1: HOUSE DIMENSIONS, DOORS & FLOORS ===== */}
          <div className="card">
            <div className="card-title-row">
              <span className="q-badge">1</span>
              <span className="card-title">House Dimensions &amp; Size</span>
              <span className="card-emoji">📐</span>
            </div>

            {/* ---- SQUARE FEET SLIDER ---- */}
            <div className="slider-group" style={{ paddingBottom: '24px' }}>
              <div className="slider-header" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>📏</span>
                <label className="field-label" htmlFor="sqftSlider" style={{ marginBottom: 0 }}>Square Feet:</label>
                <input
                  type="range"
                  id="sqftSlider"
                  className="custom-slider"
                  min="0"
                  max="5000"
                  step="10"
                  value={sqft}
                  onChange={(e) => setSqft(parseInt(e.target.value, 10))}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <span className="slider-value" style={{ minWidth: '70px', textAlign: 'center' }}>
                  {sqft.toLocaleString('en-US')} sq ft
                </span>
              </div>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '3rem' }}>{getSqftEmoji(sqft)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.1rem' }}>Small 🏡</div>
                  <div style={{ fontWeight: 'normal', fontSize: '0.8rem' }}>0-1000</div>
                </div>
                <div style={{ flex: 1, borderLeft: '1px solid var(--input-border)', borderRight: '1px solid var(--input-border)' }}>
                  <div style={{ fontSize: '1.1rem' }}>Medium 🏠</div>
                  <div style={{ fontWeight: 'normal', fontSize: '0.8rem' }}>1001-2500</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.1rem' }}>Big 🏰</div>
                  <div style={{ fontWeight: 'normal', fontSize: '0.8rem' }}>2501+</div>
                </div>
              </div>
            </div>

            {/* ---- LENGTH + WIDTH SLIDERS ---- */}
            <div className="slider-group">
              <div className="slider-header" style={{ justifyContent: 'flex-start', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.2rem' }}>📏</span>
                <label className="field-label" htmlFor="lengthSlider" style={{ marginBottom: 0, width: '60px' }}>Length:</label>
                <input
                  type="range"
                  id="lengthSlider"
                  className="custom-slider"
                  min="0"
                  max="100"
                  step="1"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value, 10))}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <span className="slider-value" style={{ minWidth: '50px', textAlign: 'right' }}>{length} ft</span>
              </div>

              <div className="slider-header" style={{ justifyContent: 'flex-start', gap: '10px', marginBottom: 0 }}>
                <span style={{ fontSize: '1.2rem' }}>📏</span>
                <label className="field-label" htmlFor="widthSlider" style={{ marginBottom: 0, width: '60px' }}>Width:</label>
                <input
                  type="range"
                  id="widthSlider"
                  className="custom-slider"
                  min="0"
                  max="100"
                  step="1"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <span className="slider-value" style={{ minWidth: '50px', textAlign: 'right' }}>{width} ft</span>
              </div>
            </div>

            {/* DOORS SECTION (unchanged from before) */}
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

            {/* ---- FLOORS SECTION (new) ---- */}
            <div className="doors-section" style={{ marginTop: '20px' }}>
              <p className="doors-section-title">🏗️ Floors &amp; Levels</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Number of Floors:</label>
                <div className="floor-buttons" style={{ flex: 1, display: 'flex', gap: '10px' }}>
                  {['1', '2', '3', '4'].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => handleNumFloorsChange(n)}
                      className={numFloors === n ? 'floor-btn active' : 'floor-btn'}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <label className="field-label" htmlFor="floorPlanSelect" style={{ marginBottom: 0 }}>Select Floor:</label>
                <div className="select-wrap" style={{ flex: 1 }}>
                  <select
                    id="floorPlanSelect"
                    value={floorPlan}
                    onChange={(e) => setFloorPlan(e.target.value)}
                  >
                    {activeFloorOptions.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Q2: BUDGET (unchanged) ===== */}
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

          {/* ===== Q3: DURATION (unchanged) ===== */}
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

          {/* ===== Q4: RESTRICTED (unchanged) ===== */}
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
                <div className="res-label">Square Feet</div>
                <div className="res-value">{sqft.toLocaleString('en-US')} sq ft ({houseSize})</div>
              </div>
              <div className="result-item">
                <div className="res-label">Dimensions</div>
                <div className="res-value">{length} ft (L) × {width} ft (W)</div>
              </div>
              <div className="result-item">
                <div className="res-label">Floors</div>
                <div className="res-value">{numFloors} (Plan: {floorPlan})</div>
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

        {/* ===== 3D HOUSE CONTAINER (unchanged) ===== */}
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

        {/* ===== HOUSE COLOR CHANGER (unchanged) ===== */}
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