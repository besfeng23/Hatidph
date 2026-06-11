import { useEffect, useMemo, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { DriverCard } from './components/DriverCard';
import { PhoneShell } from './components/PhoneShell';
import { RouteMap } from './components/RouteMap';
import { SafetyModal } from './components/SafetyModal';
import { driver, places, popularDestinations, rideOptions, serviceStatus } from './lib/mockData';
import { stageIndex, tripStageLabels, tripTimeline, type TripStage } from './lib/tripState';

export type Screen =
  | 'splash'
  | 'login'
  | 'otp'
  | 'profile'
  | 'permissions'
  | 'home'
  | 'search'
  | 'choose'
  | 'activeTrip'
  | 'completed'
  | 'receipt'
  | 'trips'
  | 'balance'
  | 'safety'
  | 'account'
  | 'trustedContacts'
  | 'shareTrip'
  | 'reportIssue'
  | 'driverVerification'
  | 'terms'
  | 'safetyGuide';

const stateCopy: Record<TripStage, { title: string; detail: string; cta: string }> = {
  idle: { title: 'Ready to book', detail: 'Choose a ride to begin the Makati/BGC pilot simulation.', cta: 'Start search' },
  searching: { title: 'Searching for nearby drivers', detail: 'Checking verified drivers around Salcedo, Ayala Ave, and BGC.', cta: 'Assign driver' },
  assigned: { title: 'Driver assigned', detail: `${driver.name} accepted your booking and is confirming plate match.`, cta: 'Driver arriving' },
  arriving: { title: 'Driver arriving', detail: `${driver.name} is ${driver.distance}. Keep your Ride PIN ready.`, cta: 'Driver arrived' },
  arrived: { title: 'Driver arrived', detail: 'Meet your driver at Salcedo Village entrance. Confirm the plate before boarding.', cta: 'Start trip' },
  in_trip: { title: 'In trip', detail: 'Live route is shared with trusted contacts. Destination: BGC High Street.', cta: 'Complete trip' },
  completed: { title: 'Trip completed', detail: 'You arrived safely. Review your receipt and rate the trip.', cta: 'View receipt' },
  cancelled: { title: 'Trip cancelled', detail: 'No charge in this prototype. Cancellation reasons are captured for operations.', cta: 'Book again' },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRide, setSelectedRide] = useState(rideOptions[0]);
  const [tripStage, setTripStage] = useState<TripStage>('idle');
  const [modal, setModal] = useState<{ title: string; message: string } | null>(null);
  const [rating, setRating] = useState(0);

  const go = (next: Screen) => setScreen(next);
  const open = (title: string, message: string) => setModal({ title, message });

  const normalizedPhone = useMemo(() => normalizePhone(phone), [phone]);
  const phoneValid = /^9\d{9}$/.test(normalizedPhone);
  const otpValid = /^\d{6}$/.test(otp);

  useEffect(() => {
    if (screen !== 'activeTrip') return;
    if (!['searching', 'assigned', 'arriving'].includes(tripStage)) return;
    const chain: Partial<Record<TripStage, TripStage>> = { searching: 'assigned', assigned: 'arriving', arriving: 'arrived' };
    const timer = window.setTimeout(() => setTripStage(chain[tripStage] ?? tripStage), 2200);
    return () => window.clearTimeout(timer);
  }, [screen, tripStage]);

  function beginTrip() {
    setTripStage('searching');
    go('activeTrip');
  }

  function nextTripStep() {
    if (tripStage === 'completed') return go('completed');
    if (tripStage === 'cancelled') return go('choose');
    if (tripStage === 'arrived') return setTripStage('in_trip');
    if (tripStage === 'in_trip') {
      setTripStage('completed');
      return go('completed');
    }
    const next = tripTimeline[stageIndex(tripStage) + 1];
    if (next) setTripStage(next);
  }

  function cancelTrip() {
    setTripStage('cancelled');
    open('Trip cancelled', 'Demo cancellation captured. In production this would collect cancellation reason, pricing rules, and support escalation when needed.');
  }

  return (
    <PhoneShell>
      {screen === 'splash' && <Splash go={go} />}
      {screen === 'login' && <Login go={go} phone={phone} setPhone={setPhone} phoneValid={phoneValid} />}
      {screen === 'otp' && <Otp go={go} otp={otp} setOtp={setOtp} valid={otpValid} phone={normalizedPhone} />}
      {screen === 'profile' && <Profile go={go} />}
      {screen === 'permissions' && <Permissions go={go} />}
      {screen === 'home' && <Home go={go} open={open} />}
      {screen === 'search' && <Search go={go} />}
      {screen === 'choose' && <ChooseRide go={go} selectedRide={selectedRide} setSelectedRide={setSelectedRide} beginTrip={beginTrip} />}
      {screen === 'activeTrip' && <ActiveTrip go={go} open={open} tripStage={tripStage} selectedRide={selectedRide} nextTripStep={nextTripStep} cancelTrip={cancelTrip} />}
      {screen === 'completed' && <Completed go={go} rating={rating} setRating={setRating} />}
      {screen === 'receipt' && <Receipt go={go} open={open} selectedRide={selectedRide} />}
      {screen === 'trips' && <Trips go={go} />}
      {screen === 'balance' && <Balance open={open} />}
      {screen === 'safety' && <Safety go={go} open={open} />}
      {screen === 'account' && <Account go={go} open={open} />}
      {screen === 'trustedContacts' && <TrustedContacts go={go} />}
      {screen === 'shareTrip' && <ShareTrip go={go} />}
      {screen === 'reportIssue' && <ReportIssue go={go} />}
      {screen === 'driverVerification' && <DriverVerification go={go} />}
      {screen === 'terms' && <Terms go={go} />}
      {screen === 'safetyGuide' && <SafetyGuide go={go} />}
      <BottomNav current={screen} go={go} />
      {modal && <SafetyModal title={modal.title} message={modal.message} close={() => setModal(null)} />}
    </PhoneShell>
  );
}

function Splash({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen splash active"><div className="ph-outline">PH</div><div className="splash-logo"><strong>Hatid</strong><span>Biyahe natin. Bansa natin.</span></div><div className="splash-card elevated"><p className="eyebrow">Makati/BGC pilot ready</p><h1>Reliable rides for everyday Filipinos.</h1><p>Book cars, motos, XL rides, and padala in one trusted app built for Philippine roads.</p><div className="badge-row"><span>Verified drivers</span><span>Live trip sharing</span><span>GCash • Maya • Cash</span></div><button className="primary" onClick={() => go('login')}>Get Started</button></div></section>;
}

function Login({ go, phone, setPhone, phoneValid }: { go: (screen: Screen) => void; phone: string; setPhone: (value: string) => void; phoneValid: boolean }) {
  return <section className="screen auth active"><button className="ghost back" onClick={() => go('splash')}>←</button><h1>Enter your mobile number</h1><p>Use a Philippine mobile number. We accept 09XXXXXXXXX or 9XXXXXXXXX.</p><label className="phone-field"><span>🇵🇭 +63</span><input inputMode="numeric" autoComplete="tel" placeholder="9XX XXX XXXX" value={formatPhone(normalizePhone(phone))} onChange={(event) => setPhone(event.target.value)} /></label><p className={phone && !phoneValid ? 'hint error' : 'hint'}>{phone && !phoneValid ? 'Enter a valid PH mobile number starting with 9.' : 'Protected by Hatid Safety • PH mobile only • Data Privacy compliant'}</p><div className="trust-strip"><span>LTFRB-aware</span><span>Verified drivers</span><span>Emergency contacts</span></div><button className="primary bottom" disabled={!phoneValid} onClick={() => go('otp')}>Continue</button></section>;
}

function Otp({ go, otp, setOtp, valid, phone }: { go: (screen: Screen) => void; otp: string; setOtp: (value: string) => void; valid: boolean; phone: string }) {
  return <section className="screen auth active"><button className="ghost back" onClick={() => go('login')}>←</button><h1>Verify number</h1><p>Enter the 6-digit demo code sent to <strong>+63 {formatPhone(phone)}</strong>. Use any 6 digits.</p><input className="otp" maxLength={6} inputMode="numeric" placeholder="------" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} /><div className="otp-row"><button className="link" onClick={() => go('login')}>Change number</button><span>Resend in 30s</span></div><button className="primary bottom" disabled={!valid} onClick={() => go('profile')}>Verify & Continue</button></section>;
}

function Profile({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen auth active"><h1>Set up profile</h1><p>Enough for demo, structured for real onboarding later.</p><label className="field">Full name<input placeholder="Maria Santos" /></label><label className="field">Birthday<input type="date" /></label><label className="field">Email optional<input type="email" placeholder="maria@email.com" /></label><label className="checkline"><input type="checkbox" defaultChecked /> I agree to Hatid's Terms, Privacy Policy, and safety reminders.</label><button className="primary bottom" onClick={() => go('permissions')}>Save Profile</button></section>;
}

function Permissions({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen auth active"><div className="wordmark blue">Hatid</div><h1>Let's keep every ride safe.</h1><p>You can change permissions anytime in settings.</p><div className="permission-card"><b>📍 Location</b><span>Used only for booking, pickup routing, and active trips.</span></div><div className="permission-card"><b>🔔 Notifications</b><span>Driver arrival, safety alerts, receipts, and trusted contact updates.</span></div><button className="primary bottom" onClick={() => go('home')}>Allow Required Permissions</button></section>;
}

function Home({ go, open }: { go: (screen: Screen) => void; open: (title: string, message: string) => void }) {
  return <section className="screen app-screen active"><Topbar title="Hi, Maria" subtitle="Makati City" action={() => open('Notifications', 'Production will connect push notifications for driver arrival, receipts, and trusted contact alerts.')} /><div className="content scroll"><div className="live-card"><span>42 drivers nearby in Makati</span><b>Average pickup: 3 min</b></div><div className="mini-map" onClick={() => go('choose')}><RouteMap stage="idle" compact /><div><b>Pickup accuracy: High</b><span>Salcedo Village entrance • 18 drivers available</span></div></div><h1>Saan ang punta?</h1><button className="search-box" onClick={() => go('search')}><span>🔎 Where to?</span><em>Now</em></button><div className="status-grid">{serviceStatus.map(([name, status, count]) => <div key={name}><b>{name}</b><span>{status}</span><small>{count}</small></div>)}</div><div className="promo">Airport rides available • NAIA Terminal 3 pilot route</div><button className="balance-card" onClick={() => go('balance')}><span>Hatid Balance</span><b>₱1,250.00</b><small>Ride credits linked to GCash, Maya, Cash</small></button><h3>Saved places</h3><div className="quick-grid"><button onClick={() => go('choose')}>🏠 Home</button><button onClick={() => go('choose')}>💼 Work</button><button onClick={() => open('Saved places', 'Saved place creation is ready as a placeholder flow.')}>＋ Add place</button></div><h3>Recent trip</h3><button className="list-row" onClick={() => go('receipt')}><b>Salcedo Village → Ayala Triangle</b><small>Completed • ₱212.00 • Rebook available</small></button></div></section>;
}

function Search({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen app-screen active"><Topbar title="Set destination" back={() => go('home')} /><div className="content scroll"><div className="route-inputs"><input value={`Current Location • ${places.pickup}`} readOnly /><input placeholder="Where to?" autoFocus /></div><h3>Popular destinations</h3>{popularDestinations.map(([name, detail]) => <button key={name} className="list-row" onClick={() => go('choose')}><b>{name}</b><small>{detail}</small></button>)}</div></section>;
}

function ChooseRide({ go, selectedRide, setSelectedRide, beginTrip }: { go: (screen: Screen) => void; selectedRide: (typeof rideOptions)[number]; setSelectedRide: (ride: (typeof rideOptions)[number]) => void; beginTrip: () => void }) {
  return <section className="screen app-screen map-screen active"><div className="map-panel"><button className="map-back" onClick={() => go('search')}>←</button><RouteMap stage="idle" /></div><div className="sheet"><div className="handle" /><p className="eyebrow">Makati to BGC • 7.2 km • ETA 18 min</p><div className="fare-intel"><div><b>Pickup</b><span>3 min • high accuracy</span></div><div><b>Dropoff</b><span>18 min • light traffic</span></div><div><b>Policy</b><span>Free cancel before driver arrives</span></div></div>{rideOptions.map((ride) => <button key={ride.id} className={selectedRide.id === ride.id ? 'ride-option-v2 selected' : 'ride-option-v2'} onClick={() => setSelectedRide(ride)}><span className="ride-icon">{ride.icon}</span><span className="ride-copy"><b>{ride.label}</b><small>{ride.eta} • {ride.trip}</small><em>{ride.note}</em></span><span className="ride-price"><b>{ride.fare}</b><small>{ride.available}</small></span></button>)}<div className="payline"><span>Payment</span><b>Hatid Balance + GCash backup</b></div><div className="payline"><span>Promo</span><b>MAKATI40 applied</b></div><button className="primary" onClick={beginTrip}>Confirm {selectedRide.label.replace('Hatid ', '')}</button></div></section>;
}

function ActiveTrip({ go, open, tripStage, selectedRide, nextTripStep, cancelTrip }: { go: (screen: Screen) => void; open: (title: string, message: string) => void; tripStage: TripStage; selectedRide: (typeof rideOptions)[number]; nextTripStep: () => void; cancelTrip: () => void }) {
  const copy = stateCopy[tripStage];
  return <section className="screen app-screen map-screen active"><div className="status-card elevated"><b>{copy.title}</b><span>{tripStageLabels[tripStage]}</span><small>{copy.detail}</small></div><div className="map-panel full"><RouteMap stage={tripStage} /></div><div className="sheet compact emotional"><div className="progress-rail">{tripTimeline.map((stage) => <span key={stage} className={stageIndex(stage) <= stageIndex(tripStage) ? 'done' : ''} />)}</div><div className="trip-stage"><b>{copy.title}</b><span>{copy.detail}</span></div><DriverCard compact /><div className="pin"><span>Your Ride PIN</span><b>4821</b></div><div className="actions"><button onClick={() => go('shareTrip')}>Share Trip</button><button onClick={() => open('Message driver', 'Production will open masked in-app chat/call with safety logging.')}>Message</button><button className="danger" onClick={() => open('Emergency SOS confirmation', 'Demo mode only. Production will confirm before emergency actions and notify trusted contacts when requested.')}>Emergency</button></div><div className="split-actions"><button className="secondary" onClick={cancelTrip}>Cancel ride</button><button className="primary" onClick={nextTripStep}>{copy.cta}</button></div><button className="link center" onClick={() => go('driverVerification')}>View driver verification</button><small className="microcopy">{selectedRide.label} • {selectedRide.fare} • Trip PIN required before boarding.</small></div></section>;
}

function Completed({ go, rating, setRating }: { go: (screen: Screen) => void; rating: number; setRating: (value: number) => void }) {
  return <section className="screen auth completed active"><div className="success">✓</div><h1>You've arrived.</h1><p>Rate Juan and help keep Hatid safe.</p><DriverCard compact /><div className="stars">{[1, 2, 3, 4, 5].map((star) => <button key={star} onClick={() => setRating(star)}>{star <= rating ? '★' : '☆'}</button>)}</div>{rating > 0 && <div className="chip-grid"><button>Clean car</button><button>Safe driving</button><button>Polite driver</button><button>Fast pickup</button><button>Wrong route</button><button>Unsafe driving</button></div>}<button className="primary" onClick={() => go('receipt')}>View receipt</button><button className="secondary" onClick={() => go('reportIssue')}>Report issue</button></section>;
}

function Receipt({ go, open, selectedRide }: { go: (screen: Screen) => void; open: (title: string, message: string) => void; selectedRide: (typeof rideOptions)[number] }) {
  return <section className="screen app-screen active"><Topbar title="Trip receipt" back={() => go('home')} /><div className="content scroll"><div className="receipt elevated"><p>Total paid</p><h2>₱212.00</h2><small>June 11, 2026 • HTD-98213-AB29</small><hr /><div><span>Base fare</span><b>₱80.00</b></div><div><span>Distance 7.2 km</span><b>₱132.00</b></div><div><span>Promo MAKATI40</span><b>-₱40.00</b></div><div><span>Prototype fare adjustment</span><b>₱40.00</b></div><hr /><div><span>Ride type</span><b>{selectedRide.label}</b></div><div><span>Driver</span><b>{driver.name}</b></div><div><span>Route</span><b>Salcedo → BGC High Street</b></div><div><span>Payment</span><b>Hatid Balance / GCash backup</b></div></div><button className="secondary" onClick={() => open('Download receipt', 'Production will create a PDF receipt and email copy.')}>Download / Share receipt</button><button className="secondary" onClick={() => go('reportIssue')}>Report issue</button></div></section>;
}

function Trips({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen app-screen active"><Topbar title="Your trips" /><div className="content scroll"><div className="filters"><button className="active">All</button><button>Ride</button><button>Moto</button><button>Padala</button><button>Cancelled</button></div><div className="trip-card"><b>Hatid Car</b><span>Completed • ₱212.00</span><small>Salcedo Village → BGC High Street</small><button onClick={() => go('receipt')}>View receipt</button></div><div className="trip-card"><b>Scheduled Airport Ride</b><span>Upcoming • Tomorrow 7:30 AM</span><small>Makati → NAIA Terminal 3</small><button onClick={() => go('choose')}>Review quote</button></div><div className="empty-card"><b>Cancelled trips</b><span>No cancelled rides this week.</span></div></div></section>;
}

function Balance({ open }: { open: (title: string, message: string) => void }) {
  return <section className="screen app-screen active"><Topbar title="Hatid Balance" /><div className="content scroll"><div className="balance-hero"><small>Transport credits</small><h2>₱1,250.00</h2><p>Not an e-money wallet. Used only for Hatid rides unless partnered with licensed providers.</p><div><button onClick={() => open('Add ride credits', 'Production will connect GCash, Maya, and approved cash-in partners.')}>Add ride credits</button><button disabled>Send disabled</button></div></div><h3>Payment methods</h3><div className="method"><b>GCash</b><span>Linked backup</span></div><div className="method"><b>Maya</b><span>Coming soon</span></div><div className="method"><b>Cash</b><span>Accepted</span></div><p className="note">Powered by licensed payment partners only when integrations are active. Peer transfer remains disabled until compliance review.</p></div></section>;
}

function Safety({ go, open }: { go: (screen: Screen) => void; open: (title: string, message: string) => void }) {
  return <section className="screen app-screen active"><Topbar title="Safety Center" /><div className="content scroll"><div className="sos-card"><h2>Emergency SOS</h2><p>Demo only — no emergency call will be placed. Production requires confirmation before any emergency action.</p><button className="danger" onClick={() => open('Emergency SOS confirmation', 'Demo mode only. Production will confirm, notify trusted contacts, and attach trip context to support.')}>Open SOS confirmation</button></div><button className="list-row" onClick={() => go('trustedContacts')}><b>Trusted contacts</b><small>Set up family or friends for live trip links</small></button><button className="list-row" onClick={() => go('shareTrip')}><b>Share live trip preview</b><small>Preview what contacts receive</small></button><button className="list-row" onClick={() => go('reportIssue')}><b>Report issue</b><small>Safety, route, payment, or driver concern</small></button><button className="list-row" onClick={() => go('driverVerification')}><b>Driver verification</b><small>Plate match, PIN, LTFRB-aware profile</small></button><button className="list-row" onClick={() => go('safetyGuide')}><b>Passenger safety guidelines</b><small>Before boarding, during trip, after arrival</small></button></div></section>;
}

function Account({ go, open }: { go: (screen: Screen) => void; open: (title: string, message: string) => void }) {
  return <section className="screen app-screen active"><Topbar title="Account" /><div className="content scroll"><div className="profile-card"><div className="driver-photo-v2">MS</div><div><h2>Maria Santos</h2><p>+63 968 184 1001</p><span>KYC Verified</span></div></div><button className="list-row" onClick={() => open('Edit profile', 'Edit profile flow placeholder.')}>Edit profile</button><button className="list-row" onClick={() => go('trustedContacts')}>Trusted contacts</button><button className="list-row" onClick={() => go('terms')}>Terms & Privacy</button><button className="list-row" onClick={() => open('Delete account', 'Production will require identity confirmation and data retention notice.')}>Delete account</button><button className="list-row" onClick={() => open('App version', 'Hatid preview v0.4.0 operational pilot simulation.')}>App version</button></div></section>;
}

function TrustedContacts({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen app-screen active"><Topbar title="Trusted contacts" back={() => go('safety')} /><div className="content scroll"><p className="note">Contacts receive trip links only when you choose to share or trigger SOS.</p><div className="contact-card"><b>Mom</b><span>+63 917 000 4100</span><em>Live trip sharing enabled</em></div><div className="contact-card"><b>Brother</b><span>+63 918 555 2200</span><em>SOS alerts enabled</em></div><button className="primary">Add trusted contact</button></div></section>;
}

function ShareTrip({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen app-screen active"><Topbar title="Share live trip" back={() => go('activeTrip')} /><div className="content scroll"><RouteMap stage="arriving" compact /><div className="share-card"><b>Live trip preview</b><span>Maria is riding with Juan Dela Cruz in Toyota Vios ABC-1234.</span><small>Pickup: Salcedo Village • Dropoff: BGC High Street • ETA 18 min</small></div><button className="primary">Generate secure trip link</button><button className="secondary">Send to trusted contacts</button></div></section>;
}

function ReportIssue({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen app-screen active"><Topbar title="Report issue" back={() => go('safety')} /><div className="content scroll"><p className="note">Trip context, driver, route, plate, and receipt can be attached to the support ticket.</p>{['Safety concern', 'Wrong route', 'Payment issue', 'Driver behavior', 'Lost item', 'App problem'].map((item) => <button key={item} className="list-row"><b>{item}</b><small>Attach trip HTD-98213-AB29</small></button>)}<button className="primary">Create support ticket</button></div></section>;
}

function DriverVerification({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen app-screen active"><Topbar title="Driver verification" back={() => go('activeTrip')} /><div className="content scroll"><DriverCard /><div className="verify-grid"><div><b>Plate matched</b><span>ABC-1234</span></div><div><b>Trip PIN required</b><span>4821</span></div><div><b>Profile</b><span>LTFRB-aware</span></div><div><b>Safety status</b><span>Good standing</span></div></div><p className="note">Always confirm the plate and driver before boarding. Do not share your PIN until you are inside the correct vehicle.</p></div></section>;
}

function Terms({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen app-screen active"><Topbar title="Terms & Privacy" back={() => go('account')} /><div className="content scroll legal"><h3>Terms of Use</h3><p>Hatid preview terms describe passenger responsibilities, cancellations, support, and demo-only limits.</p><h3>Privacy Policy</h3><p>Location is used for booking, routing, safety, support, and trip receipts. Trusted contacts receive trip details only when enabled.</p><h3>Data Privacy Consent</h3><p>This preview is structured for Philippine Data Privacy compliance but is not a final legal document.</p></div></section>;
}

function SafetyGuide({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen app-screen active"><Topbar title="Passenger safety" back={() => go('safety')} /><div className="content scroll legal"><h3>Before boarding</h3><p>Check plate, driver name, vehicle color, and trip PIN.</p><h3>During trip</h3><p>Share your live trip with trusted contacts and report route concerns immediately.</p><h3>After arrival</h3><p>Rate the trip and report any safety or payment issue from the receipt.</p></div></section>;
}

function Topbar({ title, subtitle, back, action }: { title: string; subtitle?: string; back?: () => void; action?: () => void }) {
  return <header className="topbar">{back && <button className="ghost" onClick={back}>←</button>}<div>{subtitle && <small>{subtitle}</small>}<b>{title}</b></div>{action && <button className="icon-btn" onClick={action}>🔔</button>}</header>;
}

function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('63')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  return [a, b, c].filter(Boolean).join(' ');
}
