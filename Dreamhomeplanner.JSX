import React, { useState, useEffect, useRef } from 'react';
import './DreamHomePlanner.css';

// ===== STATIC DATA (doesn't change, so it lives outside the component) =====
const FLOOR_NAMES = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];

const PLAN_IMAGES = {
    Small: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiYq0nxISL4cavRH6n_6O1Id0LsgBoONx2s31ron-Lqw&s=10',
    Medium: 'https://www.dkhomedesignx.com/wp-content/uploads/2021/05/TX83-GROUND-FLOOR_page-0001.jpg',
    Big: 'https://wpmedia.roomsketcher.com/content/uploads/2021/12/03123714/two-bedroom-house-plan-with-measurements.jpg',
};

const THREE_D_LINKS = {
    Small: 'https://sketchfab.com/models/3e536217e25545448762004ec55f1786/embed',
    Medium: 'https://sketchfab.com/models/a4cf314ad1f64a1f978f839d3a9f284b/embed',
    Big: 'https://sketchfab.com/models/cad05724ba58444587df1ac97b1f1097/embed',
};

const TIPS = {
    Small: '🏡 Cozy and efficient — easier to maintain and very budget-friendly!',
    Medium: '🏠 A perfect family home — room to grow without the overwhelm!',
    Big: '🏰 Grand living! Allow extra months in your timeline for finishing touches.',
};

// A tiny helper: given square footage, tell us Small / Medium / Big
function getSizeCategory(sqft) {
    if (sqft <= 1000) return 'Small';
    if (sqft <= 2500) return 'Medium';
    return 'Big';
}

// A tiny helper: given square footage, tell us which emoji to show
function getSqftEmoji(sqft) {
    if (sqft <= 1000) return '🏡';
    if (sqft <= 2500) return '🏠';
    return '🏰';
}

export default function DreamHomePlanner() {
    // ===== THEME (light / dark) =====
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const saved = localStorage.getItem('hp_theme') || 'light';
        setTheme(saved);
    }, []);

    function toggleTheme() {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        localStorage.setItem('hp_theme', next);
    }

    // ===== CARD 1: DIMENSIONS, DOORS, FLOORS =====
    const [sqft, setSqft] = useState(1500);
    const [length, setLength] = useState(40);
    const [width, setWidth] = useState(30);

    const [doors, setDoors] = useState({
        North: false,
        South: true,
        East: false,
        West: false,
    });
    const [totalDoors, setTotalDoors] = useState('2');

    const [numFloors, setNumFloors] = useState('1');
    const [floorPlan, setFloorPlan] = useState('Ground Floor');

    // Whenever the number of floors changes, rebuild the floor-plan dropdown
    // options, and make sure the selected one is still valid.
    useEffect(() => {
        const num = parseInt(numFloors, 10);
        const validOptions = FLOOR_NAMES.slice(0, num);
        if (!validOptions.includes(floorPlan)) {
            setFloorPlan(validOptions[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numFloors]);

    function toggleDoor(direction) {
        setDoors((prev) => ({ ...prev, [direction]: !prev[direction] }));
    }

    // ===== CARD 2: BUDGET =====
    const [budget, setBudget] = useState('');

    function handleBudgetChange(e) {
        const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
        setBudget(digitsOnly ? Number(digitsOnly).toLocaleString('en-IN') : '');
    }

    // ===== CARD 3: DURATION =====
    const [duration, setDuration] = useState('');

    // ===== CARD 4: RESTRICTED AREAS =====
    const [restricted, setRestricted] = useState('');

    // ===== RESULT / 3D / COLOR STATE =====
    const [showError, setShowError] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [show3D, setShow3D] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);

    const errorRef = useRef(null);
    const resultRef = useRef(null);
    const threeDRef = useRef(null);

    useEffect(() => {
        if (showError && errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [showError]);

    useEffect(() => {
        if (showResult && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showResult]);

    useEffect(() => {
        if (show3D && threeDRef.current) {
            threeDRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [show3D]);

    const sizeVal = getSizeCategory(sqft);

    function handleSubmit(e) {
        e.preventDefault();

        // ===== VALIDATION =====
        const isValid = sqft > 0 && length > 0 && width > 0 && !!numFloors && !!budget && !!duration;

        if (!isValid) {
            setShowError(true);
            setShowResult(false);
            setShow3D(false);
            return;
        }

        setShowError(false);
        setShowResult(true);
        setShow3D(false);
    }

    function handleConfirm() {
        setShow3D(true);
    }

    function handleChangeAnswers() {
        setShowResult(false);
        setShow3D(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleColorClick(color) {
        setSelectedColor(color);
    }

    function getWrapperStyle() {
        if (!selectedColor) return {};
        if (selectedColor === 'gradient') {
            return {
                borderColor: '#8b5cf6',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(236, 72, 153, 0.3)',
            };
        }
        return {
            borderColor: selectedColor,
            boxShadow: `0 0 30px ${selectedColor}40, 0 8px 32px rgba(0,0,0,0.2)`,
        };
    }

    const checkedDoors = Object.keys(doors).filter((d) => doors[d]);
    const activeFloorOptions = FLOOR_NAMES.slice(0, parseInt(numFloors, 10));

    return (
        <div className="dream-home-planner" data-theme={theme}>
            {/* ===== HEADER ===== */}
            <header>
                <div className="toggle-wrap">
                    <button id="themeToggle" aria-label="Toggle dark mode" onClick={toggleTheme}>
                        <span className="toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>
                <div className="header-inner">
                    <span className="header-emoji">🏠</span>
                    <h1>Click. Connect. Construct. Craft.</h1>
                    <p>Answer 4 quick questions and we'll craft your perfect plan! 🌟</p>
                </div>
            </header>

            <main>
                {/* Error Message */}
                {showError && (
                    <div id="errorMessage" ref={errorRef} style={{ display: 'block' }}>
                        ⚠️ Please fill in ALL the details before seeing your plan!
                    </div>
                )}

                <form id="plannerForm" noValidate onSubmit={handleSubmit}>
                    {/* ====== Q1: House Size + Door Faces + Floors ====== */}
                    <div className="card">
                        <div className="card-title-row">
                            <span className="q-badge">1</span>
                            <span className="card-title">House Dimensions &amp; Size</span>
                            <span className="card-emoji">📐</span>
                        </div>

                        <div className="slider-section">
                            {/* Square Feet Slider */}
                            <div className="slider-group" style={{ paddingBottom: 24 }}>
                                <div className="slider-header" style={{ justifyContent: 'flex-start', gap: 10 }}>
                                    <span style={{ fontSize: '1.2rem' }}>📏</span>
                                    <label className="field-label" htmlFor="sqftSlider" style={{ marginBottom: 0 }}>
                                        Square Feet:
                                    </label>
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
                                    <span className="slider-value" style={{ minWidth: 60, textAlign: 'center' }}>
                                        {sqft.toLocaleString('en-US')} sq ft
                                    </span>
                                </div>

                                <div className="sqft-emoji-container" style={{ marginTop: 15 }}>
                                    <span className="sqft-emoji">{getSqftEmoji(sqft)}</span>
                                </div>

                                <div
                                    className="slider-labels"
                                    style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: 10 }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>Small 🏡</div>
                                        <div style={{ fontWeight: 'normal' }}>0-1000</div>
                                    </div>
                                    <div
                                        style={{
                                            flex: 1,
                                            borderLeft: '1px solid var(--input-border)',
                                            borderRight: '1px solid var(--input-border)',
                                        }}
                                    >
                                        <div style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>Medium 🏠</div>
                                        <div style={{ fontWeight: 'normal' }}>1001-2500</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>Big 🏰</div>
                                        <div style={{ fontWeight: 'normal' }}>2501+</div>
                                    </div>
                                </div>
                            </div>

                            {/* Length + Width Sliders */}
                            <div className="slider-group">
                                <div className="slider-header" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 20 }}>
                                    <span style={{ fontSize: '1.2rem' }}>📏</span>
                                    <label className="field-label" htmlFor="lengthSlider" style={{ marginBottom: 0, width: 60 }}>
                                        Length:
                                    </label>
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
                                    <span className="slider-value" style={{ minWidth: 50, textAlign: 'right' }}>
                                        {length} ft
                                    </span>
                                </div>

                                <div className="slider-header" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 0 }}>
                                    <span style={{ fontSize: '1.2rem' }}>📏</span>
                                    <label className="field-label" htmlFor="widthSlider" style={{ marginBottom: 0, width: 60 }}>
                                        Width:
                                    </label>
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
                                    <span className="slider-value" style={{ minWidth: 50, textAlign: 'right' }}>
                                        {width} ft
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Doors */}
                        <div className="doors-section">
                            <p className="doors-section-title">🚪 Select which faces are empty</p>
                            <div className="compass-grid">
                                {[
                                    { dir: 'North', icon: '⬆️' },
                                    { dir: 'South', icon: '⬇️' },
                                    { dir: 'East', icon: '➡️' },
                                    { dir: 'West', icon: '⬅️' },
                                ].map(({ dir, icon }) => (
                                    <label
                                        key={dir}
                                        className={`door-option${doors[dir] ? ' checked' : ''}`}
                                        htmlFor={`door${dir}`}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`door${dir}`}
                                            name="doors"
                                            value={dir}
                                            checked={doors[dir]}
                                            onChange={() => toggleDoor(dir)}
                                        />
                                        <span className="door-dir-icon">{icon}</span>
                                        <span className="door-dir-name">{dir}</span>
                                    </label>
                                ))}
                            </div>

                            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 15 }}>
                                <p className="doors-section-title" style={{ marginBottom: 0 }}>
                                    🚪 Total Doors:
                                </p>
                                <div className="select-wrap" style={{ flex: 1 }}>
                                    <select
                                        id="totalDoors"
                                        name="totalDoors"
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

                        {/* Floors */}
                        <div className="floors-section" style={{ marginTop: 20 }}>
                            <p className="doors-section-title" style={{ marginBottom: 15, fontSize: '1.05rem' }}>
                                🏗️ Floors &amp; Levels
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
                                <label className="field-label" style={{ marginBottom: 0 }}>
                                    Number of Floors:
                                </label>
                                <div className="floor-buttons" style={{ flex: 1 }}>
                                    {['1', '2', '3', '4'].map((n) => (
                                        <React.Fragment key={n}>
                                            <input
                                                type="radio"
                                                name="numFloors"
                                                id={`floor${n}`}
                                                value={n}
                                                checked={numFloors === n}
                                                onChange={(e) => setNumFloors(e.target.value)}
                                            />
                                            <label htmlFor={`floor${n}`}>{n}</label>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                <label className="field-label" htmlFor="floorPlanSelect" style={{ marginBottom: 0 }}>
                                    Select Floor:
                                </label>
                                <div className="select-wrap" style={{ flex: 1 }}>
                                    <select
                                        id="floorPlanSelect"
                                        name="floorPlanSelect"
                                        value={floorPlan}
                                        onChange={(e) => setFloorPlan(e.target.value)}
                                    >
                                        {activeFloorOptions.map((name) => (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ====== Q2: Budget ====== */}
                    <div className="card">
                        <div className="card-title-row">
                            <span className="q-badge">2</span>
                            <span className="card-title">What's Your Budget?</span>
                            <span className="card-emoji">💰</span>
                        </div>
                        <label className="field-label" htmlFor="budget">
                            Enter your total budget
                        </label>
                        <div className="prefix-input-wrap">
                            <span className="prefix">₹</span>
                            <input
                                type="text"
                                id="budget"
                                name="budget"
                                placeholder="e.g. 2500000"
                                inputMode="numeric"
                                value={budget}
                                onChange={handleBudgetChange}
                            />
                        </div>
                        <p className="input-hint">💡 Tip: Type digits only — we'll format it for you!</p>
                    </div>

                    {/* ====== Q3: Project Duration ====== */}
                    <div className="card">
                        <div className="card-title-row">
                            <span className="q-badge">3</span>
                            <span className="card-title">Project Duration</span>
                            <span className="card-emoji">📅</span>
                        </div>
                        <label className="field-label" htmlFor="duration">
                            How many months for construction?
                        </label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            placeholder="e.g. 12"
                            min="1"
                            max="120"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                        <p className="input-hint">🏗️ Average home build takes 6 – 18 months</p>
                    </div>

                    {/* ====== Q4: Restricted Areas ====== */}
                    <div className="card">
                        <div className="card-title-row">
                            <span className="q-badge">4</span>
                            <span className="card-title">Restricted / No-Go Areas</span>
                            <span className="card-emoji">🚫</span>
                        </div>
                        <label className="field-label" htmlFor="restricted">
                            Describe any areas to avoid
                        </label>
                        <textarea
                            id="restricted"
                            name="restricted"
                            rows="3"
                            placeholder="e.g. No construction near the old tree..."
                            value={restricted}
                            onChange={(e) => setRestricted(e.target.value)}
                        />
                        <p className="input-hint">✏️ Write as many or as few restrictions as you'd like</p>
                    </div>

                    {/* ====== SUBMIT ====== */}
                    <div className="btn-wrap">
                        <button type="submit" id="showPlanBtn">
                            <span className="btn-icon">✨</span>
                            SHOW MY PLAN
                            <span className="btn-icon">🏠</span>
                        </button>
                    </div>
                </form>

                {/* ====== RESULT PANEL (2D PLAN) ====== */}
                {showResult && (
                    <div id="resultPanel" ref={resultRef} role="region" aria-live="polite" style={{ display: 'block' }}>
                        <h2>📐 Your 2D House Plan</h2>

                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <img
                                src={PLAN_IMAGES[sizeVal]}
                                alt="House Plan"
                                style={{ maxWidth: '100%', borderRadius: 'var(--radius-sm)', border: '2px solid var(--card-border)' }}
                            />
                        </div>

                        <div className="result-grid">
                            {[
                                { label: 'Square Feet', value: `${sqft.toLocaleString('en-US')} sq ft` },
                                { label: 'Dimensions', value: `${length} ft (L) × ${width} ft (W)` },
                                { label: 'Floors', value: `${numFloors} (Plan: ${floorPlan})` },
                                { label: 'Door Faces', value: checkedDoors.length ? checkedDoors.join(', ') : 'None selected' },
                                { label: 'Total Doors', value: `${totalDoors} ${totalDoors > 1 ? 'doors' : 'door'}` },
                                { label: 'Budget', value: `₹ ${budget}` },
                                { label: 'Duration', value: `${duration} ${duration > 1 ? 'months' : 'month'}` },
                                { label: 'Restricted Areas', value: restricted.trim() || 'None specified' },
                            ].map((item) => (
                                <div className="result-item" key={item.label}>
                                    <div className="res-label">{item.label}</div>
                                    <div className="res-value">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="result-note">✅ Plan captured! {TIPS[sizeVal]}</div>

                        <div className="btn-group">
                            <button className="confirm-btn" onClick={handleConfirm}>
                                ✅ YES, Build This House!
                            </button>
                            <button className="change-btn" onClick={handleChangeAnswers}>
                                🔄 Change My Answers
                            </button>
                        </div>
                    </div>
                )}

                {/* ====== 3D HOUSE SECTION ====== */}
                {show3D && (
                    <div id="threeDContainer" ref={threeDRef} style={{ display: 'block' }}>
                        <h3>🏠 Your 3D Dream Home</h3>
                        <div className="three-d-wrapper" style={getWrapperStyle()}>
                            <iframe
                                title="3D House Model"
                                src={THREE_D_LINKS[sizeVal]}
                                width="100%"
                                height="500"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>

                        <div id="colorControls" style={{ display: 'block' }}>
                            <h4>🎨 Customize Your House Color!</h4>
                            <div className="color-btn-wrap">
                                <button className="color-btn" style={{ background: '#ef4444' }} onClick={() => handleColorClick('#ef4444')}>
                                    🔴 Red
                                </button>
                                <button className="color-btn" style={{ background: '#3b82f6' }} onClick={() => handleColorClick('#3b82f6')}>
                                    🔵 Blue
                                </button>
                                <button className="color-btn" style={{ background: '#22c55e' }} onClick={() => handleColorClick('#22c55e')}>
                                    🟢 Green
                                </button>
                                <button className="color-btn" style={{ background: '#eab308' }} onClick={() => handleColorClick('#eab308')}>
                                    🟡 Yellow
                                </button>
                                <button
                                    className="color-btn"
                                    style={{ background: '#f3f4f6', color: '#333' }}
                                    onClick={() => handleColorClick('#f3f4f6')}
                                >
                                    ⚪ White
                                </button>
                                <button
                                    className="color-btn"
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
                                    onClick={() => handleColorClick('gradient')}
                                >
                                    🌈 Rainbow
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer>Made with ❤️ for your family &nbsp;·&nbsp; My Dream Home Planner © 2026</footer>
        </div>
    );
}