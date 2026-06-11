import { useEffect, useMemo, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { DriverCard } from './components/DriverCard';
import { PhoneShell } from './components/PhoneShell';
import { RouteMap } from './components/RouteMap';
import { SafetyModal } from './components/SafetyModal';
import { driver, fareBreakdown, paymentMethods, pickupInstructions, places, popularDestinations, promo, rideOptions, serviceStatus } from './lib/mockData';
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

type TrustedContact = { name: string; phone: string; alert: string };
type ShareStatus = 'idle' | 'generated' | 'copied' | 'sent';

const stateCopy: Record<TripStage, { title: string; detail: string; cta: string }> = {
  idle: { title: 'Ready to book', detail: 'Choose a ride to begin the Makati/BGC pilot simulation.', cta: 'Start search' },
  searching: { title: 'Searching nearby drivers', detail: 'Checking driver availability and matching plate-verified vehicles around Salcedo.', cta: 'Assign driver' },
  assigned: { title: 'Driver assigned', detail: `${driver.name} accepted your booking. Plate ${driver.plate} is ready for match check.`, cta: 'Driver arriving' },
  arriving: { title: 'Kuya Juan is arriving', detail: `${driver.name} is ${driver.distance}. Meet at Salcedo Village lobby entrance.`, cta: 'Driver arrived' },
  arrived: { title: 'Driver has arrived', detail: `Confirm ${driver.plate} before boarding. Share your PIN only inside the correct vehicle.`, cta: 'Start trip demo' },
  in_trip: { title: 'Trip in progress', detail: 'Live trip is shared with Mom. ETA 18 min via Ayala Ave toward BGC High Street.', cta: 'Arriving soon' },
  arriving_soon: { title: 'Arriving soon', detail: 'Prepare to exit safely at BGC High Street drop-off bay.', cta: 'Complete trip' },
  completed: { title: 'Trip completed', detail: 'You arrived safely. Review your receipt and rate the trip.', cta: 'View receipt' },
  cancelled: { title: 'Trip cancelled', detail: 'No charge in this prototype. Cancellation reasons are captured for operations.', cta: 'Book again' },
};

const activeTripSafeTargets: Screen[] = ['activeTrip', 'shareTrip', 'driverVerification', 'reportIssue', 'completed', 'receipt'];
const issueTypes = ['Safety concern', 'Wrong route', 'Payment issue', 'Driver behavior', 'Lost item', 'App problem'];
const alertTypes = ['Live trip sharing enabled', 'SOS alerts enabled', 'Always ask first'];

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [historyStack, setHistoryStack] = useState<Screen[]>([]);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRide, setSelectedRide] = useState(rideOptions[0]);
  const [pickupInstruction, setPickupInstruction] = useState(pickupInstructions[0]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [tripStage, setTripStage] = useState<TripStage>('idle');
  const [modal, setModal] = useState<{ title: string; message: string } | null>(null);
  const [exitTarget, setExitTarget] = useState<Screen | null>(null);
  const [rating, setRating] = useState(0);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([
    { name: 'Mom', phone: '+63 917 000 4100', alert: 'Live trip sharing enabled' },
    { name: 'Brother', phone: '+63 918 555 2200', alert: 'SOS alerts enabled' },
  ]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAlert, setContactAlert] = useState(alertTypes[0]);
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle');
  const [selectedIssue, setSelectedIssue] = useState(issueTypes[0]);
  const [issueDetails, setIssueDetails] = useState('');
  const [ticketCreated, setTicketCreated] = useState(false);

  const normalizedPhone = useMemo(() => normalizePhone(phone), [phone]);
  const phoneValid = /^9\d{9}$/.test(normalizedPhone);
  const otpValid = /^\d{6}$/.test(otp);
  const tripIsLive = screen === 'activeTrip' && !['idle', 'completed', 'cancelled'].includes(tripStage);

  useEffect(() => {
    window.history.replaceState({ screen: 'splash' }, '', window.location.pathname);
    const onPopState = () => {
      setHistoryStack((stack) => {
        const previous = stack.length ? stack[stack.length - 1] : 'splash';
        setScreen(previous);
        return stack.slice(0, -1);
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (screen !== 'activeTrip') return;
    if (!['searching', 'assigned', 'arriving'].includes(tripStage)) return;
    const chain: Partial<Record<TripStage, TripStage>> = { searching: 'assigned', assigned: 'arriving', arriving: 'arrived' };
    const timer = window.setTimeout(() => setTripStage(chain[tripStage] ?? tripStage), 2200);
    return () => window.clearTimeout(timer);
  }, [screen, tripStage]);

  function pushScreen(next: Screen) {
    setHistoryStack((stack) => [...stack, screen]);
    setScreen(next);
    window.history.pushState({ screen: next }, '', window.location.pathname);
  }

  function go(next: Screen) {
    if (tripIsLive && !activeTripSafeTargets.includes(next)) {
      setExitTarget(next);
      return;
    }
    pushScreen(next);
  }

  function back(fallback: Screen = 'home') {
    if (tripIsLive) {
      setExitTarget(fallback);
      return;
    }
    setHistoryStack((stack) => {
      const previous = stack.length ? stack[stack.length - 1] : fallback;
      setScreen(previous);
      return stack.slice(0, -1);
    });
  }

  function open(title: string, message: string) {
    setModal({ title, message });
  }

  function beginTrip() {
    setTripStage('searching');
    pushScreen('activeTrip');
  }

  function nextTripStep() {
    if (tripStage === 'completed') return go('completed');
    if (tripStage === 'cancelled') return go('choose');
    if (tripStage === 'arrived') return setTripStage('in_trip');
    if (tripStage === 'in_trip') return setTripStage('arriving_soon');
    if (tripStage === 'arriving_soon') {
      setTripStage('completed');
      return go('completed');
    }
    const next = tripTimeline[stageIndex(tripStage) + 1];
    if (next) setTripStage(next);
  }

  function cancelTrip() {
    setTripStage('cancelled');
    setExitTarget(null);
    open('Trip cancelled', 'Demo cancellation captured. In production this would collect cancellation reason, pricing rules, and support escalation when needed.');
  }

  function confirmExitTrip() {
    const target = exitTarget ?? 'home';
    setTripStage('cancelled');
    setExitTarget(null);
    pushScreen(target);
  }

  function addTrustedContact() {
    if (!contactName.trim() || !contactPhone.trim()) return;
    setTrustedContacts((contacts) => [...contacts, { name: contactName.trim(), phone: contactPhone.trim(), alert: contactAlert }]);
    setContactName('');
    setContactPhone('');
    setContactAlert(alertTypes[0]);
    open('Trusted contact added', 'This contact is now available for live trip sharing and SOS alerts in the pilot preview.');
  }

  function createTicket() {
    setTicketCreated(true);
    open('Support ticket created', `Reference HTD-SUP-1028 created for ${selectedIssue}. Trip context, route, driver, plate, and receipt were attached in the preview.`);
  }

  return (
    <PhoneShell>
      {screen === 'splash' && <Splash go={go} />}
      {screen === 'login' && <Login go={go} back={back} phone={phone} setPhone={setPhone} phoneValid={phoneValid} />}
      {screen === 'otp' && <Otp go={go} back={back} otp={otp} setOtp={setOtp} valid={otpValid} phone={normalizedPhone} />}
      {screen === 'profile' && <Profile go={go} />}
      {screen === 'permissions' && <Permissions go={go} />}
      {screen === 'home' && <Home go={go} open={open} />}
      {screen === 'search' && <Search go={go} back={back} />}
      {screen === 'choose' && <ChooseRide back={back} selectedRide={selectedRide} setSelectedRide={setSelectedRide} pickupInstruction={pickupInstruction} setPickupInstruction={setPickupInstruction} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} beginTrip={beginTrip} />}
      {screen === 'activeTrip' && <ActiveTrip go={go} open={open} tripStage={tripStage} selectedRide={selectedRide} pickupInstruction={pickupInstruction} paymentMethod={paymentMethod} nextTripStep={nextTripStep} cancelTrip={cancelTrip} />}
      {screen === 'completed' && <Completed go={go} rating={rating} setRating={setRating} />}
      {screen === 'receipt' && <Receipt go={go} back={back} open={open} selectedRide={selectedRide} paymentMethod={paymentMethod} />}
      {screen === 'trips' && <Trips go={go} />}
      {screen === 'balance' && <Balance open={open} />}
      {screen === 'safety' && <Safety go={go} open={open} trustedContacts={trustedContacts} />}
      {screen === 'account' && <Account go={go} open={open} />}
      {screen === 'trustedContacts' && <TrustedContacts back={back} contacts={trustedContacts} name={contactName} phone={contactPhone} alert={contactAlert} setName={setContactName} setPhone={setContactPhone} setAlert={setContactAlert} addContact={addTrustedContact} />}
      {screen === 'shareTrip' && <ShareTrip back={back} contacts={trustedContacts} status={shareStatus} setStatus={setShareStatus} open={open} />}
      {screen === 'reportIssue' && <ReportIssue back={back} selectedIssue={selectedIssue} setSelectedIssue={setSelectedIssue} details={issueDetails} setDetails={setIssueDetails} ticketCreated={ticketCreated} createTicket={createTicket} />}
      {screen === 'driverVerification' && <DriverVerification back={back} />}
      {screen === 'terms' && <Terms back={back} />}
      {screen === 'safetyGuide' && <SafetyGuide back={back} />}
      <BottomNav current={screen} go={go} />
      {modal && <SafetyModal title={modal.title} message={modal.message} close={() => setModal(null)} />}
      {exitTarget && <ExitTripModal keepRide={() => setExitTarget(null)} shareTrip={() => { setExitTarget(null); pushScreen('shareTrip'); }} cancelAndLeave={confirmExitTrip} />}
    </PhoneShell>
  );
}

function Splash({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen splash active"><div className="ph-outline">PH</div><div className="splash-logo"><strong>Hatid</strong><span>Biyahe natin. Bansa natin.</span></div><div className="splash-card elevated"><p className="eyebrow">Makati/BGC pilot ready</p><h1>Reliable rides for everyday Filipinos.</h1><p>Book cars, motos, XL rides, and padala in one trusted app built for Philippine roads.</p><div className="badge-row"><span>Verified drivers</span><span>Live trip sharing</span><span>GCash • Maya • Cash</span></div><button className="primary" onClick={() => go('login')}>Get Started</button></div></section>;
}

function Login({ go, back, phone, setPhone, phoneValid }: { go: (screen: Screen) => void; back: () => void; phone: string; setPhone: (value: string) => void; phoneValid: boolean }) {
  return <section className="screen auth active"><button className="ghost back" onClick={back}>←</button><h1>Enter your mobile number</h1><p>Use a Philippine mobile number. We accept 09XXXXXXXXX or 9XXXXXXXXX.</p><label className="phone-field"><span>🇵🇭 +63</span><input inputMode="numeric" autoComplete="tel" placeholder="9XX XXX XXXX" value={formatPhone(normalizePhone(phone))} onChange={(event) => setPhone(event.target.value)} /></label><p className={phone && !phoneValid ? 'hint error' : 'hint'}>{phone && !phoneValid ? 'Enter a valid PH mobile number starting with 9.' : 'Protected by Hatid Safety • PH mobile only • Data Privacy compliant'}</p><div className="trust-strip"><span>LTFRB-aware</span><span>Verified drivers</span><span>Emergency contacts</span></div><button className="primary bottom" disabled={!phoneValid} onClick={() => go('otp')}>Continue</button></section>;
}

function Otp({ go, back, otp, setOtp, valid, phone }: { go: (screen: Screen) => void; back: () => void; otp: string; setOtp: (value: string) => void; valid: boolean; phone: string }) {
  return <section className="screen auth active"><button className="ghost back" onClick={back}>←</button><h1>Verify number</h1><p>Enter the 6-digit demo code sent to <strong>+63 {formatPhone(phone)}</strong>. Use any 6 digits.</p><input className="otp" maxLength={6} inputMode="numeric" placeholder="------" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} /><div className="otp-row"><button className="link" onClick={() => go('login')}>Change number</button><span>Resend in 30s</span></div><button className="primary bottom" disabled={!valid} onClick={() => go('profile')}>Verify & Continue</button></section>;
}

function Profile({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen auth active"><h1>Set up profile</h1><p>Enough for demo, structured for real onboarding later.</p><label className="field">Full name<input placeholder="Maria Santos" /></label><label className="field">Birthday<input type="date" /></label><label className="field">Email optional<input type="email" placeholder="maria@email.com" /></label><label className="checkline"><input type="checkbox" defaultChecked /> I agree to Hatid's Terms, Privacy Policy, and safety reminders.</label><button className="primary bottom" onClick={() => go('permissions')}>Save Profile</button></section>;
}

function Permissions({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen auth active"><div className="wordmark blue">Hatid</div><h1>Let's keep every ride safe.</h1><p>You can change permissions anytime in settings.</p><div className="permission-card"><b>📍 Location</b><span>Used only for booking, pickup routing, and active trips.</span></div><div className="permission-card"><b>🔔 Notifications</b><span>Driver arrival, safety alerts, receipts, and trusted contact updates.</span></div><button className="primary bottom" onClick={() => go('home')}>Allow Required Permissions</button></section>;
}

function Home({ go, open }: { go: (screen: Screen) => void; open: (title: string, message: string) => void }) {
  return <section className="screen app-screen active"><Topbar title="Good evening, Maria" subtitle="Pickup: Salcedo Village entrance" action={() => open('Notifications', 'Production will connect push notifications for driver arrival, receipts, and trusted contact alerts.')} /><div className="content scroll"><div className="live-card"><span>42 drivers nearby</span><b>3 min average pickup</b></div><div className="mini-map" onClick={() => go('choose')}><RouteMap stage="idle" compact /><div><b>Pickup accuracy: High</b><span>Meet at lobby entrance • 18 drivers available</span></div></div><h1>Saan ang punta?</h1><button className="search-box" onClick={() => go('search')}><span>🔎 Where to?</span><em>Now</em></button><div className="status-grid">{serviceStatus.map(([name, status, count]) => <div key={name}><b>{name}</b><span>{status}</span><small>{count}</small></div>)}</div><div className="promo"><b>Airport rides now available</b><span>Makati → NAIA Terminal 3 • 28–35 min</span></div><button className="balance-card" onClick={() => go('balance')}><span>Hatid Balance</span><b>₱1,250.00</b><small>Ride credits linked to GCash, Maya, Cash</small></button><h3>Saved places</h3><div className="quick-grid"><button onClick={() => go('choose')}>🏠 Home</button><button onClick={() => go('choose')}>💼 Work</button><button onClick={() => open('Saved places', 'Saved place creation is ready as a placeholder flow.')}>＋ Add place</button></div><h3>Recent trip</h3><button className="list-row" onClick={() => go('receipt')}><b>Salcedo Village → BGC High Street</b><small>Completed • ₱212.00 • Rebook available</small></button></div></section>;
}

function Search({ go, back }: { go: (screen: Screen) => void; back: () => void }) {
  return <section className="screen app-screen active"><Topbar title="Set destination" back={back} /><div className="content scroll"><div className="route-inputs"><input value={`Current Location • ${places.pickup}`} readOnly /><input placeholder="Where to?" autoFocus /></div><h3>Popular destinations</h3>{popularDestinations.map(([name, detail]) => <button key={name} className="list-row" onClick={() => go('choose')}><b>{name}</b><small>{detail}</small></button>)}</div></section>;
}

function ChooseRide({ back, selectedRide, setSelectedRide, pickupInstruction, setPickupInstruction, paymentMethod, setPaymentMethod, beginTrip }: { back: () => void; selectedRide: (typeof rideOptions)[number]; setSelectedRide: (ride: (typeof rideOptions)[number]) => void; pickupInstruction: string; setPickupInstruction: (value: string) => void; paymentMethod: (typeof paymentMethods)[number]; setPaymentMethod: (value: (typeof paymentMethods)[number]) => void; beginTrip: () => void }) {
  return <section className="screen app-screen map-screen active"><div className="map-panel"><button className="map-back" onClick={back}>←</button><RouteMap stage="idle" /></div><div className="sheet booking-sheet"><div className="handle" /><p className="eyebrow">Makati to BGC • 7.2 km • ETA 18 min</p><div className="quote-hero"><div><span>Estimated total</span><b>{selectedRide.fare}</b><small>{selectedRide.bestFor}</small></div><div><span>Traffic</span><b>{places.traffic}</b><small>{places.route}</small></div></div><div className="fare-intel"><div><b>Pickup</b><span>{selectedRide.eta} • high accuracy</span></div><div><b>Dropoff</b><span>{selectedRide.trip} • {places.destinationDetail}</span></div><div><b>Policy</b><span>{selectedRide.cancellation}</span></div></div>{rideOptions.map((ride) => <button key={ride.id} className={selectedRide.id === ride.id ? 'ride-option-v2 selected' : 'ride-option-v2'} onClick={() => setSelectedRide(ride)}><RideGlyph kind={ride.icon} /><span className="ride-copy"><b>{ride.label}</b><small>{ride.eta} • {ride.trip}</small><em>{ride.routeNote}</em></span><span className="ride-price"><b>{ride.fare}</b><small>{ride.available}</small></span></button>)}<section className="booking-card"><div className="section-head"><b>Pickup instruction</b><span>{places.pickupDetail}</span></div><div className="choice-row">{pickupInstructions.map((item) => <button key={item} className={pickupInstruction === item ? 'choice active' : 'choice'} onClick={() => setPickupInstruction(item)}>{item}</button>)}</div></section><section className="booking-card"><div className="section-head"><b>Payment</b><span>{paymentMethod.label}</span></div><div className="payment-list">{paymentMethods.map((method) => <button key={method.id} className={paymentMethod.id === method.id ? 'payment-option active' : 'payment-option'} onClick={() => setPaymentMethod(method)}><b>{method.label}</b><span>{method.detail}</span><em>{method.status}</em></button>)}</div></section><section className="booking-card fare-card"><div className="section-head"><b>Fare breakdown</b><span>Estimated quote</span></div>{fareBreakdown.map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}<div className="promo-line"><span>{promo.label}</span><b>-{promo.discount}</b></div></section><div className="policy-note"><b>{promo.code}</b><span>{promo.detail}. {selectedRide.cancellation}.</span></div><button className="primary" onClick={beginTrip}>Confirm {selectedRide.label.replace('Hatid ', '')}</button></div></section>;
}

function ActiveTrip({ go, open, tripStage, selectedRide, pickupInstruction, paymentMethod, nextTripStep, cancelTrip }: { go: (screen: Screen) => void; open: (title: string, message: string) => void; tripStage: TripStage; selectedRide: (typeof rideOptions)[number]; pickupInstruction: string; paymentMethod: (typeof paymentMethods)[number]; nextTripStep: () => void; cancelTrip: () => void }) {
  const copy = stateCopy[tripStage];
  return <section className="screen app-screen map-screen active"><div className="status-card elevated"><b>{copy.title}</b><span>{tripStageLabels[tripStage]}</span><small>{copy.detail}</small></div><div className="map-panel full"><RouteMap stage={tripStage} /></div><div className="sheet compact emotional"><div className="progress-rail">{tripTimeline.map((stage) => <span key={stage} className={stageIndex(stage) <= stageIndex(tripStage) ? 'done' : ''} />)}</div><div className="trip-stage"><b>{copy.title}</b><span>{copy.detail}</span></div><DriverCard compact /><div className="pin"><span>Your Ride PIN</span><b>4821</b></div><div className="trip-facts"><div><b>Pickup</b><span>{pickupInstruction}</span></div><div><b>Payment</b><span>{paymentMethod.label}</span></div></div><div className="actions"><button onClick={() => go('shareTrip')}>Share Trip</button><button onClick={() => open('Message driver', 'Production will open masked in-app chat/call with safety logging.')}>Message</button><button className="danger" onClick={() => open('Emergency SOS confirmation', 'Demo only — no emergency call is placed. Production would ask for confirmation, notify trusted contacts, share live location, and attach trip context to Hatid Safety.')}>Emergency</button></div><div className="split-actions"><button className="secondary" onClick={cancelTrip}>Cancel ride</button><button className="primary" onClick={nextTripStep}>{copy.cta}</button></div><button className="link center" onClick={() => go('driverVerification')}>View driver verification</button><small className="microcopy">{selectedRide.label} • {selectedRide.fare} • Trip PIN required before boarding.</small></div></section>;
}

function Completed({ go, rating, setRating }: { go: (screen: Screen) => void; rating: number; setRating: (value: number) => void }) {
  return <section className="screen auth completed active"><div className="success">✓</div><h1>You've arrived.</h1><p>Rate Juan and help keep Hatid safe.</p><DriverCard compact /><div className="stars">{[1, 2, 3, 4, 5].map((star) => <button key={star} onClick={() => setRating(star)}>{star <= rating ? '★' : '☆'}</button>)}</div>{rating > 0 && <div className="chip-grid"><button>Clean car</button><button>Safe driving</button><button>Polite driver</button><button>Fast pickup</button><button>Wrong route</button><button>Unsafe driving</button></div>}<button className="primary" onClick={() => go('receipt')}>View receipt</button><button className="secondary" onClick={() => go('reportIssue')}>Report issue</button></section>;
}

function Receipt({ go, back, open, selectedRide, paymentMethod }: { go: (screen: Screen) => void; back: () => void; open: (title: string, message: string) => void; selectedRide: (typeof rideOptions)[number]; paymentMethod: (typeof paymentMethods)[number] }) {
  return <section className="screen app-screen active"><Topbar title="Trip receipt" back={back} /><div className="content scroll"><div className="receipt elevated"><p>Total paid</p><h2>₱212.00</h2><small>June 11, 2026 • HTD-98213-AB29</small><hr />{fareBreakdown.map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}<div><span>Prototype fare adjustment</span><b>₱40.00</b></div><hr /><div><span>Ride type</span><b>{selectedRide.label}</b></div><div><span>Driver</span><b>{driver.name}</b></div><div><span>Route</span><b>Salcedo → BGC High Street</b></div><div><span>Payment</span><b>{paymentMethod.label}</b></div></div><button className="secondary" onClick={() => open('Download receipt', 'Production will create a PDF receipt and email copy.')}>Download / Share receipt</button><button className="secondary" onClick={() => go('reportIssue')}>Report issue</button></div></section>;
}

function Trips({ go }: { go: (screen: Screen) => void }) {
  return <section className="screen app-screen active"><Topbar title="Your trips" /><div className="content scroll"><div className="filters"><button className="active">All</button><button>Ride</button><button>Moto</button><button>Padala</button><button>Cancelled</button></div><div className="trip-card"><b>Hatid Car</b><span>Completed • ₱212.00</span><small>Salcedo Village → BGC High Street</small><button onClick={() => go('receipt')}>View receipt</button></div><div className="trip-card"><b>Scheduled Airport Ride</b><span>Upcoming • Tomorrow 7:30 AM</span><small>Makati → NAIA Terminal 3</small><button onClick={() => go('choose')}>Review quote</button></div><div className="empty-card"><b>Cancelled trips</b><span>No cancelled rides this week. Good record — keep riding safely.</span></div></div></section>;
}

function Balance({ open }: { open: (title: string, message: string) => void }) {
  return <section className="screen app-screen active"><Topbar title="Hatid Balance" /><div className="content scroll"><div className="balance-hero"><small>Transport credits</small><h2>₱1,250.00</h2><p>Not an e-money wallet. Used only for Hatid rides unless partnered with licensed providers.</p><div><button onClick={() => open('Add ride credits', 'Production will connect GCash, Maya, and approved cash-in partners.')}>Add ride credits</button><button disabled>Send disabled</button></div></div><h3>Payment methods</h3><div className="method"><b>GCash</b><span>Linked backup</span></div><div className="method"><b>Maya</b><span>Coming soon</span></div><div className="method"><b>Cash</b><span>Accepted</span></div><p className="note">Powered by licensed payment partners only when integrations are active. Peer transfer remains disabled until compliance review.</p></div></section>;
}

function Safety({ go, open, trustedContacts }: { go: (screen: Screen) => void; open: (title: string, message: string) => void; trustedContacts: TrustedContact[] }) {
  return <section className="screen app-screen active"><Topbar title="Safety Center" /><div className="content scroll"><div className="sos-card"><h2>Emergency SOS</h2><p>Demo only — no emergency call will be placed. Production requires confirmation, live location sharing, and trusted contact notification.</p><button className="danger" onClick={() => open('Emergency SOS confirmation', `Demo mode only. In production this would call emergency support, notify ${trustedContacts.map((c) => c.name).join(' and ')}, share live location, and attach trip HTD-98213-AB29.`)}>Open SOS confirmation</button></div><button className="list-row" onClick={() => go('trustedContacts')}><b>Trusted contacts</b><small>{trustedContacts.length} contacts ready for live trip links and SOS alerts</small></button><button className="list-row" onClick={() => go('shareTrip')}><b>Share live trip preview</b><small>Generate link, copy, or send to family</small></button><button className="list-row" onClick={() => go('reportIssue')}><b>Report issue</b><small>Create a support ticket with trip context</small></button><button className="list-row" onClick={() => go('driverVerification')}><b>Driver verification</b><small>Plate match, PIN, identity, vehicle profile</small></button><button className="list-row" onClick={() => go('safetyGuide')}><b>Passenger safety guidelines</b><small>Before boarding, during trip, after arrival</small></button></div></section>;
}

function Account({ go, open }: { go: (screen: Screen) => void; open: (title: string, message: string) => void }) {
  return <section className="screen app-screen active"><Topbar title="Account" /><div className="content scroll"><div className="profile-card"><div className="driver-photo-v2">MS</div><div><h2>Maria Santos</h2><p>+63 968 184 1001</p><span>KYC Verified</span></div></div><button className="list-row" onClick={() => open('Edit profile', 'Edit profile flow placeholder.')}>Edit profile</button><button className="list-row" onClick={() => go('trustedContacts')}>Trusted contacts</button><button className="list-row" onClick={() => go('terms')}>Terms & Privacy</button><button className="list-row" onClick={() => open('Delete account', 'Production will require identity confirmation and data retention notice.')}>Delete account</button><button className="list-row" onClick={() => open('App version', 'Hatid preview v0.7.0 phase 4 safety actions.')}>App version</button></div></section>;
}

function TrustedContacts({ back, contacts, name, phone, alert, setName, setPhone, setAlert, addContact }: { back: () => void; contacts: TrustedContact[]; name: string; phone: string; alert: string; setName: (value: string) => void; setPhone: (value: string) => void; setAlert: (value: string) => void; addContact: () => void }) {
  return <section className="screen app-screen active"><Topbar title="Trusted contacts" back={back} /><div className="content scroll"><p className="note">Contacts receive trip links only when you choose to share or trigger SOS.</p>{contacts.map((contact) => <div className="contact-card" key={`${contact.name}-${contact.phone}`}><b>{contact.name}</b><span>{contact.phone}</span><em>{contact.alert}</em></div>)}<section className="booking-card"><div className="section-head"><b>Add trusted contact</b><span>Preview only</span></div><label className="field">Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ate, Mom, Brother" /></label><label className="field">Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+63 9XX XXX XXXX" /></label><div className="choice-row">{alertTypes.map((item) => <button key={item} className={alert === item ? 'choice active' : 'choice'} onClick={() => setAlert(item)}>{item}</button>)}</div><button className="primary" disabled={!name.trim() || !phone.trim()} onClick={addContact}>Add trusted contact</button></section></div></section>;
}

function ShareTrip({ back, contacts, status, setStatus, open }: { back: () => void; contacts: TrustedContact[]; status: ShareStatus; setStatus: (value: ShareStatus) => void; open: (title: string, message: string) => void }) {
  const link = 'hatid.ph/t/HTD-98213-AB29';
  return <section className="screen app-screen active"><Topbar title="Share live trip" back={back} /><div className="content scroll share-trip-content"><RouteMap stage="arriving" compact /><div className="share-card"><b>Live trip preview</b><span>Maria is riding with {driver.name} in {driver.color} {driver.vehicle} {driver.plate}.</span><small>Pickup: {places.pickupDetail} • Dropoff: {places.destinationDetail} • ETA 18 min</small></div>{status !== 'idle' && <div className="note"><b>{status === 'generated' ? 'Secure link generated' : status === 'copied' ? 'Secure link copied' : 'Trip sent to trusted contacts'}</b><br />{link}</div>}<button className="primary" onClick={() => { setStatus('generated'); open('Secure trip link generated', 'A secure preview link was generated for this active trip.'); }}>Generate secure trip link</button><button className="secondary" onClick={() => { setStatus('copied'); open('Trip link copied', link); }}>Copy secure link</button><button className="secondary" onClick={() => { setStatus('sent'); open('Trip shared', `Sent to ${contacts.map((c) => c.name).join(', ')}.`); }}>Send to trusted contacts</button><h3>Recipients</h3>{contacts.map((contact) => <div className="contact-card" key={contact.phone}><b>{contact.name}</b><span>{contact.phone}</span><em>{contact.alert}</em></div>)}</div></section>;
}

function ReportIssue({ back, selectedIssue, setSelectedIssue, details, setDetails, ticketCreated, createTicket }: { back: () => void; selectedIssue: string; setSelectedIssue: (value: string) => void; details: string; setDetails: (value: string) => void; ticketCreated: boolean; createTicket: () => void }) {
  return <section className="screen app-screen active"><Topbar title="Report issue" back={back} /><div className="content scroll"><p className="note">Trip context, driver, route, plate, and receipt can be attached to the support ticket.</p>{ticketCreated && <div className="sos-card"><h2>Ticket created</h2><p>Reference HTD-SUP-1028 • {selectedIssue} • Trip HTD-98213-AB29 attached.</p></div>}<h3>Issue type</h3>{issueTypes.map((item) => <button key={item} className={selectedIssue === item ? 'list-row selected' : 'list-row'} onClick={() => setSelectedIssue(item)}><b>{item}</b><small>Attach trip HTD-98213-AB29</small></button>)}<label className="field">What happened?<textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Describe what happened. Include location, time, and safety concern if needed." rows={4} /></label><button className="primary" onClick={createTicket}>Create support ticket</button></div></section>;
}

function DriverVerification({ back }: { back: () => void }) {
  return <section className="screen app-screen active"><Topbar title="Driver verification" back={back} /><div className="content scroll"><DriverCard /><div className="verify-grid"><div><b>Plate matched</b><span>{driver.plate}</span></div><div><b>Trip PIN required</b><span>4821</span></div><div><b>Identity</b><span>{driver.verificationId}</span></div><div><b>Safety status</b><span>{driver.safetyStatus}</span></div></div><div className="note"><b>Before boarding checklist</b><br />Confirm plate {driver.plate}, vehicle color {driver.color}, driver name {driver.name}, and do not share the PIN until inside the correct vehicle.</div><div className="contact-card"><b>Vehicle profile</b><span>{driver.color} {driver.vehicle}</span><em>Good standing</em></div><div className="contact-card"><b>Safety audit</b><span>Identity verified • Plate matched • Trip PIN required</span><em>Passed today</em></div></div></section>;
}

function Terms({ back }: { back: () => void }) {
  return <section className="screen app-screen active"><Topbar title="Terms & Privacy" back={back} /><div className="content scroll legal"><h3>Terms of Use</h3><p>Hatid preview terms describe passenger responsibilities, cancellations, support, and demo-only limits.</p><h3>Privacy Policy</h3><p>Location is used for booking, routing, safety, support, and trip receipts. Trusted contacts receive trip details only when enabled.</p><h3>Data Privacy Consent</h3><p>This preview is structured for Philippine Data Privacy compliance but is not a final legal document.</p></div></section>;
}

function SafetyGuide({ back }: { back: () => void }) {
  return <section className="screen app-screen active"><Topbar title="Passenger safety" back={back} /><div className="content scroll legal"><div className="note"><b>Before boarding</b><br />Check plate, driver name, vehicle color, and Ride PIN. Meet at the selected pickup instruction, like lobby entrance or guardhouse.</div><div className="note"><b>During trip</b><br />Share your live trip with trusted contacts, keep route visible, and report wrong route or unsafe driving immediately.</div><div className="note"><b>After arrival</b><br />Check your receipt, rate the trip, report lost items or safety issues, and save frequent pickup points.</div><h3>Safety reminders</h3><button className="list-row"><b>Never board a mismatched plate</b><small>Cancel and report immediately if plate or vehicle is different.</small></button><button className="list-row"><b>Use trusted contacts</b><small>Share trips with family for late-night, airport, or unfamiliar routes.</small></button><button className="list-row"><b>Use SOS only when needed</b><small>Production mode would notify emergency and Hatid Safety after confirmation.</small></button></div></section>;
}

function Topbar({ title, subtitle, back, action }: { title: string; subtitle?: string; back?: () => void; action?: () => void }) {
  return <header className="topbar">{back && <button className="topbar-back" onClick={back} aria-label="Go back">←</button>}<div>{subtitle && <small>{subtitle}</small>}<b>{title}</b></div>{action && <button className="icon-btn" onClick={action}>🔔</button>}</header>;
}

function RideGlyph({ kind }: { kind: string }) {
  const label = kind === 'moto' ? 'M' : kind === 'xl' ? 'XL' : 'C';
  return <span className={`ride-glyph ${kind}`} aria-hidden="true">{label}</span>;
}

function ExitTripModal({ keepRide, shareTrip, cancelAndLeave }: { keepRide: () => void; shareTrip: () => void; cancelAndLeave: () => void }) {
  return <div className="modal" role="dialog" aria-modal="true"><div className="modal-card elevated"><h2>Your ride is active</h2><p>Keep your ride open, share the trip with family, or cancel the demo ride before leaving this screen.</p><div className="modal-actions"><button className="primary" onClick={keepRide}>Keep ride</button><button className="secondary" onClick={shareTrip}>Share trip</button><button className="secondary danger" onClick={cancelAndLeave}>Cancel and leave</button></div></div></div>;
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
