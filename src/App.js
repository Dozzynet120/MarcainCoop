import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// ==================== API CONFIGURATION ====================
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper: get auth token from localStorage
const getToken = () => localStorage.getItem('marcain_token');

// Helper: API fetch wrapper
async function apiFetch(url, options = {}) {
   const token = getToken();
   const headers = { ...(options.headers || {}) };
   if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
   }
   if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
   }
   const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
   return res.json();
}

// Submit membership application with files
async function submitMembership(formData, signatureCanvas) {
   const data = new FormData();
   Object.keys(formData).forEach(key => {
      if (key !== 'passportFile' && key !== 'govtIdFile') {
         data.append(key, formData[key]);
      }
   });
   if (formData.passportFile) data.append('passportFile', formData.passportFile);
   if (formData.govtIdFile) data.append('govtIdFile', formData.govtIdFile);
   if (signatureCanvas) {
      const signatureDataUrl = signatureCanvas.toDataURL('image/png');
      data.append('signatureDataUrl', signatureDataUrl);
   }
   const res = await fetch(`${API_BASE}/membership/apply`, {
      method: 'POST',
      body: data
   });
   return res.json();
}

// Admin: get all applications
async function getApplications(params = {}) {
   const query = new URLSearchParams(params).toString();
   return apiFetch(`/membership/applications?${query}`);
}

// Admin: get dashboard stats
async function getStats() {
   return apiFetch('/membership/applications/stats');
}

// Admin: update application status
async function updateStatus(id, status, note = '') {
   return apiFetch(`/membership/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note })
   });
}

// Auth: login
async function loginUser(email, password) {
   const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
   });
   return res.json();
}

// Auth: get current user
async function getMe() {
   return apiFetch('/auth/me');
}

const colors = {
   primary: '#1a0a3e',
   primaryLight: '#2d1b5e',
   accent: '#d4a843',
   accentHover: '#c49a3a',
   white: '#ffffff',
   lightGray: '#f8f9fa',
   text: '#333333',
   textLight: '#666666',
   border: '#e0e0e0',
   success: '#28a745',
   danger: '#dc3545',
   warning: '#ffc107',
   info: '#17a2b8'
};

const heroImages = ['/images/5.png', '/images/4.png', '/images/6.png'];
const aboutSliderImages = ['/images/about2.png', '/images/about4.png', '/images/about1.png'];
const whoWeAreSliderImages = ['/images/5.png', '/images/4.png', '/images/about1.png'];
const savingsImage = '/images/savings.png';
const loansImage = '/images/loans.png';
const investmentImage = '/images/investment.png';
const welfareImage = '/images/welfare.png';
const otherServicesImage = '/images/other.png';

const serviceLinks = [
   { label: 'Loan and Credit Facilities', page: 'loans' },
   { label: 'Savings and Deposites', page: 'savings' },
   { label: 'Welfare Support', page: 'welfare' },
   { label: 'Investment Opportunities', page: 'investment' },
   { label: 'Other Services', page: 'other-services' }
];

const lgaData = {
   'Abia': ['Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 'Isiala Ngwa South', 'Isuikwuato', 'Obi Ngwa', 'Ohafia', 'Osisioma', 'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu Nneochi'],
   'Adamawa': ['Demsa', 'Fufure', 'Ganye', 'Gayuk', 'Girei', 'Gombi', 'Hong', 'Jada', 'Lamurde', 'Madagali', 'Maiha', 'Mayo Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'],
   'Akwa Ibom': ['Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 'Mkpat Enin', 'Nsit Atai', 'Nsit Ibom', 'Nsit Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung Uko', 'Ukanafun', 'Uruan', 'Urue Offong Oruko', 'Uyo'],
   'Anambra': ['Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South', 'Oyi'],
   'Bauchi': ['Alkaleri', 'Bauchi', 'Bogoro', 'Damban', 'Darazo', 'Dass', 'Gamawa', 'Ganjuwa', 'Giade', 'Itas Gadau', "Jama'are", 'Katagum', 'Kirfi', 'Misau', 'Ningi', 'Shira', 'Tafawa Balewa', 'Toro', 'Warji', 'Zaki'],
   'Bayelsa': ['Brass', 'Ekeremor', 'Kolokuma Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
   'Benue': ['Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina Ala', 'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 'Ohimini', 'Oju', 'Okpokwu', 'Otukpo', 'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'],
   'Borno': ['Abadam', 'Askira Uba', 'Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 'Gubio', 'Guzamala', 'Gwoza', 'Hawul', 'Jere', 'Kaga', 'Kala Balge', 'Konduga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiduguri', 'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani'],
   'Cross River': ['Abi', 'Akamkpa', 'Akpabuyo', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal', 'Calabar South', 'Etung', 'Ikom', 'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 'Yakuur', 'Yala'],
   'Delta': ['Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri North', 'Warri South', 'Warri South West'],
   'Ebonyi': ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Ezza North', 'Ezza South', 'Ikwo', 'Ishielu', 'Ivo', 'Izzi', 'Ohaukwu', 'Onicha'],
   'Edo': ['Akoko Edo', 'Egor', 'Esan Central', 'Esan North East', 'Esan South East', 'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba Okha', 'Oredo', 'Orhionmwon', 'Ovia North East', 'Ovia South West', 'Owan East', 'Owan West', 'Uhunmwonde'],
   'Ekiti': ['Ado Ekiti', 'Efon', 'Ekiti East', 'Ekiti South West', 'Ekiti West', 'Emure', 'Gbonyin', 'Ido Osi', 'Ijero', 'Ikere', 'Ikole', 'Ilejemeje', 'Irepodun Ifelodun', 'Ise Orun', 'Moba', 'Oye'],
   'Enugu': ['Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo Etiti', 'Igbo Eze North', 'Igbo Eze South', 'Isi Uzo', 'Nkanu East', 'Nkanu West', 'Nsukka', 'Oji River', 'Udenu', 'Udi', 'Uzo Uwani'],
   'Gombe': ['Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo', 'Kwami', 'Nafada', 'Shongom', 'Yamaltu Deba'],
   'Imo': ['Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North', 'Ideato South', 'Ihitte Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu', 'Mbaitoli', 'Ngor Okpala', 'Njaba', 'Nkwerre', 'Nwangele', 'Obowo', 'Oguta', 'Ohaji Egbema', 'Okigwe', 'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal', 'Owerri North', 'Owerri West', 'Unuimo'],
   'Jigawa': ['Auyo', 'Babura', 'Biriniwa', 'Birnin Kudu', 'Buji', 'Dutse', 'Gagarawa', 'Garki', 'Gumel', 'Guri', 'Gwaram', 'Gwiwa', 'Hadejia', 'Jahun', 'Kafin Hausa', 'Kaugama', 'Kazaure', 'Kiri Kasama', 'Kiyawa', 'Maigatari', 'Malam Madori', 'Miga', 'Ringim', 'Roni', 'Sule Tankarkar', 'Taura', 'Yankwashi'],
   'Kaduna': ['Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba', "Jema'a", 'Kachia', 'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kaura', 'Kauru', 'Kubau', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zangon Kataf', 'Zaria'],
   'Kano': ['Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir', 'Nasarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa', 'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil'],
   'Katsina': ['Bakori', 'Batagarawa', 'Batsari', 'Baure', 'Bindawa', 'Charanchi', 'Dandume', 'Danja', 'Dan Musa', 'Daura', 'Dutsi', 'Dutsin Ma', 'Faskari', 'Funtua', 'Ingawa', 'Jibia', 'Kafur', 'Kaita', 'Kankara', 'Kankia', 'Katsina', 'Kurfi', 'Kusada', 'Mai Adua', 'Malumfashi', 'Mani', 'Mashi', 'Matazu', 'Musawa', 'Rimi', 'Sabuwa', 'Safana', 'Sandamu', 'Zango'],
   'Kebbi': ['Aleiro', 'Arewa Dandi', 'Argungu', 'Augie', 'Bagudo', 'Birnin Kebbi', 'Bunza', 'Dandi', 'Fakai', 'Gwandu', 'Jega', 'Kalgo', 'Koko Besse', 'Maiyama', 'Ngaski', 'Sakaba', 'Shanga', 'Suru', 'Wasagu Danko', 'Yauri', 'Zuru'],
   'Kogi': ['Adavi', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Idah', 'Igalamela Odolu', 'Ijumu', 'Kabba Bunu', 'Kogi', 'Lokoja', 'Mopa Muro', 'Ofu', 'Ogori Magongo', 'Okehi', 'Okene', 'Olamaboro', 'Omala', 'Yagba East', 'Yagba West'],
   'Kwara': ['Asa', 'Baruten', 'Edu', 'Ekiti', 'Ifelodun', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Irepodun', 'Isin', 'Kaiama', 'Moro', 'Offa', 'Oke Ero', 'Oyun', 'Pategi'],
   'Lagos': ['Agege', 'Ajeromi Ifelodun', 'Alimosho', 'Amuwo Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti Osa', 'Ibeju Lekki', 'Ifako Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi Isolo', 'Shomolu', 'Surulere'],
   'Nasarawa': ['Akwanga', 'Awe', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 'Lafia', 'Nasarawa', 'Nasarawa Egon', 'Obi', 'Toto', 'Wamba'],
   'Niger': ['Agaie', 'Agwara', 'Bida', 'Borgu', 'Bosso', 'Chanchaga', 'Edati', 'Gbako', 'Gurara', 'Katcha', 'Kontagora', 'Lapai', 'Lavun', 'Magama', 'Mariga', 'Mashegu', 'Mokwa', 'Moya', 'Paikoro', 'Rafi', 'Rijau', 'Shiroro', 'Suleja', 'Tafa', 'Wushishi'],
   'Ogun': ['Abeokuta North', 'Abeokuta South', 'Ado Odo Ota', 'Egbado North', 'Egbado South', 'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ikenne', 'Imeko Afon', 'Ipokia', 'Obafemi Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 'Remo North', 'Shagamu'],
   'Ondo': ['Akoko North East', 'Akoko North West', 'Akoko South East', 'Akoko South West', 'Akure North', 'Akure South', 'Ese Odo', 'Idanre', 'Ifedore', 'Ilaje', 'Ile Oluji Okeigbo', 'Irele', 'Odigbo', 'Okitipupa', 'Ondo East', 'Ondo West', 'Ose', 'Owo'],
   'Osun': ['Aiyedaade', 'Aiyedire', 'Atakumosa East', 'Atakumosa West', 'Boluwaduro', 'Boripe', 'Ede North', 'Ede South', 'Egbedore', 'Ejigbo', 'Ife Central', 'Ife East', 'Ife North', 'Ife South', 'Ifedayo', 'Ifelodun', 'Ila', 'Ilesa East', 'Ilesa West', 'Irepodun', 'Irewole', 'Isokan', 'Iwo', 'Obokun', 'Odo Otin', 'Ola Oluwa', 'Olorunda', 'Oriade', 'Orolu', 'Osogbo'],
   'Oyo': ['Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North', 'Ibadan North East', 'Ibadan North West', 'Ibadan South East', 'Ibadan South West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu', 'Ogbomosho North', 'Ogbomosho South', 'Ogo Oluwa', 'Olorunsogo', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 'Surulere'],
   'Plateau': ['Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 'Jos South', 'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua an Pan', 'Riyom', 'Shendam', 'Wase'],
   'Rivers': ['Abua Odual', 'Ahoada East', 'Ahoada West', 'Akuku Toru', 'Andoni', 'Asari Toru', 'Bonny', 'Degema', 'Eleme', 'Emohua', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Obio Akpor', 'Ogba Egbema Ndoni', 'Ogu Bolo', 'Okrika', 'Omuma', 'Opobo Nkoro', 'Oyigbo', 'Port Harcourt', 'Tai'],
   'Sokoto': ['Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 'Gwadabawa', 'Illela', 'Isa', 'Kebbe', 'Kware', 'Rabah', 'Sabon Birni', 'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tambuwal', 'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'],
   'Taraba': ['Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Jalingo', 'Karim Lamido', 'Kumi', 'Lau', 'Sardauna', 'Takum', 'Ussa', 'Wukari', 'Yorro', 'Zing'],
   'Yobe': ['Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 'Geidam', 'Gujba', 'Gulani', 'Jakusko', 'Karasuwa', 'Machina', 'Nangere', 'Nguru', 'Potiskum', 'Tarmuwa', 'Yunusari', 'Yusufari'],
   'Zamfara': ['Anka', 'Bakura', 'Birnin Magaji Kiyaw', 'Bukkuyum', 'Bungudu', 'Gummi', 'Gusau', 'Kaura Namoda', 'Maradun', 'Maru', 'Shinkafi', 'Talata Mafara', 'Tsafe', 'Zurmi'],
   'FCT': ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council']
};

// ==================== REUSABLE SERVICE SIDEBAR ====================
function ServiceSidebar({ currentPage, setPage }) {
   return (
      <div className="service-sidebar">
         <h3>Services</h3>
         <div className="service-sidebar-links">
            {serviceLinks.map(link => (
               <button key={link.page} onClick={() => setPage(link.page)}
                  className={currentPage === link.page ? 'active' : ''}>
                  {link.label}
               </button>
            ))}
         </div>
         <div className="service-call-card">
            <div className="call-icon">📞</div>
            <h4>Call us</h4>
            <p className="call-number">07051425250</p>
            <button className="btn-call" onClick={() => setPage('membership')}>Become a Member</button>
         </div>
      </div>
   );
}

function ServicePageHero({ title, subtitle, bgImage }) {
   return (
      <div className="service-page-hero" style={{ backgroundImage: `linear-gradient(135deg, rgba(26, 10, 62, 0.75) 0%, rgba(45, 27, 94, 0.6) 100%), url(${bgImage})` }}>
         <div className="service-hero-content">
            <h1>{title}</h1>
            <div className="service-breadcrumb">
               <span>Home</span><span className="breadcrumb-sep">|</span><span>{subtitle}</span>
            </div>
         </div>
      </div>
   );
}

function ServicePageLayout({ title, subtitle, bgImage, mainImage, description, features, benefits, currentPage, setPage }) {
   return (
      <div>
         <ServicePageHero title={title} subtitle={subtitle} bgImage={bgImage} />
         <div className="gold-accent-line"></div>
         <div className="service-page-layout">
            <div className="service-main-content">
               <div className="service-main-image"><img src={mainImage} alt={title} /></div>
               <div className="service-description"><p>{description}</p></div>
               {features && features.length > 0 && (
                  <div className="service-features">
                     <h3>Features and Benefits</h3>
                     <ul>{features.map((f, i) => (<li key={i}><span className="check-icon">✓</span>{f}</li>))}</ul>
                  </div>
               )}
               {benefits && benefits.length > 0 && (
                  <div className="service-benefits">
                     <h3>Why Choose MARCAIN {title}</h3>
                     <ul>{benefits.map((b, i) => (<li key={i}><span className="check-icon">✓</span>{b}</li>))}</ul>
                  </div>
               )}
            </div>
            <ServiceSidebar currentPage={currentPage} setPage={setPage} />
         </div>
      </div>
   );
}

function ImageSlider({ images, autoPlay = true, interval = 5000, height = '400px', showIndicators = true, showArrows = true, overlay = false }) {
   const [currentSlide, setCurrentSlide] = useState(0);
   const [isLoaded, setIsLoaded] = useState(Array(images.length).fill(false));
   useEffect(() => {
      if (!autoPlay) return;
      const timer = setInterval(() => { setCurrentSlide(prev => (prev + 1) % images.length); }, interval);
      return () => clearInterval(timer);
   }, [autoPlay, interval, images.length]);
   const goToSlide = (index) => setCurrentSlide(index);
   const goToPrev = () => setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
   const goToNext = () => setCurrentSlide(prev => (prev + 1) % images.length);
   const handleImageLoad = (index) => { setIsLoaded(prev => { const n = [...prev]; n[index] = true; return n; }); };
   return (
      <div className="image-slider" style={{ height }}>
         {images.map((img, index) => (
            <div key={index} className={`slider-image-wrapper ${currentSlide === index ? 'active' : ''}`}>
               {!isLoaded[index] && <div className="slider-loading">Loading...</div>}
               <img src={img} alt={`Slide ${index + 1}`} className="slider-image"
                  onLoad={() => handleImageLoad(index)} style={{ opacity: isLoaded[index] ? 1 : 0 }} />
               {overlay && currentSlide === index && <div className="slider-overlay"></div>}
            </div>
         ))}
         {showArrows && (<><button className="slider-arrow slider-arrow-prev" onClick={goToPrev}>❮</button>
            <button className="slider-arrow slider-arrow-next" onClick={goToNext}>❯</button></>)}
         {showIndicators && (
            <div className="slider-indicators">
               {images.map((_, i) => (<button key={i} onClick={() => goToSlide(i)} className={currentSlide === i ? 'active' : ''} />))}
            </div>
         )}
      </div>
   );
}


// ==================== NAVBAR ====================
function Navbar({ currentPage, setPage }) {
   const [aboutOpen, setAboutOpen] = useState(false);
   const [servicesOpen, setServicesOpen] = useState(false);
   const [mobileOpen, setMobileOpen] = useState(false);
   const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
   const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
   const aboutRef = useRef(null);
   const servicesRef = useRef(null);
   const mobileMenuRef = useRef(null);
   const hamburgerRef = useRef(null);

   useEffect(() => {
      function handleClickOutside(e) {
         if (aboutRef.current && !aboutRef.current.contains(e.target)) setAboutOpen(false);
         if (servicesRef.current && !servicesRef.current.contains(e.target)) setServicesOpen(false);
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   useEffect(() => {
      function handleResize() {
         if (window.innerWidth > 768) {
            setMobileOpen(false);
            setMobileAboutOpen(false);
            setMobileServicesOpen(false);
         }
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   useEffect(() => {
      function handleClickOutsideMobile(e) {
         if (mobileOpen &&
            mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) &&
            hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
            setMobileOpen(false);
            setMobileAboutOpen(false);
            setMobileServicesOpen(false);
         }
      }
      document.addEventListener('mousedown', handleClickOutsideMobile);
      return () => document.removeEventListener('mousedown', handleClickOutsideMobile);
   }, [mobileOpen]);

   const navLinks = [
      { label: 'Home', page: 'home' },
      {
         label: 'About', page: 'about', dropdown: [
            { label: 'Who We Are', page: 'who-we-are' },
            { label: 'Management Team', page: 'management' },
            { label: 'Constitution', page: 'constitution' }
         ]
      },
      {
         label: 'Services', page: 'services', dropdown: [
            { label: 'Savings & Deposits', page: 'savings' },
            { label: 'Loans & Credit', page: 'loans' },
            { label: 'Investment Opportunities', page: 'investment' },
            { label: 'Welfare Support', page: 'welfare' },
            { label: 'Other Services', page: 'other-services' }
         ]
      },
      { label: 'Membership', page: 'membership' },
      { label: 'Gallery', page: 'gallery' },
      { label: 'Contact', page: 'contact' },
      { label: 'Portal', page: 'portal' },
      { label: 'Attendance', page: 'attendance' }
   ];

   const handleNavClick = (page) => {
      setPage(page);
      setMobileOpen(false);
      setMobileAboutOpen(false);
      setMobileServicesOpen(false);
      setAboutOpen(false);
      setServicesOpen(false);
   };

   return (
      <nav className="navbar">
         <div className="nav-container">
            <div className="logo" onClick={() => handleNavClick('home')}>
               <img src="/Marcainlogo.png" alt="MARCAIN Cooperative" className="logo-img" />
            </div>

            <div className="nav-links desktop-only">
               {navLinks.map((link) => (
                  <div key={link.page}
                     ref={link.label === 'About' ? aboutRef : link.label === 'Services' ? servicesRef : null}
                     className="nav-item"
                     onMouseEnter={() => { if (link.label === 'About') setAboutOpen(true); if (link.label === 'Services') setServicesOpen(true); }}
                     onMouseLeave={() => { if (link.label === 'About') setAboutOpen(false); if (link.label === 'Services') setServicesOpen(false); }}>
                     <button onClick={() => handleNavClick(link.page)}
                        className={`nav-link ${currentPage === link.page ? 'active' : ''}`}>
                        {link.label}
                        {link.dropdown && (
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="6 9 12 15 18 9"></polyline>
                           </svg>
                        )}
                     </button>
                     {link.dropdown && (
                        <div className={`dropdown ${(link.label === 'About' ? aboutOpen : servicesOpen) ? 'open' : ''}`}>
                           {link.dropdown.map((item) => (
                              <button key={item.page} onClick={() => handleNavClick(item.page)}
                                 className="dropdown-item">{item.label}</button>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
            </div>

            <div className="nav-actions">
               <button className="join-btn desktop-only" onClick={() => handleNavClick('membership')}>Join Us</button>
               <button
                  ref={hamburgerRef}
                  className={`hamburger ${mobileOpen ? 'active' : ''}`}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}
               >
                  <span></span>
                  <span></span>
                  <span></span>
               </button>
            </div>
         </div>

         <div ref={mobileMenuRef} className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
            <div className="mobile-menu-header">
               <span className="mobile-menu-title">Menu</span>
               <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <line x1="18" y1="6" x2="6" y2="18"></line>
                     <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
               </button>
            </div>
            <div className="mobile-menu-links">
               {navLinks.map((link) => (
                  <div key={link.page} className="mobile-nav-item">
                     {link.dropdown ? (
                        <>
                           <button
                              className={`mobile-nav-link ${currentPage === link.page ? 'active' : ''}`}
                              onClick={() => {
                                 if (link.label === 'About') setMobileAboutOpen(!mobileAboutOpen);
                                 if (link.label === 'Services') setMobileServicesOpen(!mobileServicesOpen);
                              }}
                           >
                              {link.label}
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                 style={{ transform: (link.label === 'About' ? mobileAboutOpen : mobileServicesOpen) ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                 <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                           </button>
                           <div className={`mobile-dropdown ${(link.label === 'About' ? mobileAboutOpen : mobileServicesOpen) ? 'open' : ''}`}>
                              {link.dropdown.map((item) => (
                                 <button key={item.page} onClick={() => handleNavClick(item.page)}
                                    className={`mobile-dropdown-item ${currentPage === item.page ? 'active' : ''}`}>
                                    {item.label}
                                 </button>
                              ))}
                           </div>
                        </>
                     ) : (
                        <button onClick={() => handleNavClick(link.page)}
                           className={`mobile-nav-link ${currentPage === link.page ? 'active' : ''}`}>
                           {link.label}
                        </button>
                     )}
                  </div>
               ))}
            </div>
            <div className="mobile-menu-footer">
               <button className="mobile-join-btn" onClick={() => handleNavClick('membership')}>Join Us</button>
            </div>
         </div>
         {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)}></div>}
      </nav>
   );
}


// ==================== HOME PAGE ====================
function HomePage({ setPage }) {
   const [currentSlide, setCurrentSlide] = useState(0);
   const slides = [
      { title: 'MARCAIN COOPERATIVE', subtitle: 'A co-operative and multipurpose society dedicated to financial empowerment, matrimonial rights advocacy, and community development.', bg: colors.primary },
      { title: 'FINANCIAL EMPOWERMENT', subtitle: 'Access savings, loans, and affordable essential goods to achieve your financial goals and improve your quality of life.', bg: colors.primaryLight },
      { title: 'JOIN OUR COMMUNITY', subtitle: 'Become a member today and enjoy the benefits of collective growth, mutual support, and financial well-being.', bg: colors.primary }
   ];
   useEffect(() => {
      const timer = setInterval(() => { setCurrentSlide(prev => (prev + 1) % slides.length); }, 5000);
      return () => clearInterval(timer);
   }, [slides.length]);
   const whyJoinItems = [
      { num: '1', title: 'Financial Security:', desc: 'Save, invest, and access credit in a secure and transparent system.' },
      { num: '2', title: 'Family Protection:', desc: 'Benefit from matrimonial rights advocacy and welfare support.' },
      { num: '3', title: 'Collective Strength:', desc: 'Enjoy the power of numbers - better deals, shared resources, and greater opportunities.' },
      { num: '4', title: 'Personal Growth:', desc: 'Access training, skills, and knowledge that improve your life.' },
      { num: '5', title: 'Community Impact:', desc: 'Be part of a movement that transforms lives and strengthens communities.' }
   ];
   return (
      <div>
         <div className="hero-slider-container">
            <ImageSlider images={heroImages} autoPlay={true} interval={5000} height="550px" showIndicators={true} showArrows={true} overlay={true} />
            <div className="hero-slider-content">
               {slides.map((slide, index) => (
                  <div key={index} className={`hero-slide-text ${currentSlide === index ? 'active' : ''}`}>
                     <h1>{slide.title}</h1><p>{slide.subtitle}</p>
                     <button className="hero-btn" onClick={() => setPage('membership')}>Become a Member</button>
                  </div>
               ))}
            </div>
         </div>
         <section className="welcome-section">
            <div className="section-header">
               <h2>WELCOME TO MARCAIN COOPERATIVE</h2>
               <p className="welcome-text">MARCAIN Cooperative coined from Matrimonial Rights Counsel and Advocacy Initiative is a modern and innovative platform designed to foster cooperation, thrift, and financial well-being among its members. Rooted in the principles of mutual support and collective growth, we provide seamless access to savings, loans, and affordable essential goods to help members achieve their financial goals and improve their quality of life.</p>
               <div className="welcome-btns">
                  <button className="btn-readmore" onClick={() => setPage('who-we-are')}>Read More</button>
                  <button className="btn-join" onClick={() => setPage('membership')}>Join MARCAIN</button>
               </div>
            </div>
         </section>
         <section className="why-join-section">
            <div className="why-join-container">
               <div className="why-join-content">
                  <h2 className="why-join-title">Why Join MARCAIN</h2>
                  <p className="why-join-intro">Joining MARCAIN means more than just becoming part of a co-operative - it means joining a movement for growth, protection, and togetherness.</p>
                  <div className="why-join-list">
                     {whyJoinItems.map((item, i) => (
                        <div key={i} className="why-join-item">
                           <div className="why-join-num">{item.num}</div>
                           <div className="why-join-text"><h4>{item.title}</h4><p>{item.desc}</p></div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="why-join-image"><img src="/images/why1.png" alt="MARCAIN Community" className="why-join-img" /></div>
            </div>
         </section>
         <section className="mission-vision-section">
            <div className="mission-vision-container">
               <div className="mv-card mission-card">
                  <div className="mv-icon">🎯</div><h3>Our Mission</h3>
                  <p>To foster cooperation, thrift, and financial well-being among members through mutual support, accessible financial services, and sustainable community development initiatives that empower individuals and families to build wealth and create a secure financial future.</p>
               </div>
               <div className="mv-card vision-card">
                  <div className="mv-icon">🔭</div><h3>Our Vision</h3>
                  <p>To become the leading cooperative society in Nigeria, recognized for excellence in financial empowerment, matrimonial rights advocacy, and community development - creating a world where every member thrives economically, socially, and legally.</p>
               </div>
            </div>
         </section>
         <section className="core-values-section">
            <div className="section-header"><h2>Our Core Values</h2><div className="accent-line center"></div></div>
            <div className="core-values-grid">
               {[{ icon: '⚖️', title: 'Integrity', desc: 'Fairness, accountability, and transparency in all dealings.' }, { icon: '💡', title: 'Empowerment', desc: 'Providing tools, resources, and opportunities for members to thrive.' }, { icon: '🔄', title: 'Sustainability', desc: 'Building programs and systems that benefit generations to come.' }, { icon: '👥', title: 'Equity & Fairness', desc: 'Equal opportunities for every member, regardless of background.' }].map((v, i) => (
                  <div key={i} className="core-value-card"><div className="core-value-icon">{v.icon}</div><h4>{v.title}</h4><p>{v.desc}</p></div>
               ))}
            </div>
         </section>
         <section className="how-it-works-section">
            <div className="section-header"><h2>How It Works</h2><div className="accent-line center"></div><p className="section-subtitle">Joining MARCAIN is simple and straightforward</p></div>
            <div className="steps-grid">
               {[{ step: '01', title: 'Apply Online', desc: 'Fill out our simple membership application form with your personal details.' }, { step: '02', title: 'Get Verified', desc: 'Our staff reviews your application and verifies your information.' }, { step: '03', title: 'Start Saving', desc: 'Begin your monthly savings and unlock access to loans and benefits.' }, { step: '04', title: 'Enjoy Benefits', desc: 'Access loans, welfare support, investment opportunities, and more.' }].map((s, i) => (
                  <div key={i} className="step-card"><div className="step-number">{s.step}</div><h4>{s.title}</h4><p>{s.desc}</p></div>
               ))}
            </div>
         </section>
         <section className="services-section">
            <div className="section-header"><h2>Our Services</h2><div className="accent-line center"></div></div>
            <div className="features-grid">
               {[{ icon: '💰', title: 'Savings & Deposits', desc: 'Secure your future with our competitive savings plans.', page: 'savings' }, { icon: '📈', title: 'Loans & Credit', desc: 'Access affordable loans with flexible repayment terms.', page: 'loans' }, { icon: '🤝', title: 'Welfare Support', desc: 'Community-driven welfare programs for members in need.', page: 'welfare' }, { icon: '🏛️', title: 'Investment Opportunities', desc: 'Grow your wealth through cooperative investments.', page: 'investment' }].map((f, i) => (
                  <div key={i} className="feature-card"><div className="feature-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p><button className="btn-readmore-service" onClick={() => setPage(f.page)}>Learn More</button></div>
               ))}
            </div>
         </section>
         <section className="stats-section">
            <div className="stats-grid">
               {[{ num: '2,500+', label: 'Active Members' }, { num: '₦500M+', label: 'Loans Disbursed' }, { num: '15+', label: 'Years of Service' }, { num: '98%', label: 'Member Satisfaction' }].map((stat, i) => (
                  <div key={i} className="stat-item"><div className="stat-num">{stat.num}</div><div className="stat-label">{stat.label}</div></div>
               ))}
            </div>
         </section>
         <section className="cta-section">
            <h2>Ready to Join MARCAIN Cooperative?</h2>
            <p>Take the first step towards financial empowerment and community development. Our membership application process is simple and transparent.</p>
            <button className="cta-btn" onClick={() => setPage('membership')}>Apply for Membership</button>
         </section>
      </div>
   );
}

// ==================== WHO WE ARE PAGE ====================
function WhoWeArePage() {
   const values = [
      { icon: '⚖️', title: 'Integrity:', desc: 'We believe in fairness, accountability, and transparency in all dealings.' },
      { icon: '💡', title: 'Empowerment:', desc: 'We are committed to providing the tools, resources, and opportunities that help our members thrive.' },
      { icon: '🔄', title: 'Sustainability:', desc: 'We develop programs and systems that are built to last and benefit generations to come.' },
      { icon: '👥', title: 'Equity & Fairness:', desc: 'We ensure equal opportunities for every member, regardless of background, gender, or social status.' }
   ];
   return (
      <div>
         <div className="page-hero"><div className="page-hero-overlay"></div>
            <div className="page-hero-content"><h1>Who We Are</h1>
               <div className="breadcrumb"><span onClick={() => window.scrollTo(0, 0)} style={{ cursor: 'pointer' }}>Home</span><span className="breadcrumb-sep">|</span><span>Who We Are</span></div>
            </div>
         </div>
         <div className="gold-accent-line"></div>
         <section className="page-slider-section">
            <div className="section-header"><h2>Our Community in Action</h2><div className="accent-line center"></div></div>
            <ImageSlider images={whoWeAreSliderImages} autoPlay={true} interval={4000} height="450px" showIndicators={true} showArrows={true} overlay={false} />
         </section>
         <section className="values-section">
            <div className="values-grid-four">
               {values.map((v, i) => (<div key={i} className="value-card-box"><div className="value-icon-box">{v.icon}</div><h3>{v.title}</h3><p>{v.desc}</p></div>))}
            </div>
         </section>
         <section className="about-content-section">
            <div className="about-content-grid">
               <div className="about-image"><div className="about-img-placeholder"><span>👨‍👩‍👧‍👦</span><p>Team Photo Placeholder</p></div></div>
               <div className="about-text-content">
                  <p>MARCAIN Cooperative coined from Matrimonial Rights Counsel and Advocacy Initiative is a modern and innovative platform designed to foster cooperation, thrift, and financial well-being among its members. Rooted in the principles of mutual support and collective growth, we provide seamless access to savings, loans, and affordable essential goods to help members achieve their financial goals and improve their quality of life.</p>
                  <p>Our cooperative operates through a user-friendly mobile app that enables members to save, access loans, and enjoy exclusive discounts on food items and other products. With a focus on innovation and inclusivity, we empower individuals and families to build wealth and create a secure financial future.</p>
                  <p>At MARCAIN, we understand that families and individuals often face challenges that are both financial and social. That is why we blend the strengths of a co-operative system with a strong advocacy initiative, creating a supportive platform where our members can grow, thrive, and have their voices heard.</p>
                  <p>We act as a bridge between economic empowerment and legal protection, making sure our members have access to affordable financial services while also receiving professional guidance on matrimonial and social rights. MARCAIN is not just an organization - it is a movement for change, equity, and shared prosperity.</p>
               </div>
            </div>
         </section>
      </div>
   );
}

// ==================== ABOUT PAGE ====================
function AboutPage({ setPage }) {
   return (
      <div className="page-container">
         <h1 className="page-title">About MARCAIN Cooperative</h1><div className="accent-line center"></div>
         <section className="page-slider-section">
            <ImageSlider images={aboutSliderImages} autoPlay={true} interval={4000} height="400px" showIndicators={true} showArrows={true} overlay={false} />
         </section>
         <div className="about-grid">
            <div>
               <h2>Our Story</h2>
               <p>MARCAIN Cooperative was founded on the principles of mutual aid, financial inclusion, and community development. What began as a small group of like-minded individuals has grown into a thriving multipurpose cooperative society serving thousands of members.</p>
               <p>The name MARCAIN stands for <strong>Matrimonial Rights Counsel and Advocacy Initiative</strong>, reflecting our deep commitment to protecting family rights while empowering members economically.</p>
               <div className="about-btns">
                  <button onClick={() => setPage('who-we-are')} className="btn-primary">Who We Are</button>
                  <button onClick={() => setPage('management')} className="btn-outline">Management Team</button>
               </div>
            </div>
            <div className="mission-card"><div className="mission-icon">🎯</div><h3>Our Mission</h3><p>To foster cooperation, thrift, and financial well-being among members through mutual support, accessible financial services, and sustainable community development initiatives.</p></div>
         </div>
      </div>
   );
}

// ==================== MANAGEMENT TEAM ====================
function ManagementPage() {
   const team = [
      {
         name: 'Dr. Ibojiemenmen Celestine', role: 'President', image: '/images/Chairman.jpg',
         bio: 'Dr. Ibojiemenmen Celestine is a seasoned engineer, educator, full-stack programmer and businessman. He earned his first degree in Mechanical Engineering from the University of Benin (2002), an M.Sc in Engineering Development and Management from North-West University, South Africa (2008), and an MBA with a specialism in strategic planning from Edinburgh Business School, Heriot-Watt University, Scotland. He also holds a Postgraduate Diploma in Education (PGDE) from the National Teachers Institute. He has held operational positions at Air Liquide Nigeria, Gateway Bank (now Access Bank), Sasol Petrochemical (South Africa), and Gulf Piping (Abu Dhabi, UAE), and serves as Chairman of Phostine Premium Schools. His leadership in primary education in Nigeria has earned several awards, including an honorary Doctor of Science in Engineering and Project Management from the European-American University.'
      },
      { name: 'Mrs. Grace Okafor', role: 'Secretary', image: '/images/team-secretary.jpg', bio: 'Legal expert with specialization in cooperative law and governance. Over 15 years of experience in legal advisory and corporate governance.' },
      { name: 'Mr. James Nwosu', role: 'Treasurer', image: '/images/team-treasurer.jpg', bio: 'Chartered accountant with expertise in cooperative finance and financial management. Ensures transparent and accountable financial operations.' },
   ];
   const [expandedMember, setExpandedMember] = useState(null);
   const toggleBio = (index) => { setExpandedMember(expandedMember === index ? null : index); };
   return (
      <div>
         <div className="page-hero"><div className="page-hero-overlay"></div>
            <div className="page-hero-content"><h1>Management Team</h1>
               <div className="breadcrumb"><span onClick={() => window.scrollTo(0, 0)} style={{ cursor: 'pointer' }}>Home</span><span className="breadcrumb-sep">›</span><span>Management Team</span></div>
            </div>
         </div>
         <div className="gold-accent-line"></div>
         <section className="team-section">
            <div className="team-section-header">
               <span className="eyebrow">Leadership</span>
               <h2 className="section-title">The people behind MARCAIN</h2>
               <p className="lead">Our management team combines professional experience with a deep commitment to member welfare.</p>
            </div>
            <div className="team-grid-modern">
               {team.map((member, i) => (
                  <div key={i} className="team-member-card">
                     <div className="team-member-image">
                        <img src={member.image} alt={member.name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        <div className="team-member-placeholder" style={{ display: 'none' }}><span>👤</span></div>
                     </div>
                     <div className="team-member-info">
                        <div className="team-member-role">{member.role}</div>
                        <h3 className="team-member-name">{member.name}</h3>
                        <button className="team-read-profile" onClick={() => toggleBio(i)}>{expandedMember === i ? 'Hide Profile ↑' : 'Read full profile ↓'}</button>
                        {expandedMember === i && (<div className="team-member-bio"><p>{member.bio}</p></div>)}
                     </div>
                  </div>
               ))}
            </div>
         </section>
      </div>
   );
}

// ==================== CONSTITUTION ====================
function ConstitutionPage() {
   const articles = [
      { title: 'Article 1: Name and Registration', content: 'The name of the society shall be MARCAIN Multipurpose Cooperative Society Limited, registered under the relevant cooperative societies legislation.' },
      { title: 'Article 2: Objectives', content: 'To promote the economic and social interests of members through savings, credit facilities, welfare programs, and community development initiatives.' },
      { title: 'Article 3: Membership', content: 'Membership is open to all individuals who agree to abide by this constitution, pay the required registration fee, and commit to regular monthly savings.' },
      { title: 'Article 4: Rights and Obligations', content: 'Members have the right to vote, access loans, participate in welfare programs, and receive dividends. Members must save monthly, attend meetings, and comply with all bye-laws.' },
      { title: 'Article 5: Governance Structure', content: 'The society shall be governed by a Board of Directors comprising the Chairman, Secretary, Treasurer, and other elected officers. Day-to-day operations shall be managed by appointed staff.' },
      { title: 'Article 6: Meetings', content: 'General meetings shall be held at least once per quarter. Special meetings may be called by the Chairman or upon written request by at least 20% of members.' },
      { title: 'Article 7: Savings and Loans', content: 'Members shall save a minimum amount monthly as determined by the Board. Loan applications shall be subject to verification, approval by the Credit Committee, and availability of funds.' },
      { title: 'Article 8: Discipline and Appeals', content: 'Members who violate the constitution or bye-laws may be suspended or expelled following due process. Appeals shall be heard by the Board within 30 days.' }
   ];
   return (
      <div>
         <div className="page-hero"><div className="page-hero-overlay"></div>
            <div className="page-hero-content"><h1>Constitution</h1>
               <div className="breadcrumb"><span onClick={() => window.scrollTo(0, 0)} style={{ cursor: 'pointer' }}>Home</span><span className="breadcrumb-sep">|</span><span>Constitution</span></div>
            </div>
         </div>
         <div className="gold-accent-line"></div>
         <div className="page-container narrow">
            <h1 className="page-title">MARCAIN Cooperative Constitution</h1><div className="accent-line center"></div>
            <div className="content-card">
               <div className="constitution-header"><h2>MARCAIN MULTIPURPOSE COOPERATIVE SOCIETY LIMITED</h2><p>Registered under the Cooperative Societies Law</p></div>
               {articles.map((article, i) => (<div key={i} className={`article-item ${i < articles.length - 1 ? 'bordered' : ''}`}><h3>{article.title}</h3><p>{article.content}</p></div>))}
            </div>
            <div className="constitution-download">
               <a href="/documents/marcain-constitution.pdf" download className="btn-download-constitution"><span className="download-icon">&#128196;</span>Download MARCAIN Cooperative Constitution</a>
            </div>
         </div>
      </div>
   );
}

// ==================== SERVICES OVERVIEW PAGE ====================
function ServicesPage({ setPage }) {
   const services = [
      { icon: '💰', title: 'Savings & Deposits', page: 'savings', desc: 'Build your financial security with our range of savings products.' },
      { icon: '📈', title: 'Loans & Credit Facilities', page: 'loans', desc: 'Access affordable credit for personal and business needs.' },
      { icon: '🏛️', title: 'Investment Opportunities', page: 'investment', desc: 'Grow your wealth through cooperative investment schemes.' },
      { icon: '🤝', title: 'Welfare Support', page: 'welfare', desc: 'Community support programs for members in need.' },
      { icon: '📋', title: 'Other Services', page: 'other-services', desc: 'Additional services tailored to member needs.' }
   ];
   return (
      <div className="page-container">
         <h1 className="page-title">Our Services</h1><div className="accent-line center"></div>
         <div className="services-grid">
            {services.map((s, i) => (<div key={i} className="service-card" onClick={() => setPage(s.page)}><div className="service-icon">{s.icon}</div><h3>{s.title}</h3><p>{s.desc}</p><span className="learn-more">Learn More →</span></div>))}
         </div>
      </div>
   );
}

// ==================== SAVINGS PAGE ====================
function SavingsPage({ setPage }) {
   return (
      <ServicePageLayout
         title="Savings and Deposits"
         subtitle="Savings and Deposits"
         bgImage={savingsImage}
         mainImage={savingsImage}
         description="At MARCAIN, we believe that financial security starts with disciplined saving. Our savings and deposit plans are designed to help members build wealth steadily while enjoying competitive interest rates. Whether you are saving for a specific goal, your children's education, or retirement, we have a plan that fits your needs."
         features={[
            'Regular Savings Account with 8% annual interest',
            'Target Savings with 10% annual interest and lock-in benefits',
            'Fixed Deposit plans with up to 12% annual interest',
            "Children's Savings plan to secure your child's future",
            'Flexible deposit schedules - daily, weekly, or monthly',
            'No hidden charges or withdrawal penalties on regular savings'
         ]}
         benefits={[
            'Build a steady culture of security and financial discipline',
            'Access loans based on your savings history',
            'Enjoy higher returns compared to conventional banks',
            'Secure your family future with dedicated children plans',
            'Track your savings easily through our mobile app'
         ]}
         currentPage="savings"
         setPage={setPage}
      />
   );
}

// ==================== LOANS PAGE ====================
function LoansPage({ setPage }) {
   return (
      <ServicePageLayout
         title="Loan and Credit Facilities"
         subtitle="Loan and Credit Facilities"
         bgImage={loansImage}
         mainImage={loansImage}
         description="We offer reasonable lending and credit services to help members meet their personal, family, and commercial needs. Our lending plans are designed to be accessible, flexible, and supportive, ensuring that members do not pay excessive interest. MARCAIN provides a safe and lucrative platform to save for school, business, emergencies, or retirement."
         features={[
            'Personal Loans for individual and family needs',
            'Business/Entrepreneurship Loans for members ventures',
            'Emergency Loans with fast approval process',
            'Project Financing for large-scale developments',
            'Low-interest rates compared to commercial banks',
            'Flexible repayment plans that reduce financial stress'
         ]}
         benefits={[
            'Get loans at lower interest rates compared to commercial banks',
            'Enjoy flexible repayment plans that reduce financial stress',
            'Access quick and transparent loan processing',
            'Borrow with confidence, knowing you are supported by a society that wants you to succeed',
            'No collateral required for small emergency loans'
         ]}
         currentPage="loans"
         setPage={setPage}
      />
   );
}

// ==================== INVESTMENT PAGE ====================
function InvestmentPage({ setPage }) {
   return (
      <ServicePageLayout
         title="Investment Opportunities"
         subtitle="Investment Opportunities"
         bgImage={investmentImage}
         mainImage={investmentImage}
         description="MARCAIN Cooperative offers members exclusive access to vetted investment opportunities that combine security with attractive returns. All investments are screened by our Investment Committee to ensure they meet our risk and return criteria. Grow your wealth through pooled cooperative investments in real estate, agriculture, trade finance, and more."
         features={[
            'Cooperative Investment Fund with 15-18% annual returns',
            'Real Estate Collective investments in property developments',
            'Agricultural Partnerships in large-scale farming ventures',
            'Trade Finance for verified commodity traders',
            'Low to medium risk investment options',
            'Quarterly dividend payouts for active investors'
         ]}
         benefits={[
            'Access high-return investments vetted by experts',
            'Diversify your portfolio with cooperative-backed projects',
            'Enjoy lower risk through pooled investment structures',
            'Receive professional investment guidance and support',
            'Reinvest dividends for compound growth'
         ]}
         currentPage="investment"
         setPage={setPage}
      />
   );
}

// ==================== WELFARE PAGE ====================
function WelfarePage({ setPage }) {
   return (
      <ServicePageLayout
         title="Welfare Support"
         subtitle="Welfare Support"
         bgImage={welfareImage}
         mainImage={welfareImage}
         description="At MARCAIN, we see ourselves as one family. Beyond finances, we stand with our members during both joyous and difficult moments. Our welfare support programs are designed to provide compassionate assistance when members need it most - from medical emergencies to bereavement support and educational scholarships."
         features={[
            'Medical Support for serious health conditions',
            'Bereavement Support for families who lose a member',
            'Education Support and scholarships for children',
            'Emergency Relief for natural disasters and accidents',
            'Compassionate financial assistance for hospital bills',
            'Family support grants during difficult times'
         ]}
         benefits={[
            'Receive support during life most challenging moments',
            'Access medical and funeral assistance without financial strain',
            'Secure educational opportunities for your children',
            'Feel the strength of a caring community behind you',
            'Quick response fund for unforeseen emergencies'
         ]}
         currentPage="welfare"
         setPage={setPage}
      />
   );
}

// ==================== OTHER SERVICES PAGE ====================
function OtherServicesPage({ setPage }) {
   return (
      <ServicePageLayout
         title="Other Services"
         subtitle="Other Services"
         bgImage={otherServicesImage}
         mainImage={otherServicesImage}
         description="At MARCAIN, we believe that true empowerment extends beyond financial services. That is why we provide a variety of extra programs designed to support members in every aspect of their lives - from financial literacy training to legal advisory and matrimonial counseling."
         features={[
            'Financial Literacy Training and workshops',
            'Bulk Purchase Scheme for essential goods at wholesale prices',
            'Matrimonial Counseling for couples and families',
            'Legal Advisory on cooperative matters and contracts',
            'Business development support and mentorship',
            'Community networking and partnership events'
         ]}
         benefits={[
            'Gain practical financial skills through free workshops',
            'Save money on everyday purchases through collective buying',
            'Access professional counseling at subsidized rates',
            'Get legal advice on contracts and member rights',
            'Build valuable connections within the cooperative community'
         ]}
         currentPage="other-services"
         setPage={setPage}
      />
   );
}


// ==================== MEMBERSHIP FORM (WITH BACKEND INTEGRATION) ====================
function MembershipFormPage({ setPage }) {
   const [currentStep, setCurrentStep] = useState(1);
   const [errors, setErrors] = useState({});
   const [submitted, setSubmitted] = useState(false);
   const [refCode, setRefCode] = useState('');
   const [dragOver, setDragOver] = useState({ passport: false, govtId: false });
   const [previewUrls, setPreviewUrls] = useState({ passport: null, govtId: null });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState('');

   const [formData, setFormData] = useState({
      surname: '', firstName: '', otherName: '', dob: '', gender: '', maritalStatus: '',
      occupation: '', employmentType: '', state: '', lga: '', phone: '', email: '',
      agreeConstitution: false, nominatorName: '', nominatorPhone: '', agreeSavings: false,
      declarationName: '', declarationDate: new Date().toISOString().split('T')[0],
      passportFile: null, govtIdFile: null
   });

   const canvasRef = useRef(null);
   const [isDrawing, setIsDrawing] = useState(false);
   const [hasSigned, setHasSigned] = useState(false);
   const lastPos = useRef({ x: 0, y: 0 });

   const totalSteps = 4;
   const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

   const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
         setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
      }
   };

   const validateStep = (step) => {
      const newErrors = {};

      if (step === 1) {
         if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
         if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
         if (!formData.dob) newErrors.dob = 'Date of birth is required';
         if (!formData.gender) newErrors.gender = 'Gender is required';
         if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
         if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
         if (!formData.employmentType) newErrors.employmentType = 'Employment status is required';
         if (!formData.state) newErrors.state = 'State is required';
         if (!formData.lga) newErrors.lga = 'LGA is required';
         if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
         else if (!/^0[7-9][0-1][0-9]{8}$/.test(formData.phone)) newErrors.phone = 'Valid Nigerian phone required (e.g. 08012345678)';
         if (!formData.email.trim()) newErrors.email = 'Email is required';
         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required';
      }

      if (step === 2) {
         if (!formData.agreeConstitution) newErrors.agreeConstitution = 'You must agree to the constitution';
         if (!formData.nominatorName.trim()) newErrors.nominatorName = 'Nominator name is required';
         if (!formData.nominatorPhone.trim()) newErrors.nominatorPhone = 'Nominator phone is required';
         else if (!/^0[7-9][0-1][0-9]{8}$/.test(formData.nominatorPhone)) newErrors.nominatorPhone = 'Valid Nigerian phone required';
         if (!formData.agreeSavings) newErrors.agreeSavings = 'You must acknowledge this obligation';
      }

      if (step === 3) {
         if (!formData.passportFile) newErrors.passportFile = 'Passport photograph is required';
         if (!formData.govtIdFile) newErrors.govtIdFile = 'Government ID is required';
      }

      if (step === 4) {
         const fullName = (formData.surname + ' ' + formData.firstName).toLowerCase().trim();
         if (!formData.declarationName.trim()) newErrors.declarationName = 'Name is required for declaration';
         else if (formData.declarationName.toLowerCase().trim() !== fullName) newErrors.declarationName = 'Name must match your surname and first name exactly';
         if (!hasSigned) newErrors.signature = 'Please sign above to proceed';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const nextStep = () => {
      if (validateStep(currentStep)) {
         if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
      }
   };

   const prevStep = () => {
      if (currentStep > 1) setCurrentStep(currentStep - 1);
   };

   const goToStep = (step) => {
      if (step < currentStep) setCurrentStep(step);
   };

   const handleSubmit = async () => {
      if (!validateStep(4)) return;
      setIsSubmitting(true);
      setSubmitError('');

      try {
         const result = await submitMembership(formData, canvasRef.current);
         if (result.success) {
            setRefCode(result.ref);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
         } else {
            setSubmitError(result.error || 'Submission failed. Please try again.');
         }
      } catch (err) {
         setSubmitError('Network error. Please check your connection and try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   useEffect(() => {
      if (currentStep !== 4) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const resizeCanvas = () => {
         const rect = canvas.parentElement.getBoundingClientRect();
         canvas.width = rect.width - 4;
         canvas.height = 180;
         ctx.strokeStyle = '#1a1a1a';
         ctx.lineWidth = 2;
         ctx.lineCap = 'round';
         ctx.lineJoin = 'round';
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
   }, [currentStep]);

   const getPos = (e, canvas) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
   };

   const startDrawing = (e) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const pos = getPos(e, canvas);
      setIsDrawing(true);
      lastPos.current = pos;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
   };

   const draw = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const pos = getPos(e, canvas);
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPos.current = pos;
      setHasSigned(true);
      if (errors.signature) {
         setErrors(prev => { const n = { ...prev }; delete n.signature; return n; });
      }
   };

   const stopDrawing = () => { setIsDrawing(false); };

   const clearSignature = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSigned(false);
   };

   const handleFileSelect = (file, type) => {
      if (!file) return;
      setFormData(prev => ({ ...prev, [type + 'File']: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [type]: url }));
      if (errors[type + 'File']) {
         setErrors(prev => { const n = { ...prev }; delete n[type + 'File']; return n; });
      }
   };

   const removeFile = (type, e) => {
      if (e) e.stopPropagation();
      setFormData(prev => ({ ...prev, [type + 'File']: null }));
      if (previewUrls[type]) {
         URL.revokeObjectURL(previewUrls[type]);
         setPreviewUrls(prev => ({ ...prev, [type]: null }));
      }
   };

   const handleDrop = (e, type) => {
      e.preventDefault();
      setDragOver(prev => ({ ...prev, [type]: false }));
      const files = e.dataTransfer.files;
      if (files.length) handleFileSelect(files[0], type);
   };

   const steps = [
      { num: 1, label: 'Personal' },
      { num: 2, label: 'Membership' },
      { num: 3, label: 'Uploads' },
      { num: 4, label: 'Declare' }
   ];

   useEffect(() => {
      return () => {
         if (previewUrls.passport) URL.revokeObjectURL(previewUrls.passport);
         if (previewUrls.govtId) URL.revokeObjectURL(previewUrls.govtId);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   if (submitted) {
      return (
         <div className="membership-form-page">
            <div className="membership-header">
               <div className="header-content">
                  <div className="logo-container"><img src="/Marcainlogo.png" alt="MARCAIN Cooperative Logo" /></div>
                  <div className="org-badge"><i className="fas fa-shield-alt"></i> MARCAIN Cooperative Society</div>
                  <h1>Membership Application</h1>
                  <p>Join the Matrimonial Rights Counsel and Advocacy Initiative</p>
               </div>
            </div>
            <div className="form-container">
               <div className="form-card">
                  <div className="success-screen show">
                     <div className="success-icon"><i className="fas fa-check"></i></div>
                     <h2>Application Submitted!</h2>
                     <p>Your MARCAIN Cooperative membership application has been received and is now under review. You will be notified once your application is processed.</p>
                     <div className="application-ref">
                        <div className="label">Application Reference</div>
                        <div className="code">{refCode}</div>
                     </div>
                     <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        <i className="fas fa-plus-circle"></i> Submit Another Application
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="membership-form-page">
         <div className="membership-header">
            <div className="header-content">
               <div className="logo-container"><img src="/Marcainlogo.png" alt="MARCAIN Cooperative Logo" /></div>
               <div className="org-badge"><i className="fas fa-shield-alt"></i> MARCAIN Cooperative Society</div>
               <h1>Membership Application</h1>
               <p>Join the Matrimonial Rights Counsel and Advocacy Initiative. Complete all steps to register as a member.</p>
            </div>
         </div>

         <div className="progress-container">
            <div className="progress-bar">
               <div className="progress-line">
                  <div className="progress-line-fill" style={{ width: progress + '%' }}></div>
               </div>
               {steps.map((s) => (
                  <div key={s.num} className={`step ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
                     onClick={() => goToStep(s.num)}>
                     <div className="step-circle">{currentStep > s.num ? '✓' : s.num}</div>
                     <span className="step-label">{s.label}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="form-container">
            <div className="form-card">
               {/* STEP 1: Personal Information */}
               <div className={`step-content ${currentStep === 1 ? 'active' : ''}`}>
                  <div className="form-header">
                     <h2><i className="fas fa-user-circle" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i>Personal Information</h2>
                     <p>Please provide your basic personal details accurately.</p>
                  </div>
                  <div className="form-body">
                     <div className="form-grid">
                        <div className={`form-group ${errors.surname ? 'error' : ''}`}>
                           <label className="required">Surname</label>
                           <input type="text" value={formData.surname} onChange={e => handleChange('surname', e.target.value)} placeholder="Enter your surname" />
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.surname}</span>
                        </div>
                        <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
                           <label className="required">First Name</label>
                           <input type="text" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} placeholder="Enter your first name" />
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.firstName}</span>
                        </div>
                        <div className="form-group">
                           <label>Other Name</label>
                           <input type="text" value={formData.otherName} onChange={e => handleChange('otherName', e.target.value)} placeholder="Enter other name (optional)" />
                        </div>
                        <div className={`form-group ${errors.dob ? 'error' : ''}`}>
                           <label className="required">Date of Birth</label>
                           <input type="date" value={formData.dob} onChange={e => handleChange('dob', e.target.value)} max="2006-12-31" />
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.dob}</span>
                        </div>
                        <div className={`form-group full-width ${errors.gender ? 'error' : ''}`}>
                           <label className="required">Gender</label>
                           <div className="radio-group">
                              {['Male', 'Female', 'Other'].map(g => (
                                 <label key={g} className={`radio-item ${formData.gender === g ? 'selected' : ''}`}
                                    onClick={() => handleChange('gender', g)}>
                                    <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={() => { }} />
                                    <span>{g}</span>
                                 </label>
                              ))}
                           </div>
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.gender}</span>
                        </div>
                        <div className={`form-group full-width ${errors.maritalStatus ? 'error' : ''}`}>
                           <label className="required">Marital Status</label>
                           <div className="radio-group">
                              {['Single', 'Married', 'Divorced', 'Widowed'].map(m => (
                                 <label key={m} className={`radio-item ${formData.maritalStatus === m ? 'selected' : ''}`}
                                    onClick={() => handleChange('maritalStatus', m)}>
                                    <input type="radio" name="marital" value={m} checked={formData.maritalStatus === m} onChange={() => { }} />
                                    <span>{m}</span>
                                 </label>
                              ))}
                           </div>
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.maritalStatus}</span>
                        </div>
                        <div className={`form-group ${errors.occupation ? 'error' : ''}`}>
                           <label className="required">Occupation</label>
                           <input type="text" value={formData.occupation} onChange={e => handleChange('occupation', e.target.value)} placeholder="e.g., Teacher, Engineer" />
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.occupation}</span>
                        </div>
                        <div className={`form-group full-width ${errors.employmentType ? 'error' : ''}`}>
                           <label className="required">Employment Status</label>
                           <div className="radio-group">
                              {['Self-employed', 'Employed', 'Business Owner'].map(et => (
                                 <label key={et} className={`radio-item ${formData.employmentType === et ? 'selected' : ''}`}
                                    onClick={() => handleChange('employmentType', et)}>
                                    <input type="radio" name="employment" value={et} checked={formData.employmentType === et} onChange={() => { }} />
                                    <span>{et}</span>
                                 </label>
                              ))}
                           </div>
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.employmentType}</span>
                        </div>
                        <div className={`form-group ${errors.state ? 'error' : ''}`}>
                           <label className="required">State of Residence</label>
                           <select value={formData.state} onChange={e => { handleChange('state', e.target.value); handleChange('lga', ''); }}>
                              <option value="">Select State</option>
                              {Object.keys(lgaData).sort().map(s => <option key={s} value={s}>{s === 'FCT' ? 'FCT Abuja' : s}</option>)}
                           </select>
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.state}</span>
                        </div>
                        <div className={`form-group ${errors.lga ? 'error' : ''}`}>
                           <label className="required">Local Government Area</label>
                           <select value={formData.lga} onChange={e => handleChange('lga', e.target.value)}>
                              <option value="">Select LGA</option>
                              {formData.state && lgaData[formData.state] ? lgaData[formData.state].map(l => <option key={l} value={l}>{l}</option>) : null}
                           </select>
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.lga}</span>
                        </div>
                        <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                           <label className="required">Phone Number</label>
                           <input type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="e.g., 08012345678" />
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.phone}</span>
                        </div>
                        <div className={`form-group ${errors.email ? 'error' : ''}`}>
                           <label className="required">Email Address</label>
                           <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="your.email@example.com" />
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.email}</span>
                        </div>
                     </div>
                  </div>
                  <div className="form-actions">
                     <div></div>
                     <button className="btn btn-primary" onClick={nextStep}>Continue <i className="fas fa-arrow-right"></i></button>
                  </div>
               </div>

               {/* STEP 2: Membership Details */}
               <div className={`step-content ${currentStep === 2 ? 'active' : ''}`}>
                  <div className="form-header">
                     <h2><i className="fas fa-handshake" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i>Membership Details</h2>
                     <p>Confirm your commitment and provide nomination details.</p>
                  </div>
                  <div className="form-body">
                     <div className="form-grid full-width">
                        <div className={`form-group full-width ${errors.agreeConstitution ? 'error' : ''}`}>
                           <label className="required">Do you agree to abide by the Constitution and Bye-Laws of MARCAIN Cooperative?</label>
                           <label className={`checkbox-item ${formData.agreeConstitution ? 'selected' : ''}`} style={{ width: 'fit-content' }}
                              onClick={() => handleChange('agreeConstitution', !formData.agreeConstitution)}>
                              <input type="checkbox" checked={formData.agreeConstitution} onChange={() => { }} />
                              <span>I have read and agree to abide by the Constitution and Bye-Laws</span>
                           </label>
                           <button type="button" className="constitution-link" onClick={() => alert('Constitution document would open here')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}>
                              <i className="fas fa-external-link-alt"></i> Click to read Constitution
                           </button>
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.agreeConstitution}</span>
                        </div>
                        <div className={`form-group ${errors.nominatorName ? 'error' : ''}`}>
                           <label className="required">Nominator Name</label>
                           <input type="text" value={formData.nominatorName} onChange={e => handleChange('nominatorName', e.target.value)} placeholder="Full name of your nominator" />
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.nominatorName}</span>
                        </div>
                        <div className={`form-group ${errors.nominatorPhone ? 'error' : ''}`}>
                           <label className="required">Nominator Phone Number</label>
                           <input type="tel" value={formData.nominatorPhone} onChange={e => handleChange('nominatorPhone', e.target.value)} placeholder="e.g., 08012345678" />
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.nominatorPhone}</span>
                        </div>
                        <div className={`form-group full-width ${errors.agreeSavings ? 'error' : ''}`}>
                           <label className="required">Do you understand that you must save monthly as part of your membership obligation?</label>
                           <label className={`checkbox-item ${formData.agreeSavings ? 'selected' : ''}`} style={{ width: 'fit-content' }}
                              onClick={() => handleChange('agreeSavings', !formData.agreeSavings)}>
                              <input type="checkbox" checked={formData.agreeSavings} onChange={() => { }} />
                              <span>Yes, I understand and commit to monthly savings</span>
                           </label>
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.agreeSavings}</span>
                        </div>
                     </div>
                  </div>
                  <div className="form-actions">
                     <button className="btn btn-secondary" onClick={prevStep}><i className="fas fa-arrow-left"></i> Back</button>
                     <button className="btn btn-primary" onClick={nextStep}>Continue <i className="fas fa-arrow-right"></i></button>
                  </div>
               </div>

               {/* STEP 3: Document Uploads */}
               <div className={`step-content ${currentStep === 3 ? 'active' : ''}`}>
                  <div className="form-header">
                     <h2><i className="fas fa-cloud-upload-alt" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i>Document Uploads</h2>
                     <p>Upload your recent passport photograph and a valid government-issued ID.</p>
                  </div>
                  <div className="form-body">
                     <div className="form-grid full-width">
                        <div className={`form-group full-width ${errors.passportFile ? 'error' : ''}`}>
                           <label className="required">Passport Photograph</label>
                           <div className={`upload-zone ${dragOver.passport ? 'dragover' : ''} ${formData.passportFile ? 'has-file' : ''}`}
                              onClick={() => document.getElementById('passportInput').click()}
                              onDrop={e => handleDrop(e, 'passport')}
                              onDragOver={e => { e.preventDefault(); setDragOver(prev => ({ ...prev, passport: true })); }}
                              onDragLeave={e => { e.preventDefault(); setDragOver(prev => ({ ...prev, passport: false })); }}>
                              <input type="file" id="passportInput" accept="image/jpeg,image/png" style={{ display: 'none' }}
                                 onChange={e => handleFileSelect(e.target.files[0], 'passport')} />
                              {!formData.passportFile ? (
                                 <div className="upload-content">
                                    <div className="upload-icon"><i className="fas fa-camera"></i></div>
                                    <div className="upload-text">Click or drag to upload passport photo</div>
                                    <div className="upload-hint">JPEG or PNG, max 5MB, minimum 300x300px</div>
                                 </div>
                              ) : (
                                 <div className="upload-preview show">
                                    <img className="preview-img" src={previewUrls.passport} alt="Preview" />
                                    <div className="preview-info">
                                       <div className="preview-name">{formData.passportFile.name}</div>
                                       <div className="preview-size">{(formData.passportFile.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                    <button className="preview-remove" onClick={e => removeFile('passport', e)}>
                                       <i className="fas fa-times"></i>
                                    </button>
                                 </div>
                              )}
                           </div>
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.passportFile}</span>
                        </div>
                        <div className={`form-group full-width ${errors.govtIdFile ? 'error' : ''}`}>
                           <label className="required">Government-Issued ID</label>
                           <div className={`upload-zone ${dragOver.govtId ? 'dragover' : ''} ${formData.govtIdFile ? 'has-file' : ''}`}
                              onClick={() => document.getElementById('govtIdInput').click()}
                              onDrop={e => handleDrop(e, 'govtId')}
                              onDragOver={e => { e.preventDefault(); setDragOver(prev => ({ ...prev, govtId: true })); }}
                              onDragLeave={e => { e.preventDefault(); setDragOver(prev => ({ ...prev, govtId: false })); }}>
                              <input type="file" id="govtIdInput" accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }}
                                 onChange={e => handleFileSelect(e.target.files[0], 'govtId')} />
                              {!formData.govtIdFile ? (
                                 <div className="upload-content">
                                    <div className="upload-icon"><i className="fas fa-id-card"></i></div>
                                    <div className="upload-text">Click or drag to upload government ID</div>
                                    <div className="upload-hint">Voter's Card, Driver's License, National ID, or International Passport<br />JPEG, PNG, or PDF, max 10MB</div>
                                 </div>
                              ) : (
                                 <div className="upload-preview show">
                                    <div className="preview-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
                                       <i className="fas fa-file-alt" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
                                    </div>
                                    <div className="preview-info">
                                       <div className="preview-name">{formData.govtIdFile.name}</div>
                                       <div className="preview-size">{(formData.govtIdFile.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                    <button className="preview-remove" onClick={e => removeFile('govtId', e)}>
                                       <i className="fas fa-times"></i>
                                    </button>
                                 </div>
                              )}
                           </div>
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.govtIdFile}</span>
                        </div>
                     </div>
                  </div>
                  <div className="form-actions">
                     <button className="btn btn-secondary" onClick={prevStep}><i className="fas fa-arrow-left"></i> Back</button>
                     <button className="btn btn-primary" onClick={nextStep}>Continue <i className="fas fa-arrow-right"></i></button>
                  </div>
               </div>

               {/* STEP 4: Declaration & Signature */}
               <div className={`step-content ${currentStep === 4 ? 'active' : ''}`}>
                  <div className="form-header">
                     <h2><i className="fas fa-file-signature" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i>Declaration & Signature</h2>
                     <p>Review the declaration and provide your electronic signature.</p>
                  </div>
                  <div className="form-body">
                     <div className="form-grid full-width">
                        <div className={`form-group ${errors.declarationName ? 'error' : ''}`}>
                           <label className="required">Full Name for Declaration</label>
                           <input type="text" value={formData.declarationName} onChange={e => handleChange('declarationName', e.target.value)} placeholder="Enter your full name as it appears above" />
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.declarationName}</span>
                        </div>
                        <div className="form-group full-width">
                           <label>Declaration Statement</label>
                           <div className="declaration-box">
                              I, <strong>{formData.declarationName || '____________________'}</strong>, hereby declare that the information provided is true and correct to the best of my knowledge. I agree to abide by the rules, regulations, and constitution of MARCAIN Cooperative. I understand that any false declaration may result in the rejection of my application or termination of my membership.
                           </div>
                        </div>
                        <div className={`form-group full-width ${errors.signature ? 'error' : ''}`}>
                           <label className="required">Electronic Signature</label>
                           <div className="signature-container">
                              <canvas className="signature-pad" ref={canvasRef}
                                 onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing}
                                 onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}></canvas>
                              <div className="signature-actions">
                                 <button className="btn-icon" onClick={clearSignature}><i className="fas fa-eraser"></i> Clear</button>
                              </div>
                           </div>
                           <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.signature}</span>
                        </div>
                        <div className="form-group">
                           <label className="required">Date</label>
                           <input type="date" value={formData.declarationDate} readOnly />
                        </div>
                     </div>
                  </div>
                  {submitError && (
                     <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
                        <i className="fas fa-exclamation-triangle"></i> {submitError}
                     </div>
                  )}
                  <div className="form-actions">
                     <button className="btn btn-secondary" onClick={prevStep}><i className="fas fa-arrow-left"></i> Back</button>
                     <button className="btn btn-success" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-check-circle"></i> Submit Application</>}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}


// ==================== GALLERY ====================
function GalleryPage() {
   const images = [
      { title: 'Annual General Meeting 2025', category: 'Events', src: '/images/meeting.png' },
      { title: 'Cooperative Training Workshop', category: 'Training', src: '/images/workshop.png' },
      { title: 'Community Outreach Program', category: 'Community', src: '/images/community.png' },
      { title: 'Board of Directors Meeting', category: 'Governance', src: '/images/board.png' },
      { title: 'Member Welfare Distribution', category: 'Welfare', src: '/images/welfare1.png' },
      { title: 'Financial Literacy Seminar', category: 'Training', src: '/images/seminar.png' }
   ];
   return (
      <div>
         <div className="page-hero"><div className="page-hero-overlay"></div>
            <div className="page-hero-content"><h1>Gallery</h1>
               <div className="breadcrumb"><span onClick={() => window.scrollTo(0, 0)} style={{ cursor: 'pointer' }}>Home</span><span className="breadcrumb-sep">|</span><span>Gallery</span></div>
            </div>
         </div>
         <div className="gold-accent-line"></div>
         <div className="page-container">
            <h1 className="page-title">Gallery</h1><div className="accent-line center"></div>
            <div className="gallery-grid">
               {images.map((img, i) => (
                  <div key={i} className="gallery-card">
                     <div className="gallery-image-wrapper">
                        <img src={img.src} alt={img.title} className="gallery-img" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        <div className="gallery-placeholder" style={{ display: 'none' }}><span>📷</span></div>
                     </div>
                     <div className="gallery-info"><h3>{img.title}</h3><span className="gallery-category">{img.category}</span></div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

// ==================== CONTACT ====================
function ContactPage() {
   return (
      <div className="page-container">
         <h1 className="page-title">Contact Us</h1><div className="accent-line center"></div>
         <div className="contact-grid">
            <div className="contact-info">
               <h2>Get in Touch</h2>
               <p>We'd love to hear from you. Reach out to us through any of the channels below.</p>
               <div className="contact-item"><span className="contact-icon">📍</span><div><h4>Address</h4><p>14 Kayode Lawal Crescent By Fagbile Estate Off Isheri-Jegun-Jakande Road, Isheri Oshun Rd, Lagos</p></div></div>
               <div className="contact-item"><span className="contact-icon">📞</span><div><h4>Phone</h4><p>080123456789, 080234567899</p></div></div>
               <div className="contact-item"><span className="contact-icon">✉️</span><div><h4>Email</h4><p>info@maincoop.org</p></div></div>
               <div className="contact-item"><span className="contact-icon">🌐</span><div><h4>Website</h4><p>www.marcaincoop.com</p></div></div>
            </div>
            <div className="contact-form-card">
               <h3>Send us a Message</h3>
               <form className="contact-form" onSubmit={e => e.preventDefault()}>
                  <div className="form-group"><label>Full Name</label><input type="text" placeholder="Enter your name" /></div>
                  <div className="form-group"><label>Email Address</label><input type="email" placeholder="Enter your email" /></div>
                  <div className="form-group"><label>Phone Number</label><input type="tel" placeholder="Enter your phone" /></div>
                  <div className="form-group"><label>Message</label><textarea placeholder="How can we help you?" rows="4"></textarea></div>
                  <button type="submit" className="btn-primary full">Send Message</button>
               </form>
            </div>
         </div>
      </div>
   );
}

// ==================== PORTAL / ADMIN DASHBOARD ====================
function PortalPage() {
   const [role, setRole] = useState('');
   const [loggedIn, setLoggedIn] = useState(false);
   const [activeTab, setActiveTab] = useState('applications');
   const [user, setUser] = useState(null);
   const [loginEmail, setLoginEmail] = useState('');
   const [loginPassword, setLoginPassword] = useState('');
   const [selectedRole, setSelectedRole] = useState('');
   const [loginError, setLoginError] = useState('');
   const [loginLoading, setLoginLoading] = useState(false);
   const [applications, setApplications] = useState([]);
   const [members] = useState([]);
   const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('');
   const [reviewingApp, setReviewingApp] = useState(null);
   const [statusNote, setStatusNote] = useState('');
   const [updatingStatus, setUpdatingStatus] = useState(false);
   const [socket, setSocket] = useState(null);

   const statusColors = {
      'Submitted': '#d69e2e',
      'Under Staff Verification': '#3182ce',
      'Verified by Staff': '#805ad5',
      'Reviewed by Secretary': '#38a169',
      'Awaiting Chairman Approval': '#dd6b20',
      'Approved': '#38a169',
      'Declined': '#e53e3e'
   };

   const statusLabels = {
      'Submitted': 'Submitted',
      'Under Staff Verification': 'Staff Verification',
      'Verified by Staff': 'Verified',
      'Reviewed by Secretary': 'Secretary Review',
      'Awaiting Chairman Approval': 'Chairman Approval',
      'Approved': 'Approved',
      'Declined': 'Declined'
   };

   const roleConfig = {
      'Admin': { title: 'System Administrator', emailHint: 'admin@marcaincoop.com', color: '#2c5282', icon: '🔧', description: 'Full access to all applications and system settings' },
      'Secretary': { title: 'Cooperative Secretary', emailHint: 'secretary@marcaincoop.com', color: '#805ad5', icon: '📝', description: 'Review verified applications and forward to Chairman' },
      'Chairman': { title: 'Cooperative Chairman', emailHint: 'chairman@marcaincoop.com', color: '#d4a843', icon: '👑', description: 'Final approval authority for all membership applications' },
      'Cooperative Staff': { title: 'Cooperative Staff', emailHint: 'staff@marcaincoop.com', color: '#3182ce', icon: '👤', description: 'Initial verification of submitted applications' }
   };

   useEffect(() => {
      const token = localStorage.getItem('marcain_token');
      if (token) {
         getMe().then(result => {
            if (result.success) {
               setUser(result.data);
               setRole(result.data.role);
               setLoggedIn(true);
            } else {
               localStorage.removeItem('marcain_token');
            }
         });
      }
   }, []);

   useEffect(() => {
      if (!loggedIn) return;
      fetchApplications();
      fetchStats();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [loggedIn, activeTab]);

   useEffect(() => {
      if (!loggedIn) return;
      const newSocket = io('http://localhost:5000');
      const token = localStorage.getItem('marcain_token');
      newSocket.emit('join-admin', { token });
      newSocket.on('new-application', (data) => { fetchApplications(); fetchStats(); });
      newSocket.on('status-update', (data) => { fetchApplications(); fetchStats(); });
      setSocket(newSocket);
      return () => newSocket.close();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [loggedIn]);

   const fetchApplications = async () => {
      setLoading(true); setError('');
      try {
         const params = {};
         if (statusFilter) params.status = statusFilter;
         if (searchTerm) params.search = searchTerm;
         const result = await getApplications(params);
         if (result.success) { setApplications(result.data || []); }
         else { setError(result.error || 'Failed to load applications'); }
      } catch (err) { setError('Network error. Please check your connection.'); }
      finally { setLoading(false); }
   };

   const fetchStats = async () => {
      try { const result = await getStats(); if (result.success) setStats(result.data); }
      catch (err) { console.error('Stats error:', err); }
   };

   const handleLogin = async (e) => {
      e.preventDefault(); setLoginError(''); setLoginLoading(true);
      try {
         const result = await loginUser(loginEmail, loginPassword);
         if (result.success) {
            if (selectedRole && result.data.role !== selectedRole) {
               setLoginError(`This account is registered as "${result.data.role}", not "${selectedRole}". Please select the correct role.`);
               setLoginLoading(false); return;
            }
            localStorage.setItem('marcain_token', result.token);
            setUser(result.data); setRole(result.data.role); setLoggedIn(true);
         } else { setLoginError(result.error || 'Login failed. Please check your credentials.'); }
      } catch (err) { setLoginError('Network error. Please check your connection and try again.'); }
      finally { setLoginLoading(false); }
   };

   const handleLogout = () => {
      localStorage.removeItem('marcain_token');
      if (socket) socket.close();
      setLoggedIn(false); setRole(''); setUser(null); setApplications([]);
      setActiveTab('applications'); setLoginEmail(''); setLoginPassword(''); setSelectedRole('');
   };

   const handleStatusUpdate = async (appId, newStatus) => {
      setUpdatingStatus(true);
      try {
         const result = await updateStatus(appId, newStatus, statusNote);
         if (result.success) { setReviewingApp(null); setStatusNote(''); fetchApplications(); fetchStats(); }
         else { setError(result.error || 'Failed to update status'); }
      } catch (err) { setError('Network error during status update'); }
      finally { setUpdatingStatus(false); }
   };

   const getNextStatuses = (currentStatus) => {
      const flows = {
         'Cooperative Staff': { 'Submitted': ['Under Staff Verification', 'Declined'], 'Under Staff Verification': ['Verified by Staff', 'Declined'] },
         'Secretary': { 'Verified by Staff': ['Reviewed by Secretary', 'Declined'] },
         'Chairman': { 'Awaiting Chairman Approval': ['Approved', 'Declined'] },
         'Admin': { 'Submitted': ['Under Staff Verification', 'Declined'], 'Under Staff Verification': ['Verified by Staff', 'Declined'], 'Verified by Staff': ['Reviewed by Secretary', 'Declined'], 'Reviewed by Secretary': ['Awaiting Chairman Approval', 'Declined'], 'Awaiting Chairman Approval': ['Approved', 'Declined'] }
      };
      return flows[role]?.[currentStatus] || [];
   };

   const getDashboardTitle = () => {
      switch (role) {
         case 'Cooperative Staff': return 'Staff Verification Dashboard';
         case 'Secretary': return 'Secretary Review Dashboard';
         case 'Chairman': return 'Chairman Final Approval Dashboard';
         case 'Admin': return 'Admin Dashboard - All Applications';
         default: return 'Applications';
      }
   };

   const getFilteredApplications = () => {
      if (role === 'Admin') return applications;
      const roleStatuses = { 'Cooperative Staff': ['Submitted', 'Under Staff Verification'], 'Secretary': ['Verified by Staff'], 'Chairman': ['Awaiting Chairman Approval'] };
      const allowed = roleStatuses[role] || [];
      return applications.filter(app => allowed.includes(app.status));
   };

   if (!loggedIn) {
      return (
         <div className="portal-login" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a0a3e 0%, #2d1b5e 100%)', padding: '2rem' }}>
            <div style={{ maxWidth: '500px', width: '100%', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
               <div style={{ background: '#1a0a3e', padding: '2rem', textAlign: 'center', color: 'white' }}>
                  <img src="/Marcainlogo.png" alt="MARCAIN" style={{ height: '60px', marginBottom: '1rem' }} />
                  <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>MARCAIN Portal</h2>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Select your role to login</p>
               </div>
               <div style={{ padding: '2rem' }}>
                  {!selectedRole ? (
                     <div>
                        <p style={{ textAlign: 'center', color: '#4a5568', marginBottom: '1.5rem', fontWeight: '600' }}>Choose your access level:</p>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                           {Object.entries(roleConfig).map(([roleKey, config]) => (
                              <button key={roleKey} onClick={() => setSelectedRole(roleKey)}
                                 style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', borderRadius: '12px', border: `2px solid ${config.color}30`, background: `${config.color}08`, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%' }}
                                 onMouseOver={e => { e.currentTarget.style.borderColor = config.color; e.currentTarget.style.background = `${config.color}15`; e.currentTarget.style.transform = 'translateX(5px)'; }}
                                 onMouseOut={e => { e.currentTarget.style.borderColor = `${config.color}30`; e.currentTarget.style.background = `${config.color}08`; e.currentTarget.style.transform = 'translateX(0)'; }}>
                                 <span style={{ fontSize: '2rem', marginRight: '1rem' }}>{config.icon}</span>
                                 <div>
                                    <div style={{ fontWeight: '700', color: config.color, fontSize: '1.1rem' }}>{config.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.25rem' }}>{config.description}</div>
                                 </div>
                                 <span style={{ marginLeft: 'auto', fontSize: '1.5rem', color: config.color }}>→</span>
                              </button>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div>
                        <button onClick={() => { setSelectedRole(''); setLoginError(''); }}
                           style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>← Back to roles</button>
                        <div style={{ background: `${roleConfig[selectedRole].color}15`, border: `2px solid ${roleConfig[selectedRole].color}30`, borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                           <span style={{ fontSize: '3rem' }}>{roleConfig[selectedRole].icon}</span>
                           <h3 style={{ margin: '0.5rem 0 0.25rem 0', color: roleConfig[selectedRole].color }}>{roleConfig[selectedRole].title}</h3>
                           <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096' }}>{roleConfig[selectedRole].description}</p>
                        </div>
                        <form onSubmit={handleLogin}>
                           {loginError && (
                              <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚠️ {loginError}</div>
                           )}
                           <div style={{ marginBottom: '1rem' }}>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568', fontSize: '0.9rem' }}>Email Address</label>
                              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder={roleConfig[selectedRole].emailHint} required
                                 style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem', transition: 'border-color 0.2s' }}
                                 onFocus={e => e.target.style.borderColor = roleConfig[selectedRole].color} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#a0aec0' }}>Default: {roleConfig[selectedRole].emailHint}</p>
                           </div>
                           <div style={{ marginBottom: '1.5rem' }}>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568', fontSize: '0.9rem' }}>Password</label>
                              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Enter your password" required
                                 style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem', transition: 'border-color 0.2s' }}
                                 onFocus={e => e.target.style.borderColor = roleConfig[selectedRole].color} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#a0aec0' }}>Default password: {selectedRole === 'Admin' ? 'Admin@2026' : selectedRole === 'Secretary' ? 'Secretary@2026' : selectedRole === 'Chairman' ? 'Chairman@2026' : 'Staff@2026'}</p>
                           </div>
                           <button type="submit" disabled={loginLoading}
                              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', background: roleConfig[selectedRole].color, color: 'white', fontWeight: '700', fontSize: '1rem', cursor: loginLoading ? 'not-allowed' : 'pointer', opacity: loginLoading ? 0.7 : 1, transition: 'transform 0.2s, box-shadow 0.2s' }}
                              onMouseOver={e => { if (!loginLoading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)'; } }}
                              onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
                              {loginLoading ? <span>⏳ Logging in...</span> : <span>🔐 Login as {roleConfig[selectedRole].title}</span>}
                           </button>
                        </form>
                     </div>
                  )}
               </div>
               <div style={{ padding: '1rem 2rem', background: '#f7fafc', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#718096' }}>MARCAIN Cooperative Society © 2026</p>
               </div>
            </div>
         </div>
      );
   }

   const filteredApps = getFilteredApplications();

   return (
      <div className="portal-dashboard">
         <div className="portal-sidebar">
            <div className="portal-brand">
               <img src="/Marcainlogo.png" alt="MARCAIN Portal" className="portal-sidebar-logo-img" />
               <span>MARCAIN Portal</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', background: `${roleConfig[role]?.color || '#2c5282'}20`, borderLeft: `4px solid ${roleConfig[role]?.color || '#2c5282'}`, margin: '0.5rem 1rem', borderRadius: '0 8px 8px 0' }}>
               <div style={{ fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase', fontWeight: '600' }}>Logged in as</div>
               <div style={{ fontWeight: '700', color: roleConfig[role]?.color || '#2c5282', fontSize: '0.9rem' }}>{roleConfig[role]?.title || role}</div>
               <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '0.25rem' }}>{user?.name}</div>
            </div>
            <nav className="portal-nav">
               <button onClick={() => setActiveTab('applications')} className={activeTab === 'applications' ? 'active' : ''}>📋 Applications</button>
               {role !== 'Applicant' && (<button onClick={() => setActiveTab('members')} className={activeTab === 'members' ? 'active' : ''}>👥 Members Register</button>)}
               <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>👤 Profile</button>
               <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
            </nav>
         </div>
         <div className="portal-content">
            {error && (<div style={{ padding: '0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>)}
            {activeTab === 'applications' && (
               <div>
                  <h2 className="portal-title">{getDashboardTitle()}</h2>
                  <div className="stats-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                     <div className="stat-box" style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c5282' }}>{stats.totalApplications || 0}</div><div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>Total Applications</div>
                     </div>
                     <div className="stat-box" style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d69e2e' }}>{stats.pending || 0}</div><div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>Pending</div>
                     </div>
                     <div className="stat-box" style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dd6b20' }}>{stats.forApproval || 0}</div><div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>For Approval</div>
                     </div>
                     <div className="stat-box" style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38a169' }}>{stats.approved || 0}</div><div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>Approved</div>
                     </div>
                     <div className="stat-box" style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e53e3e' }}>{stats.declined || 0}</div><div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>Declined</div>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                     <input type="text" placeholder="Search by name, ref, or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={e => e.key === 'Enter' && fetchApplications()}
                        style={{ flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.95rem' }} />
                     <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.95rem', minWidth: '150px' }}>
                        <option value="">All Statuses</option><option value="Submitted">Submitted</option><option value="Under Staff Verification">Under Staff Verification</option><option value="Verified by Staff">Verified by Staff</option><option value="Reviewed by Secretary">Reviewed by Secretary</option><option value="Awaiting Chairman Approval">Awaiting Chairman Approval</option><option value="Approved">Approved</option><option value="Declined">Declined</option>
                     </select>
                     <button onClick={fetchApplications} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>🔍 Search</button>
                  </div>
                  <div className="table-card" style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                     {loading ? (<div style={{ textAlign: 'center', padding: '3rem' }}><p>Loading applications...</p></div>) : (
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                           <thead><tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Ref</th>
                              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Applicant</th>
                              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Phone</th>
                              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>State/LGA</th>
                              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Submitted</th>
                              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Status</th>
                              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Action</th>
                           </tr></thead>
                           <tbody>
                              {filteredApps.length === 0 ? (
                                 <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div><p>No applications found at your review stage.</p><p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Applications will appear here when they reach your approval level.</p>
                                 </td></tr>
                              ) : (filteredApps.map(app => (
                                 <tr key={app._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600', color: '#2c5282', fontSize: '0.9rem' }}>{app.applicationRef}</td>
                                    <td style={{ padding: '1rem' }}><div style={{ fontWeight: '600', color: '#2d3748' }}>{app.surname} {app.firstName}</div><div style={{ fontSize: '0.85rem', color: '#718096' }}>{app.email}</div></td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#4a5568' }}>{app.phone}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#4a5568' }}>{app.state}<br /><span style={{ fontSize: '0.8rem', color: '#718096' }}>{app.lga}</span></td>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#718096' }}>{new Date(app.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td style={{ padding: '1rem' }}><span style={{ display: 'inline-block', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: (statusColors[app.status] || '#666') + '20', color: statusColors[app.status] || '#666' }}>{statusLabels[app.status] || app.status}</span></td>
                                    <td style={{ padding: '1rem' }}><button onClick={() => setReviewingApp(app)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Review</button></td>
                                 </tr>
                              )))}
                           </tbody>
                        </table>
                     )}
                  </div>
               </div>
            )}
            {reviewingApp && (
               <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                  <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '700px', width: '90%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f7fafc', paddingBottom: '1rem' }}>
                        <div><h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.25rem' }}>Review Application</h3><p style={{ margin: '0.25rem 0 0 0', color: '#718096', fontSize: '0.85rem' }}>{reviewingApp.applicationRef}</p></div>
                        <button onClick={() => { setReviewingApp(null); setStatusNote(''); }} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#718096', padding: '0.5rem', borderRadius: '50%' }}>✕</button>
                     </div>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: '#f7fafc', padding: '1rem', borderRadius: '8px' }}><p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase' }}>Full Name</p><p style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>{reviewingApp.surname} {reviewingApp.firstName} {reviewingApp.otherName}</p></div>
                        <div style={{ background: '#f7fafc', padding: '1rem', borderRadius: '8px' }}><p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase' }}>Email</p><p style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>{reviewingApp.email}</p></div>
                        <div style={{ background: '#f7fafc', padding: '1rem', borderRadius: '8px' }}><p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase' }}>Phone</p><p style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>{reviewingApp.phone}</p></div>
                        <div style={{ background: '#f7fafc', padding: '1rem', borderRadius: '8px' }}><p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase' }}>State / LGA</p><p style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>{reviewingApp.state} / {reviewingApp.lga}</p></div>
                        <div style={{ background: '#f7fafc', padding: '1rem', borderRadius: '8px' }}><p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase' }}>Occupation</p><p style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>{reviewingApp.occupation} ({reviewingApp.employmentType})</p></div>
                        <div style={{ background: '#f7fafc', padding: '1rem', borderRadius: '8px' }}><p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase' }}>Date of Birth</p><p style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>{new Date(reviewingApp.dob).toLocaleDateString('en-GB')}</p></div>
                     </div>
                     <div style={{ background: '#fffaf0', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '4px solid #d69e2e' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#d69e2e', textTransform: 'uppercase', fontWeight: '600' }}>Nominator</p>
                        <p style={{ margin: 0, color: '#2d3748' }}><strong>{reviewingApp.nominatorName}</strong> — {reviewingApp.nominatorPhone}</p>
                     </div>
                     {reviewingApp.passportPhotoUrl && (
                        <div style={{ marginBottom: '1.5rem' }}>
                           <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Passport Photo</p>
                           <img src={`http://localhost:5000${reviewingApp.passportPhotoUrl}`} alt="Passport" style={{ maxWidth: '120px', borderRadius: '8px', border: '2px solid #e2e8f0' }} />
                        </div>
                     )}
                     <div style={{ background: (statusColors[reviewingApp.status] || '#666') + '15', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: `2px solid ${statusColors[reviewingApp.status] || '#666'}40` }}>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase' }}>Current Status</p>
                        <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem', color: statusColors[reviewingApp.status] || '#666' }}>{reviewingApp.status}</p>
                     </div>
                     {reviewingApp.statusHistory && reviewingApp.statusHistory.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                           <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Status History</p>
                           <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                              {reviewingApp.statusHistory.map((h, i) => (
                                 <div key={i} style={{ padding: '0.5rem', marginBottom: '0.25rem', background: '#f7fafc', borderRadius: '6px', fontSize: '0.85rem' }}>
                                    <span style={{ fontWeight: '600', color: '#2c5282' }}>{h.status}</span>
                                    <span style={{ color: '#718096', marginLeft: '0.5rem' }}>by {h.updatedBy}</span>
                                    <span style={{ color: '#a0aec0', marginLeft: '0.5rem', fontSize: '0.75rem' }}>{new Date(h.updatedAt).toLocaleDateString('en-GB')}</span>
                                    {h.note && <p style={{ margin: '0.25rem 0 0 0', color: '#718096', fontStyle: 'italic' }}>Note: {h.note}</p>}
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                     {getNextStatuses(reviewingApp.status).length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                           <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Update Status:</p>
                           <textarea placeholder="Add a note or reason for this decision (required for Decline)..." value={statusNote} onChange={e => setStatusNote(e.target.value)}
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.9rem', minHeight: '80px', resize: 'vertical' }} />
                           <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                              {getNextStatuses(reviewingApp.status).map(s => (
                                 <button key={s} onClick={() => { if (s === 'Declined' && !statusNote.trim()) { alert('Please provide a reason for declining this application.'); return; } handleStatusUpdate(reviewingApp._id, s); }} disabled={updatingStatus}
                                    style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '0.9rem', cursor: updatingStatus ? 'not-allowed' : 'pointer', opacity: updatingStatus ? 0.6 : 1, background: s === 'Declined' ? '#e53e3e' : s === 'Approved' ? '#38a169' : '#2c5282', color: 'white' }}>
                                    {updatingStatus ? '⏳ Processing...' : s === 'Declined' ? '❌ Decline' : s === 'Approved' ? '✅ Approve' : `➡️ ${s}`}
                                 </button>
                              ))}
                           </div>
                           {getNextStatuses(reviewingApp.status).includes('Declined') && (<p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#e53e3e' }}>⚠️ A reason is required when declining an application.</p>)}
                        </div>
                     )}
                     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={() => { setReviewingApp(null); setStatusNote(''); }} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#4a5568', fontWeight: '600', cursor: 'pointer' }}>Close</button>
                     </div>
                  </div>
               </div>
            )}
            {activeTab === 'members' && role !== 'Applicant' && (
               <div>
                  <h2 className="portal-title">MARCAIN Cooperative Members Register</h2>
                  <div style={{ marginBottom: '1.5rem' }}>
                     <input type="text" placeholder="Search by name, ID, or phone..." className="search-input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0e0e0', width: '300px' }} />
                     <button className="search-btn" style={{ padding: '0.75rem 1.5rem', marginLeft: '0.5rem' }}>Search</button>
                  </div>
                  <div className="table-card" style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                     <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                           <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Membership ID</th>
                           <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Name</th>
                           <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Phone</th>
                           <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Email</th>
                           <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Status</th>
                        </tr></thead>
                        <tbody>
                           {members.length === 0 ? (
                              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                                 <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div><p>No members registered yet.</p><p style={{ fontSize: '0.9rem' }}>Approved applications will appear here.</p>
                              </td></tr>
                           ) : (members.map(m => (
                              <tr key={m.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                 <td style={{ padding: '1rem', fontWeight: '600', color: '#2c5282' }}>{m.id}</td>
                                 <td style={{ padding: '1rem' }}>{m.name}</td>
                                 <td style={{ padding: '1rem' }}>{m.phone}</td>
                                 <td style={{ padding: '1rem' }}>{m.email}</td>
                                 <td style={{ padding: '1rem' }}><span style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: (statusColors[m.status] || '#666') + '20', color: statusColors[m.status] || '#666' }}>{m.status}</span></td>
                              </tr>
                           )))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
            {activeTab === 'profile' && (
               <div style={{ background: '#fff', borderRadius: '10px', padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h2 className="portal-title">My Profile</h2>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: roleConfig[role]?.color || '#2c5282', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                     {user?.name?.split(' ').map(n => n[0]).join('') || role[0]}
                  </div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#2d3748' }}>{user?.name || role}</h3>
                  <p style={{ color: roleConfig[role]?.color || '#2c5282', fontWeight: '600', marginBottom: '1.5rem' }}>{roleConfig[role]?.title || role}</p>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f7fafc' }}><span style={{ color: '#718096' }}>Email</span><span style={{ fontWeight: '600', color: '#2d3748' }}>{user?.email || 'N/A'}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f7fafc' }}><span style={{ color: '#718096' }}>Role</span><span style={{ fontWeight: '600', color: '#2d3748' }}>{user?.role || role}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f7fafc' }}><span style={{ color: '#718096' }}>Member Since</span><span style={{ fontWeight: '600', color: '#2d3748' }}>2026</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}><span style={{ color: '#718096' }}>Last Login</span><span style={{ fontWeight: '600', color: '#2d3748' }}>{new Date().toLocaleString()}</span></div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}


// ==================== ATTENDANCE PORTAL (NEW) ====================
function AttendancePortal() {
   const [currentPage, setCurrentPage] = useState('dashboard');
   const [currentMeetingId, setCurrentMeetingId] = useState(null);
   const [tempAttendance, setTempAttendance] = useState({});
   const [searchMember, setSearchMember] = useState('');
   const [filterStatus, setFilterStatus] = useState('all');
   const [modalOpen, setModalOpen] = useState(false);
   const [modalTitle, setModalTitle] = useState('');
   const [modalBody, setModalBody] = useState(null);
   const [toastMessages, setToastMessages] = useState([]);
   const [returnReason, setReturnReason] = useState('');
   const [showReturnModal, setShowReturnModal] = useState(false);
   const [returnMeetingId, setReturnMeetingId] = useState(null);
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [chairmanTab, setChairmanTab] = useState('pending');
   const [penaltyTab, setPenaltyTab] = useState('pending');
   const [membersSearch, setMembersSearch] = useState('');

   // Demo data store
   const [store, setStore] = useState({
      currentUser: { name: 'John Doe', role: 'Chairman', initials: 'JD' },
      members: [
         { id: 'MC001', name: 'James Wilson', phone: '+234 801 234 5678', status: 'Active Member', photo: null, joinDate: '2020-03-15' },
         { id: 'MC002', name: 'Sarah Johnson', phone: '+234 802 345 6789', status: 'Active Member', photo: null, joinDate: '2020-05-20' },
         { id: 'MC003', name: 'Michael Brown', phone: '+234 803 456 7890', status: 'Active Member', photo: null, joinDate: '2020-07-10' },
         { id: 'MC004', name: 'Emily Davis', phone: '+234 804 567 8901', status: 'Active Member', photo: null, joinDate: '2021-01-12' },
         { id: 'MC005', name: 'Robert Taylor', phone: '+234 805 678 9012', status: 'Active Member', photo: null, joinDate: '2021-03-25' },
         { id: 'MC006', name: 'Lisa Anderson', phone: '+234 806 789 0123', status: 'Active Member', photo: null, joinDate: '2021-06-18' },
         { id: 'MC007', name: 'David Thomas', phone: '+234 807 890 1234', status: 'Suspended', photo: null, joinDate: '2020-09-05' },
         { id: 'MC008', name: 'Jennifer Martinez', phone: '+234 808 901 2345', status: 'Withdrawn', photo: null, joinDate: '2020-11-30' },
         { id: 'MC009', name: 'William Garcia', phone: '+234 809 012 3456', status: 'Terminated', photo: null, joinDate: '2021-02-14' },
         { id: 'MC010', name: 'Patricia Lee', phone: '+234 810 123 4567', status: 'Pending Applicant', photo: null, joinDate: '2023-01-10' },
         { id: 'MC011', name: 'Charles Robinson', phone: '+234 811 234 5678', status: 'Active Member', photo: null, joinDate: '2021-08-22' },
         { id: 'MC012', name: 'Margaret Clark', phone: '+234 812 345 6789', status: 'Active Member', photo: null, joinDate: '2021-10-05' },
         { id: 'MC013', name: 'Joseph Rodriguez', phone: '+234 813 456 7890', status: 'Active Member', photo: null, joinDate: '2022-01-15' },
         { id: 'MC014', name: 'Susan Lewis', phone: '+234 814 567 8901', status: 'Active Member', photo: null, joinDate: '2022-03-20' },
         { id: 'MC015', name: 'Thomas Walker', phone: '+234 815 678 9012', status: 'Deceased', photo: null, joinDate: '2020-04-10' }
      ],
      meetings: [
         { id: 'M001', title: 'Monthly General Meeting - June 2026', type: 'Monthly General Meeting', date: '2026-06-28', time: '10:00 AM', venue: 'Marcain Cooperative Hall, Main Branch', mode: 'Physical', createdBy: 'Jane Smith', status: 'Attendance Being Taken', attendance: {}, submitted: false, approved: false, returned: false },
         { id: 'M002', title: 'Emergency Meeting - Budget Review', type: 'Emergency Meeting', date: '2026-06-15', time: '2:00 PM', venue: 'Online - Zoom', mode: 'Online', createdBy: 'John Doe', status: 'Approved Official Attendance Record', attendance: { 'MC001': 'Present', 'MC002': 'Present', 'MC003': 'Absent', 'MC004': 'Late', 'MC005': 'Present', 'MC006': 'Excused' }, submitted: true, approved: true, approvedBy: 'John Doe', approvedDate: '2026-06-15', returned: false },
         { id: 'M003', title: 'Annual General Meeting 2026', type: 'Annual General Meeting', date: '2026-05-20', time: '9:00 AM', venue: 'City Conference Center', mode: 'Hybrid', createdBy: 'Jane Smith', status: 'Approved Official Attendance Record', attendance: { 'MC001': 'Present', 'MC002': 'Present', 'MC003': 'Present', 'MC004': 'Present', 'MC005': 'Late', 'MC006': 'Present', 'MC011': 'Present', 'MC012': 'Absent', 'MC013': 'Present', 'MC014': 'Excused' }, submitted: true, approved: true, approvedBy: 'John Doe', approvedDate: '2026-05-20', returned: false },
         { id: 'M004', title: 'Committee Meeting - Finance', type: 'Committee Meeting', date: '2026-06-10', time: '11:00 AM', venue: 'Finance Office', mode: 'Physical', createdBy: 'Jane Smith', status: 'Returned for Correction', attendance: { 'MC001': 'Present', 'MC002': 'Present', 'MC003': 'Present' }, submitted: true, approved: false, returned: true, returnReason: 'Missing arrival times for 2 members' }
      ],
      auditTrail: [
         { action: 'Meeting Created', user: 'Jane Smith', time: '2026-06-25 09:15', detail: 'Created "Monthly General Meeting - June 2026"', type: 'create' },
         { action: 'Attendance Marked', user: 'Jane Smith', time: '2026-06-28 10:05', detail: 'Marked James Wilson (MC001) as Present', type: 'mark' },
         { action: 'Attendance Marked', user: 'Jane Smith', time: '2026-06-28 10:07', detail: 'Marked Sarah Johnson (MC002) as Present', type: 'mark' },
         { action: 'Attendance Submitted', user: 'Jane Smith', time: '2026-06-15 14:30', detail: 'Submitted attendance for Emergency Meeting to Chairman', type: 'submit' },
         { action: 'Attendance Approved', user: 'John Doe', time: '2026-06-15 15:00', detail: 'Approved Emergency Meeting attendance record', type: 'approve' },
         { action: 'Attendance Returned', user: 'John Doe', time: '2026-06-10 12:00', detail: 'Returned Committee Meeting attendance for correction: Missing arrival times', type: 'correct' },
         { action: 'Attendance Approved', user: 'John Doe', time: '2026-05-20 11:30', detail: 'Approved Annual General Meeting 2026 attendance', type: 'approve' }
      ],
      notifications: [
         { title: 'Attendance Submitted for Review', message: 'Jane Smith submitted attendance for Monthly General Meeting - June 2026', time: '10 minutes ago', read: false, type: 'submit' },
         { title: 'Meeting Reminder', message: 'Monthly General Meeting - June 2026 is scheduled for June 28, 2026 at 10:00 AM', time: '2 hours ago', read: false, type: 'reminder' },
         { title: 'Attendance Approved', message: 'Your attendance for Emergency Meeting has been approved by Chairman', time: '1 day ago', read: false, type: 'approve' },
         { title: 'Penalty Notice', message: 'You have been marked absent for 3 consecutive meetings. Penalty review pending.', time: '3 days ago', read: true, type: 'penalty' }
      ],
      penalties: [
         { memberId: 'MC003', memberName: 'Michael Brown', type: 'Absent without excuse', meetings: 3, amount: 5000, status: 'Pending Confirmation', date: '2026-06-20' },
         { memberId: 'MC012', memberName: 'Margaret Clark', type: 'Repeated absence', meetings: 5, amount: 10000, status: 'Confirmed', date: '2026-05-25' },
         { memberId: 'MC005', memberName: 'Robert Taylor', type: 'Late arrival', meetings: 4, amount: 2000, status: 'Pending Confirmation', date: '2026-06-18' }
      ]
   });

   const getActiveMembers = () => store.members.filter(m => m.status === 'Active Member');

   const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

   const showToast = (message, type = 'success') => {
      const id = Date.now();
      setToastMessages(prev => [...prev, { id, message, type }]);
      setTimeout(() => setToastMessages(prev => prev.filter(t => t.id !== id)), 3000);
   };

   const getStatusBadge = (status) => {
      const map = {
         'Present': { class: 'att-badge-present', label: 'Present' },
         'Absent': { class: 'att-badge-absent', label: 'Absent' },
         'Late': { class: 'att-badge-late', label: 'Late' },
         'Excused': { class: 'att-badge-excused', label: 'Excused' },
         'Online Attendance': { class: 'att-badge-online', label: 'Online' },
         'Active Member': { class: 'att-badge-active', label: 'Active' },
         'Pending Applicant': { class: 'att-badge-pending', label: 'Pending' },
         'Approved Official Attendance Record': { class: 'att-badge-approved', label: 'Approved' }
      };
      const badge = map[status] || { class: 'att-badge-status', label: status };
      return <span className={`att-badge ${badge.class}`}>{badge.label}</span>;
   };

   const handleCreateMeeting = (e) => {
      e.preventDefault();
      const form = e.target;
      const newMeeting = {
         id: 'M' + String(store.meetings.length + 1).padStart(3, '0'),
         title: form.meetingTitle.value,
         type: form.meetingType.value,
         date: form.meetingDate.value,
         time: form.meetingTime.value,
         venue: form.meetingVenue.value,
         mode: form.meetingMode.value,
         createdBy: store.currentUser.name,
         status: 'Attendance List Generated',
         attendance: {},
         submitted: false,
         approved: false,
         returned: false
      };
      setStore(prev => ({
         ...prev,
         meetings: [newMeeting, ...prev.meetings],
         auditTrail: [{ action: 'Meeting Created', user: store.currentUser.name, time: new Date().toISOString().slice(0, 16).replace('T', ' '), detail: `Created "${newMeeting.title}"`, type: 'create' }, ...prev.auditTrail]
      }));
      showToast('Meeting created successfully! Attendance list generated from Active Members.', 'success');
      setCurrentPage('dashboard');
   };

   const openAttendance = (meetingId) => {
      const meeting = store.meetings.find(m => m.id === meetingId);
      setCurrentMeetingId(meetingId);
      setTempAttendance({ ...meeting.attendance });
      setCurrentPage('attendance-detail');
   };

   const markAttendance = (memberId, status) => {
      setTempAttendance(prev => ({ ...prev, [memberId]: status }));
      setStore(prev => ({
         ...prev,
         auditTrail: [{ action: 'Attendance Marked', user: store.currentUser.name, time: new Date().toISOString().slice(0, 16).replace('T', ' '), detail: `Marked ${memberId} as ${status}`, type: 'mark' }, ...prev.auditTrail]
      }));
      showToast(`Attendance marked: ${status}`, 'success');
   };

   const saveAttendance = () => {
      setStore(prev => ({
         ...prev,
         meetings: prev.meetings.map(m => m.id === currentMeetingId ? { ...m, attendance: { ...tempAttendance }, status: 'Attendance Saved' } : m)
      }));
      showToast('Attendance saved successfully!', 'success');
   };

   const submitAttendance = () => {
      setStore(prev => ({
         ...prev,
         meetings: prev.meetings.map(m => m.id === currentMeetingId ? { ...m, attendance: { ...tempAttendance }, submitted: true, status: 'Attendance Submitted - Awaiting Chairman Approval' } : m),
         auditTrail: [{ action: 'Attendance Submitted', user: store.currentUser.name, time: new Date().toISOString().slice(0, 16).replace('T', ' '), detail: `Submitted attendance for ${prev.meetings.find(me => me.id === currentMeetingId)?.title} to Chairman`, type: 'submit' }, ...prev.auditTrail]
      }));
      showToast('Attendance submitted to Chairman for approval!', 'success');
      setCurrentPage('take-attendance');
   };

   const approveAttendance = (meetingId) => {
      setStore(prev => ({
         ...prev,
         meetings: prev.meetings.map(m => m.id === meetingId ? { ...m, approved: true, approvedBy: store.currentUser.name, approvedDate: new Date().toISOString().slice(0, 10), status: 'Approved Official Attendance Record' } : m),
         auditTrail: [{ action: 'Attendance Approved', user: store.currentUser.name, time: new Date().toISOString().slice(0, 16).replace('T', ' '), detail: `Approved ${prev.meetings.find(me => me.id === meetingId)?.title} attendance record`, type: 'approve' }, ...prev.auditTrail]
      }));
      showToast('Attendance approved successfully! Record is now locked.', 'success');
   };

   const returnAttendance = (meetingId) => {
      setReturnMeetingId(meetingId);
      setShowReturnModal(true);
   };

   const confirmReturn = () => {
      if (!returnReason.trim()) { showToast('Please provide a reason for returning.', 'error'); return; }
      setStore(prev => ({
         ...prev,
         meetings: prev.meetings.map(m => m.id === returnMeetingId ? { ...m, returned: true, returnReason, status: 'Returned for Correction', submitted: false } : m),
         auditTrail: [{ action: 'Attendance Returned', user: store.currentUser.name, time: new Date().toISOString().slice(0, 16).replace('T', ' '), detail: `Returned ${prev.meetings.find(me => me.id === returnMeetingId)?.title} for correction: ${returnReason}`, type: 'correct' }, ...prev.auditTrail]
      }));
      showToast('Attendance returned for correction.', 'warning');
      setShowReturnModal(false);
      setReturnReason('');
      setReturnMeetingId(null);
   };

   const rejectAttendance = (meetingId) => {
      if (window.confirm('Are you sure you want to reject this attendance record? This action cannot be undone.')) {
         setStore(prev => ({
            ...prev,
            meetings: prev.meetings.map(m => m.id === meetingId ? { ...m, status: 'Rejected' } : m),
            auditTrail: [{ action: 'Attendance Rejected', user: store.currentUser.name, time: new Date().toISOString().slice(0, 16).replace('T', ' '), detail: `Rejected ${prev.meetings.find(me => me.id === meetingId)?.title} attendance record`, type: 'correct' }, ...prev.auditTrail]
         }));
         showToast('Attendance record rejected.', 'error');
      }
   };

   const viewRegister = (meetingId) => {
      const meeting = store.meetings.find(m => m.id === meetingId);
      const activeMembers = getActiveMembers();
      setModalTitle(`${meeting.title} - Official Register`);
      setModalBody(
         <div>
            <div className="att-success-box">
               <p><strong>Status:</strong> Approved Official Attendance Record<br />
                  <strong>Approved By:</strong> {meeting.approvedBy} on {formatDate(meeting.approvedDate)}<br />
                  <strong>Meeting:</strong> {meeting.type} | {formatDate(meeting.date)} | {meeting.time}</p>
            </div>
            <div className="att-table-container">
               <table className="att-data-table">
                  <thead><tr><th>Member ID</th><th>Member Name</th><th>Attendance Status</th><th>Arrival Time</th><th>Marked By</th></tr></thead>
                  <tbody>
                     {activeMembers.map(member => (
                        <tr key={member.id}>
                           <td>{member.id}</td>
                           <td>{member.name}</td>
                           <td>{getStatusBadge(meeting.attendance[member.id] || 'Not Recorded')}</td>
                           <td>{meeting.attendance[member.id] ? new Date().toLocaleTimeString() : 'N/A'}</td>
                           <td>Jane Smith</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      );
      setModalOpen(true);
   };

   const confirmPenalty = (memberId) => {
      setStore(prev => ({ ...prev, penalties: prev.penalties.map(p => p.memberId === memberId && p.status === 'Pending Confirmation' ? { ...p, status: 'Confirmed' } : p) }));
      const penalty = store.penalties.find(p => p.memberId === memberId);
      showToast(`Penalty confirmed for ${penalty?.memberName}`, 'success');
   };

   const waivePenalty = (memberId) => {
      setStore(prev => ({ ...prev, penalties: prev.penalties.map(p => p.memberId === memberId && p.status === 'Pending Confirmation' ? { ...p, status: 'Waived' } : p) }));
      const penalty = store.penalties.find(p => p.memberId === memberId);
      showToast(`Penalty waived for ${penalty?.memberName}`, 'info');
   };

   const navItems = [
      {
         section: 'Main', items: [
            { page: 'dashboard', label: 'Dashboard', icon: '📊' },
            { page: 'create-meeting', label: 'Create Meeting', icon: '➕' },
            { page: 'take-attendance', label: 'Take Attendance', icon: '✅' },
            { page: 'chairman-approval', label: 'Chairman Approval', icon: '👑' }
         ]
      },
      {
         section: 'Records', items: [
            { page: 'attendance-register', label: 'Official Register', icon: '📋' },
            { page: 'reports', label: 'Reports', icon: '📈' },
            { page: 'penalties', label: 'Penalties', icon: '⚠️' }
         ]
      },
      {
         section: 'Administration', items: [
            { page: 'audit-trail', label: 'Audit Trail', icon: '📜' },
            { page: 'members', label: 'Members Database', icon: '👥' },
            { page: 'notifications', label: 'Notifications', icon: '🔔' }
         ]
      }
   ];

   // ==================== RENDER PAGES ====================
   const renderDashboard = () => {
      const totalMembers = getActiveMembers().length;
      const totalMeetings = store.meetings.length;
      const pendingApproval = store.meetings.filter(m => m.submitted && !m.approved && !m.returned).length;
      const approvedRecords = store.meetings.filter(m => m.approved).length;

      return (
         <div>
            <div className="att-stats-grid">
               <div className="att-stat-card"><div className="att-stat-icon att-blue">👥</div><div className="att-stat-info"><h4>{totalMembers}</h4><p>Active Members</p></div></div>
               <div className="att-stat-card"><div className="att-stat-icon att-green">📅</div><div className="att-stat-info"><h4>{totalMeetings}</h4><p>Total Meetings</p></div></div>
               <div className="att-stat-card"><div className="att-stat-icon att-orange">⏳</div><div className="att-stat-info"><h4>{pendingApproval}</h4><p>Pending Approval</p></div></div>
               <div className="att-stat-card"><div className="att-stat-icon att-green">✅</div><div className="att-stat-info"><h4>{approvedRecords}</h4><p>Approved Records</p></div></div>
            </div>
            <div className="att-card">
               <div className="att-card-header"><h3>Recent Meetings</h3><button className="att-btn att-btn-primary att-btn-sm" onClick={() => setCurrentPage('create-meeting')}>+ Create Meeting</button></div>
               <div className="att-card-body">
                  <div className="att-table-container">
                     <table className="att-data-table">
                        <thead><tr><th>Meeting Title</th><th>Date</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                           {store.meetings.map(m => {
                              let actionBtn = null;
                              if (m.status === 'Attendance Being Taken') actionBtn = <button className="att-btn att-btn-primary att-btn-sm" onClick={() => openAttendance(m.id)}>Take Attendance</button>;
                              else if (m.submitted && !m.approved && !m.returned) actionBtn = <button className="att-btn att-btn-warning att-btn-sm" onClick={() => { setCurrentPage('chairman-approval'); }}>Review</button>;
                              else if (m.approved) actionBtn = <button className="att-btn att-btn-outline att-btn-sm" onClick={() => viewRegister(m.id)}>View Register</button>;
                              return (
                                 <tr key={m.id}>
                                    <td><strong>{m.title}</strong><br /><small style={{ color: 'var(--att-gray-500)' }}>{m.venue}</small></td>
                                    <td>{formatDate(m.date)}<br /><small>{m.time}</small></td>
                                    <td>{getStatusBadge(m.type)}</td>
                                    <td>{getStatusBadge(m.status)}</td>
                                    <td>{actionBtn}</td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
            <div className="att-card" style={{ marginTop: '16px' }}>
               <div className="att-card-header"><h3>Attendance Status Flow</h3></div>
               <div className="att-card-body">
                  <div className="att-status-flow">
                     {['Meeting Created', 'List Generated', 'Taking Attendance', 'Saved', 'Submitted', 'Approved', 'Locked'].map((step, i) => (
                        <div key={step} className={`att-flow-step ${i <= 2 ? 'att-completed' : ''} ${i === 2 ? 'att-active' : ''}`}>
                           <div className="att-flow-step-icon">{i === 0 ? '📝' : i === 1 ? '📄' : i === 2 ? '✍️' : i === 3 ? '💾' : i === 4 ? '📤' : i === 5 ? '✅' : '🔒'}</div>
                           <div className="att-flow-step-label">{step}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      );
   };

   const renderCreateMeeting = () => (
      <div className="att-card">
         <div className="att-card-header"><h3>Create New Meeting Attendance</h3></div>
         <div className="att-card-body">
            <div className="att-info-box"><p><strong>Note:</strong> Only members with "Active Member" status will be automatically included in the attendance list. Suspended, Withdrawn, Terminated, Deceased, Pending Applicant, and Approved (non-active) members are excluded.</p></div>
            <form onSubmit={handleCreateMeeting}>
               <div className="att-form-grid">
                  <div className="att-form-group"><label>Meeting Title <span className="att-required">*</span></label><input type="text" name="meetingTitle" className="att-form-control" placeholder="e.g., Monthly General Meeting - July 2026" required /></div>
                  <div className="att-form-group"><label>Meeting Type <span className="att-required">*</span></label><select name="meetingType" className="att-form-control" required><option value="">Select Type</option><option>Monthly General Meeting</option><option>Annual General Meeting</option><option>Emergency Meeting</option><option>Committee Meeting</option></select></div>
                  <div className="att-form-group"><label>Meeting Date <span className="att-required">*</span></label><input type="date" name="meetingDate" className="att-form-control" required /></div>
                  <div className="att-form-group"><label>Meeting Time <span className="att-required">*</span></label><input type="time" name="meetingTime" className="att-form-control" required /></div>
                  <div className="att-form-group"><label>Meeting Venue <span className="att-required">*</span></label><input type="text" name="meetingVenue" className="att-form-control" placeholder="e.g., Marcain Cooperative Hall" required /></div>
                  <div className="att-form-group"><label>Meeting Mode <span className="att-required">*</span></label><select name="meetingMode" className="att-form-control" required><option value="">Select Mode</option><option>Physical</option><option>Online</option><option>Hybrid</option></select></div>
                  <div className="att-form-group"><label>Created By</label><input type="text" className="att-form-control" value={store.currentUser.name} readOnly /></div>
                  <div className="att-form-group" style={{ gridColumn: '1 / -1' }}><label>Remarks</label><textarea name="meetingRemarks" className="att-form-control" placeholder="Any additional notes..." rows="3"></textarea></div>
               </div>
               <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                  <button type="submit" className="att-btn att-btn-primary att-btn-lg">Generate Attendance List</button>
                  <button type="button" className="att-btn att-btn-outline att-btn-lg" onClick={() => setCurrentPage('dashboard')}>Cancel</button>
               </div>
            </form>
         </div>
      </div>
   );

   const renderTakeAttendance = () => {
      const activeMeetings = store.meetings.filter(m => m.status === 'Attendance Being Taken' || m.status === 'Attendance List Generated' || m.status === 'Returned for Correction');
      if (activeMeetings.length === 0) {
         return (
            <div className="att-empty-state">
               <div style={{ fontSize: '60px', marginBottom: '16px' }}>📝</div>
               <h4>No Active Meetings</h4>
               <p>There are no meetings currently open for attendance marking. Create a new meeting to get started.</p>
               <button className="att-btn att-btn-primary" style={{ marginTop: '16px' }} onClick={() => setCurrentPage('create-meeting')}>Create Meeting</button>
            </div>
         );
      }
      return (
         <div className="att-card">
            <div className="att-card-header"><h3>Select Meeting to Take Attendance</h3></div>
            <div className="att-card-body">
               <div className="att-table-container">
                  <table className="att-data-table">
                     <thead><tr><th>Meeting</th><th>Date & Time</th><th>Venue</th><th>Status</th><th>Action</th></tr></thead>
                     <tbody>
                        {activeMeetings.map(m => (
                           <tr key={m.id}>
                              <td><strong>{m.title}</strong><br /><small>{m.type}</small></td>
                              <td>{formatDate(m.date)}<br /><small>{m.time}</small></td>
                              <td>{m.venue}<br /><small>{m.mode}</small></td>
                              <td>{getStatusBadge(m.status)}</td>
                              <td><button className="att-btn att-btn-primary att-btn-sm" onClick={() => openAttendance(m.id)}>Take Attendance</button></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      );
   };

   const renderAttendanceDetail = () => {
      const meeting = store.meetings.find(m => m.id === currentMeetingId);
      if (!meeting) return null;
      const activeMembers = getActiveMembers();
      const presentCount = Object.values(tempAttendance).filter(v => v === 'Present' || v === 'Late' || v === 'Online Attendance').length;
      const absentCount = Object.values(tempAttendance).filter(v => v === 'Absent').length;
      const lateCount = Object.values(tempAttendance).filter(v => v === 'Late').length;
      const excusedCount = Object.values(tempAttendance).filter(v => v === 'Excused').length;

      const filteredMembers = activeMembers.filter(member => {
         const matchesSearch = member.name.toLowerCase().includes(searchMember.toLowerCase()) || member.id.toLowerCase().includes(searchMember.toLowerCase());
         const matchesFilter = filterStatus === 'all' || tempAttendance[member.id] === filterStatus;
         return matchesSearch && matchesFilter;
      });

      return (
         <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
               <div><h2 style={{ fontSize: '20px', margin: 0 }}>{meeting.title}</h2><p style={{ color: 'var(--att-gray-500)', fontSize: '13px', margin: '4px 0 0 0' }}>{formatDate(meeting.date)} | {meeting.time} | {meeting.venue}</p></div>
               <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="att-btn att-btn-outline att-btn-sm" onClick={() => setCurrentPage('take-attendance')}>← Back</button>
                  {!meeting.submitted && <button className="att-btn att-btn-success att-btn-sm" onClick={saveAttendance}>💾 Save</button>}
                  {!meeting.submitted && <button className="att-btn att-btn-primary att-btn-sm" onClick={submitAttendance}>📤 Submit to Chairman</button>}
               </div>
            </div>
            <div className="att-stats-grid" style={{ marginBottom: '20px' }}>
               <div className="att-stat-card"><div className="att-stat-icon att-green">✅</div><div className="att-stat-info"><h4>{presentCount}</h4><p>Present</p></div></div>
               <div className="att-stat-card"><div className="att-stat-icon att-red">❌</div><div className="att-stat-info"><h4>{absentCount}</h4><p>Absent</p></div></div>
               <div className="att-stat-card"><div className="att-stat-icon att-orange">⏰</div><div className="att-stat-info"><h4>{lateCount}</h4><p>Late</p></div></div>
               <div className="att-stat-card"><div className="att-stat-icon att-blue">📝</div><div className="att-stat-info"><h4>{excusedCount}</h4><p>Excused</p></div></div>
            </div>
            <div className="att-search-bar">
               <div className="att-search-input-wrapper">
                  <input type="text" placeholder="Search by name, ID, or phone..." value={searchMember} onChange={e => setSearchMember(e.target.value)} />
               </div>
               <div className="att-filter-group">
                  {['all', 'Present', 'Absent', 'Late', 'Excused'].map(status => (
                     <button key={status} className={`att-filter-chip ${filterStatus === status ? 'active' : ''}`} onClick={() => setFilterStatus(status)}>
                        {status === 'all' ? 'All' : status}
                     </button>
                  ))}
               </div>
            </div>
            <div className="att-member-grid">
               {filteredMembers.map(member => {
                  const status = tempAttendance[member.id] || '';
                  const initials = member.name.split(' ').map(n => n[0]).join('');
                  return (
                     <div key={member.id} className="att-member-card">
                        <div className="att-member-card-header">
                           <div className="att-member-photo-placeholder">{initials}</div>
                           <div className="att-member-details"><h4>{member.name}</h4><p>{member.id} • {member.phone}</p></div>
                        </div>
                        <div className="att-member-card-body">
                           <div className="att-member-meta">
                              <span className="att-member-meta-item">👤 {member.status}</span>
                              <span className="att-member-meta-item">📅 Joined: {member.joinDate}</span>
                           </div>
                           <div className="att-attendance-options">
                              {['Present', 'Absent', 'Late', 'Excused', 'Online Attendance'].map(s => (
                                 <button key={s} className={`att-attendance-btn ${status === s ? `att-selected-${s.toLowerCase().replace(' ', '-')}` : ''}`} onClick={() => markAttendance(member.id, s)}>
                                    {s === 'Present' ? '✅' : s === 'Absent' ? '❌' : s === 'Late' ? '⏰' : s === 'Excused' ? '📝' : '💻'} {s === 'Online Attendance' ? 'Online' : s}
                                 </button>
                              ))}
                           </div>
                           <div className="att-form-grid" style={{ marginTop: '8px', gridTemplateColumns: '1fr 1fr' }}>
                              <div className="att-form-group"><label style={{ fontSize: '11px' }}>Arrival Time</label><input type="time" className="att-form-control" style={{ padding: '6px 10px', fontSize: '12px' }} /></div>
                              <div className="att-form-group"><label style={{ fontSize: '11px' }}>Meeting Role</label><select className="att-form-control" style={{ padding: '6px 10px', fontSize: '12px' }}><option>Member</option><option>Executive</option><option>Guest</option></select></div>
                           </div>
                           <div className="att-form-group"><label style={{ fontSize: '11px' }}>Remarks</label><input type="text" className="att-form-control" style={{ padding: '6px 10px', fontSize: '12px' }} placeholder="Optional notes..." /></div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      );
   };

   const renderChairmanApproval = () => {
      const pendingMeetings = store.meetings.filter(m => m.submitted && !m.approved && !m.returned);
      const returnedMeetings = store.meetings.filter(m => m.returned);
      const approvedMeetings = store.meetings.filter(m => m.approved);

      return (
         <div>
            <div className="att-tabs">
               <button className={`att-tab ${chairmanTab === 'pending' ? 'active' : ''}`} onClick={() => setChairmanTab('pending')}>Pending ({pendingMeetings.length})</button>
               <button className={`att-tab ${chairmanTab === 'returned' ? 'active' : ''}`} onClick={() => setChairmanTab('returned')}>Returned ({returnedMeetings.length})</button>
               <button className={`att-tab ${chairmanTab === 'approved' ? 'active' : ''}`} onClick={() => setChairmanTab('approved')}>Approved ({approvedMeetings.length})</button>
            </div>
            {chairmanTab === 'pending' && (
               <div>
                  {pendingMeetings.length === 0 ? (
                     <div className="att-empty-state"><div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div><h4>No Pending Approvals</h4><p>All attendance records have been reviewed. Great job!</p></div>
                  ) : pendingMeetings.map(m => {
                     const totalActive = getActiveMembers().length;
                     const present = Object.values(m.attendance).filter(v => v === 'Present' || v === 'Late' || v === 'Online Attendance').length;
                     const absent = Object.values(m.attendance).filter(v => v === 'Absent').length;
                     const late = Object.values(m.attendance).filter(v => v === 'Late').length;
                     return (
                        <div key={m.id} className="att-card" style={{ marginBottom: '16px' }}>
                           <div className="att-card-header"><h3>{m.title}</h3>{getStatusBadge('Pending Applicant')}</div>
                           <div className="att-card-body">
                              <div className="att-grid-4" style={{ marginBottom: '20px' }}>
                                 <div className="att-stat-card"><div className="att-stat-info"><h4>{totalActive}</h4><p>Total Active Members</p></div></div>
                                 <div className="att-stat-card"><div className="att-stat-icon att-green">✅</div><div className="att-stat-info"><h4>{present}</h4><p>Present</p></div></div>
                                 <div className="att-stat-card"><div className="att-stat-icon att-red">❌</div><div className="att-stat-info"><h4>{absent}</h4><p>Absent</p></div></div>
                                 <div className="att-stat-card"><div className="att-stat-icon att-orange">⏰</div><div className="att-stat-info"><h4>{late}</h4><p>Late</p></div></div>
                              </div>
                              <p><strong>Meeting Date:</strong> {formatDate(m.date)} | <strong>Time:</strong> {m.time} | <strong>Venue:</strong> {m.venue}</p>
                              <div style={{ marginTop: '16px' }}>
                                 <table className="att-data-table">
                                    <thead><tr><th>Member ID</th><th>Name</th><th>Phone</th><th>Status</th></tr></thead>
                                    <tbody>
                                       {getActiveMembers().map(member => (
                                          <tr key={member.id}><td>{member.id}</td><td>{member.name}</td><td>{member.phone}</td><td>{getStatusBadge(m.attendance[member.id] || 'Not Marked')}</td></tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                 <button className="att-btn att-btn-success" onClick={() => approveAttendance(m.id)}>✅ Approve</button>
                                 <button className="att-btn att-btn-warning" onClick={() => returnAttendance(m.id)}>📝 Return for Correction</button>
                                 <button className="att-btn att-btn-danger" onClick={() => rejectAttendance(m.id)}>❌ Reject</button>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}
            {chairmanTab === 'returned' && (
               <div>
                  {returnedMeetings.length === 0 ? (
                     <div className="att-empty-state"><div style={{ fontSize: '60px', marginBottom: '16px' }}>📝</div><h4>No Returned Records</h4><p>No attendance records have been returned for correction.</p></div>
                  ) : returnedMeetings.map(m => (
                     <div key={m.id} className="att-card" style={{ marginBottom: '16px' }}>
                        <div className="att-card-header"><h3>{m.title}</h3>{getStatusBadge(m.status)}</div>
                        <div className="att-card-body">
                           <div className="att-danger-box"><p><strong>Return Reason:</strong> {m.returnReason}</p></div>
                           <p><strong>Meeting Date:</strong> {formatDate(m.date)} | <strong>Attendance Officer:</strong> {m.createdBy}</p>
                           <div style={{ marginTop: '16px' }}>
                              <table className="att-data-table">
                                 <thead><tr><th>Member ID</th><th>Name</th><th>Phone</th><th>Status</th></tr></thead>
                                 <tbody>
                                    {getActiveMembers().map(member => (
                                       <tr key={member.id}><td>{member.id}</td><td>{member.name}</td><td>{member.phone}</td><td>{getStatusBadge(m.attendance[member.id] || 'Not Marked')}</td></tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
            {chairmanTab === 'approved' && (
               <div>
                  {approvedMeetings.length === 0 ? (
                     <div className="att-empty-state"><div style={{ fontSize: '60px', marginBottom: '16px' }}>🔒</div><h4>No Approved Records</h4><p>No attendance records have been approved yet.</p></div>
                  ) : approvedMeetings.map(m => {
                     const present = Object.values(m.attendance).filter(v => v === 'Present' || v === 'Late' || v === 'Online Attendance').length;
                     const absent = Object.values(m.attendance).filter(v => v === 'Absent').length;
                     return (
                        <div key={m.id} className="att-card" style={{ marginBottom: '16px' }}>
                           <div className="att-card-header"><h3>{m.title}</h3>{getStatusBadge('Approved Official Attendance Record')}</div>
                           <div className="att-card-body">
                              <div className="att-success-box"><p><strong>Approved by:</strong> {m.approvedBy} on {formatDate(m.approvedDate)}</p></div>
                              <p><strong>Meeting Date:</strong> {formatDate(m.date)} | <strong>Present:</strong> {present} | <strong>Absent:</strong> {absent}</p>
                              <div style={{ marginTop: '16px' }}>
                                 <table className="att-data-table">
                                    <thead><tr><th>Member ID</th><th>Name</th><th>Phone</th><th>Status</th></tr></thead>
                                    <tbody>
                                       {getActiveMembers().map(member => (
                                          <tr key={member.id}><td>{member.id}</td><td>{member.name}</td><td>{member.phone}</td><td>{getStatusBadge(m.attendance[member.id] || 'Not Marked')}</td></tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}
         </div>
      );
   };

   const renderAttendanceRegister = () => {
      const approvedMeetings = store.meetings.filter(m => m.approved);
      if (approvedMeetings.length === 0) {
         return (
            <div className="att-empty-state"><div style={{ fontSize: '60px', marginBottom: '16px' }}>🔒</div><h4>No Official Records</h4><p>Approved attendance records will appear here once the Chairman approves them.</p></div>
         );
      }
      return (
         <div className="att-card">
            <div className="att-card-header"><h3>Official Meeting Attendance Register</h3></div>
            <div className="att-card-body">
               <div className="att-info-box"><p><strong>Locked Records:</strong> These attendance records have been approved by the Chairman and cannot be edited. They serve as the official attendance register of MARCAIN Cooperative.</p></div>
               <div className="att-table-container">
                  <table className="att-data-table">
                     <thead><tr><th>Meeting</th><th>Date & Time</th><th>Venue</th><th>Approved By</th><th>Date Approved</th><th>Action</th></tr></thead>
                     <tbody>
                        {approvedMeetings.map(m => (
                           <tr key={m.id}>
                              <td><strong>{m.title}</strong><br /><small>{m.type}</small></td>
                              <td>{formatDate(m.date)}<br /><small>{m.time}</small></td>
                              <td>{m.venue}</td>
                              <td>{getStatusBadge(m.approvedBy)}</td>
                              <td>{formatDate(m.approvedDate)}</td>
                              <td><button className="att-btn att-btn-primary att-btn-sm" onClick={() => viewRegister(m.id)}>View Register</button></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      );
   };

   const renderReports = () => {
      const reports = [
         { icon: '📄', title: 'Attendance Per Meeting', desc: 'View detailed attendance breakdown for each meeting.', color: 'att-blue' },
         { icon: '👤', title: 'Attendance History Per Member', desc: 'Track individual member attendance across all meetings.', color: 'att-green' },
         { icon: '🚫', title: 'Frequently Absent Members', desc: 'Identify members with repeated absences.', color: 'att-red' },
         { icon: '⏰', title: 'Frequently Late Members', desc: 'Identify members with repeated late arrivals.', color: 'att-orange' },
         { icon: '⚠️', title: 'Members Eligible for Penalties', desc: 'Generate list of members meeting penalty criteria.', color: 'att-red' },
         { icon: '📝', title: 'Members with Excused Absence', desc: 'View all members with excused absences.', color: 'att-blue' },
         { icon: '💼', title: 'Executive Attendance Record', desc: 'Track attendance of executive committee members.', color: 'att-green' },
         { icon: '📅', title: 'Monthly Attendance Summary', desc: 'Generate monthly attendance statistics and trends.', color: 'att-blue' },
         { icon: '📊', title: 'Annual Attendance Summary', desc: 'Generate yearly attendance overview and analytics.', color: 'att-green' }
      ];
      return (
         <div>
            <div className="att-section-title">📈 Attendance Reports</div>
            <div className="att-grid-2">
               {reports.map((r, i) => (
                  <div key={i} className="att-report-card" onClick={() => showToast(`Report generated: ${r.title}`, 'info')}>
                     <div className={`att-report-icon ${r.color}`}>{r.icon}</div>
                     <h4>{r.title}</h4>
                     <p>{r.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      );
   };

   const renderPenalties = () => {
      const pending = store.penalties.filter(p => p.status === 'Pending Confirmation');
      const confirmed = store.penalties.filter(p => p.status === 'Confirmed');
      return (
         <div>
            <div className="att-tabs">
               <button className={`att-tab ${penaltyTab === 'pending' ? 'active' : ''}`} onClick={() => setPenaltyTab('pending')}>Pending Confirmation ({pending.length})</button>
               <button className={`att-tab ${penaltyTab === 'confirmed' ? 'active' : ''}`} onClick={() => setPenaltyTab('confirmed')}>Confirmed ({confirmed.length})</button>
            </div>
            {penaltyTab === 'pending' && (
               <div>
                  {pending.length === 0 ? (
                     <div className="att-empty-state"><div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div><h4>No Pending Penalties</h4><p>All penalties have been reviewed and confirmed.</p></div>
                  ) : pending.map(p => (
                     <div key={p.memberId} className={`att-penalty-item ${p.meetings >= 5 ? 'att-severe' : ''}`}>
                        <div className="att-penalty-info"><h5>{p.memberName} ({p.memberId})</h5><p>{p.type} | {p.meetings} meetings | Amount: NGN {p.amount.toLocaleString()} | Date: {formatDate(p.date)}</p></div>
                        <div>
                           <button className="att-btn att-btn-success att-btn-sm" onClick={() => confirmPenalty(p.memberId)}>✅ Confirm</button>
                           <button className="att-btn att-btn-outline att-btn-sm" style={{ marginLeft: '8px' }} onClick={() => waivePenalty(p.memberId)}>📝 Waive</button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
            {penaltyTab === 'confirmed' && (
               <div>
                  {confirmed.length === 0 ? (
                     <div className="att-empty-state"><div style={{ fontSize: '60px', marginBottom: '16px' }}>🔒</div><h4>No Confirmed Penalties</h4><p>No penalties have been confirmed yet.</p></div>
                  ) : confirmed.map(p => (
                     <div key={p.memberId} className="att-penalty-item att-severe">
                        <div className="att-penalty-info"><h5>{p.memberName} ({p.memberId})</h5><p>{p.type} | {p.meetings} meetings | Amount: NGN {p.amount.toLocaleString()} | Date: {formatDate(p.date)}</p></div>
                        {getStatusBadge('Present')}
                     </div>
                  ))}
               </div>
            )}
         </div>
      );
   };

   const renderAuditTrail = () => (
      <div className="att-card">
         <div className="att-card-header"><h3>Complete Audit Trail</h3></div>
         <div className="att-card-body">
            <div className="att-audit-timeline">
               {store.auditTrail.map((item, i) => (
                  <div key={i} className={`att-audit-item att-${item.type}`}>
                     <div className="att-audit-header"><span className="att-audit-action">{item.action}</span><span className="att-audit-time">{item.time}</span></div>
                     <div className="att-audit-user">by {item.user}</div>
                     <div className="att-audit-detail">{item.detail}</div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );

   const renderMembers = () => {
      const filtered = store.members.filter(m => m.name.toLowerCase().includes(membersSearch.toLowerCase()) || m.id.toLowerCase().includes(membersSearch.toLowerCase()));
      return (
         <div className="att-card">
            <div className="att-card-header"><h3>Approved Members Database</h3></div>
            <div className="att-card-body">
               <div className="att-info-box"><p><strong>Eligibility Rule:</strong> Only members with "Active Member" status appear on meeting attendance lists. Members who are Suspended, Withdrawn, Terminated, Deceased, or Pending Applicants are excluded.</p></div>
               <div className="att-search-bar">
                  <div className="att-search-input-wrapper">
                     <input type="text" placeholder="Search members..." value={membersSearch} onChange={e => setMembersSearch(e.target.value)} />
                  </div>
               </div>
               <div className="att-table-container">
                  <table className="att-data-table">
                     <thead><tr><th>Name</th><th>Member ID</th><th>Phone</th><th>Status</th><th>Join Date</th></tr></thead>
                     <tbody>
                        {filtered.map(m => {
                           const initials = m.name.split(' ').map(n => n[0]).join('');
                           return (
                              <tr key={m.id}>
                                 <td><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div className="att-member-photo-placeholder" style={{ width: '36px', height: '36px', fontSize: '14px' }}>{initials}</div><span>{m.name}</span></div></td>
                                 <td>{m.id}</td>
                                 <td>{m.phone}</td>
                                 <td>{getStatusBadge(m.status)}</td>
                                 <td>{m.joinDate}</td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      );
   };

   const renderNotifications = () => (
      <div className="att-card">
         <div className="att-card-header"><h3>Notifications</h3></div>
         <div className="att-card-body">
            {store.notifications.length === 0 ? (
               <div className="att-empty-state"><div style={{ fontSize: '60px', marginBottom: '16px' }}>📭</div><h4>No Notifications</h4><p>You have no notifications at this time.</p></div>
            ) : store.notifications.map((n, i) => {
               const iconMap = { submit: '📤', reminder: '⏰', approve: '✅', penalty: '⚠️' };
               const colorMap = { submit: 'var(--att-info-light)', reminder: 'var(--att-warning-light)', approve: 'var(--att-success-light)', penalty: 'var(--att-danger-light)' };
               return (
                  <div key={i} className={`att-notification-item ${!n.read ? 'att-unread' : ''}`}>
                     <div className="att-notification-icon" style={{ background: colorMap[n.type] }}>{iconMap[n.type]}</div>
                     <div style={{ flex: 1 }}>
                        <div className="att-notification-content"><h5>{n.title}</h5><p>{n.message}</p></div>
                     </div>
                     <span className="att-notification-time">{n.time}</span>
                  </div>
               );
            })}
         </div>
      </div>
   );

   const renderContent = () => {
      switch (currentPage) {
         case 'dashboard': return renderDashboard();
         case 'create-meeting': return renderCreateMeeting();
         case 'take-attendance': return renderTakeAttendance();
         case 'attendance-detail': return renderAttendanceDetail();
         case 'chairman-approval': return renderChairmanApproval();
         case 'attendance-register': return renderAttendanceRegister();
         case 'reports': return renderReports();
         case 'penalties': return renderPenalties();
         case 'audit-trail': return renderAuditTrail();
         case 'members': return renderMembers();
         case 'notifications': return renderNotifications();
         default: return renderDashboard();
      }
   };

   const pageTitles = {
      dashboard: { title: 'Dashboard', subtitle: 'Overview of attendance activities' },
      'create-meeting': { title: 'Create Meeting Attendance', subtitle: 'Set up a new meeting and generate attendance list' },
      'take-attendance': { title: 'Take Attendance', subtitle: 'Mark member attendance for meetings' },
      'attendance-detail': { title: 'Take Attendance', subtitle: 'Mark member attendance for meetings' },
      'chairman-approval': { title: 'Chairman Attendance Approval', subtitle: 'Review and approve submitted attendance records' },
      'attendance-register': { title: 'Official Meeting Attendance Register', subtitle: 'View locked and approved attendance records' },
      reports: { title: 'Attendance Reports', subtitle: 'Generate and view attendance analytics' },
      penalties: { title: 'Penalty Management', subtitle: 'Review and confirm member penalties' },
      'audit-trail': { title: 'Audit Trail', subtitle: 'Complete history of all attendance actions' },
      members: { title: 'Approved Members Database', subtitle: 'View and manage cooperative members' },
      notifications: { title: 'Notifications', subtitle: 'System alerts and member notifications' }
   };

   return (
      <div className="attendance-portal">
         {/* Toast Container */}
         <div className="att-toast-container">
            {toastMessages.map(t => (
               <div key={t.id} className={`att-toast att-${t.type}`}>
                  <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                  <span>{t.message}</span>
               </div>
            ))}
         </div>

         {/* Return Modal */}
         {showReturnModal && (
            <div className="att-modal-overlay active">
               <div className="att-modal">
                  <div className="att-modal-header"><h3>Return for Correction</h3><button className="att-modal-close" onClick={() => setShowReturnModal(false)}>×</button></div>
                  <div className="att-modal-body">
                     <p>Please provide a reason for returning this attendance record:</p>
                     <textarea className="att-form-control" rows="4" value={returnReason} onChange={e => setReturnReason(e.target.value)} placeholder="Enter reason..." style={{ marginTop: '12px' }} />
                  </div>
                  <div className="att-modal-footer">
                     <button className="att-btn att-btn-outline" onClick={() => setShowReturnModal(false)}>Cancel</button>
                     <button className="att-btn att-btn-warning" onClick={confirmReturn}>Return Record</button>
                  </div>
               </div>
            </div>
         )}

         {/* View Register Modal */}
         {modalOpen && (
            <div className="att-modal-overlay active" onClick={() => setModalOpen(false)}>
               <div className="att-modal" onClick={e => e.stopPropagation()}>
                  <div className="att-modal-header"><h3>{modalTitle}</h3><button className="att-modal-close" onClick={() => setModalOpen(false)}>×</button></div>
                  <div className="att-modal-body">{modalBody}</div>
                  <div className="att-modal-footer"><button className="att-btn att-btn-outline" onClick={() => setModalOpen(false)}>Close</button></div>
               </div>
            </div>
         )}

         <div className="att-app-container">
            {/* Sidebar */}
            <aside className={`att-sidebar ${sidebarOpen ? 'att-open' : ''}`}>
               <div className="att-sidebar-header">
                  <div className="att-logo">
                     <div className="att-logo-icon">MC</div>
                     <div className="att-logo-text"><h1>Marcain Coop</h1><span>Attendance System</span></div>
                  </div>
               </div>
               <div className="att-user-profile">
                  <div className="att-user-avatar">{store.currentUser.initials}</div>
                  <div className="att-user-info"><h4>{store.currentUser.name}</h4><span className="att-role-badge">{store.currentUser.role}</span></div>
               </div>
               <nav className="att-nav-menu">
                  {navItems.map((section, si) => (
                     <div key={si} className="att-nav-section">
                        <div className="att-nav-section-title">{section.section}</div>
                        {section.items.map(item => (
                           <div key={item.page} className={`att-nav-item ${currentPage === item.page ? 'active' : ''}`} onClick={() => { setCurrentPage(item.page); setSidebarOpen(false); }}>
                              <span style={{ marginRight: '12px' }}>{item.icon}</span>{item.label}
                           </div>
                        ))}
                     </div>
                  ))}
               </nav>
               <div className="att-sidebar-footer">MARCAIN Cooperative<br />Attendance Management System v1.0</div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && <div className="att-mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}

            {/* Main Content */}
            <main className="att-main-content">
               <header className="att-top-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <button className="att-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none' }}>
                        <span></span><span></span><span></span>
                     </button>
                     <div className="att-page-title">
                        <h2>{pageTitles[currentPage]?.title || 'Dashboard'}</h2>
                        <p>{pageTitles[currentPage]?.subtitle || ''}</p>
                     </div>
                  </div>
                  <div className="att-top-actions">
                     <button className="att-notification-btn" onClick={() => setCurrentPage('notifications')}>
                        🔔<span className="att-notification-badge">{store.notifications.filter(n => !n.read).length}</span>
                     </button>
                  </div>
               </header>
               <div className="att-content-area">{renderContent()}</div>
            </main>
         </div>
      </div>
   );
}


// ==================== FOOTER ====================
function Footer({ setPage }) {
   return (
      <footer className="footer">
         <div className="footer-container">
            <div className="footer-grid">
               <div className="footer-brand">
                  <div className="footer-logo"><img src="/logo.png" alt="MARCAIN Cooperative" className="footer-logo-img" /></div>
                  <div className="footer-address"><p>14 Kayode Lawal Crescent By</p><p>Fagbile Estate Off Isheri- Jegun-</p><p>Jakande Road, Isheri Oshun Rd,</p><p>Lagos</p></div>
                  <div className="footer-contact-info"><p>080123456789, 080234567899</p><p>info@maincoop.org</p></div>
               </div>
               <div className="footer-links">
                  <h4>Quick Menu</h4>
                  <button onClick={() => setPage('home')}>Home</button>
                  <button onClick={() => setPage('about')}>About</button>
                  <button onClick={() => setPage('services')}>Services</button>
                  <button onClick={() => setPage('membership')}>Membership</button>
                  <button onClick={() => setPage('gallery')}>Gallery</button>
                  <button onClick={() => setPage('contact')}>Contact</button>
                  <button onClick={() => setPage('portal')}>Portal</button>
               </div>
               <div className="footer-links">
                  <h4>Services</h4>
                  <button onClick={() => setPage('loans')}>Loan and Credit Facilities</button>
                  <button onClick={() => setPage('savings')}>Savings and Deposites</button>
                  <button onClick={() => setPage('welfare')}>Welfare Support</button>
                  <button onClick={() => setPage('investment')}>Investment Opportunities</button>
                  <button onClick={() => setPage('other-services')}>Other Services</button>
               </div>
               <div className="footer-links">
                  <h4>Other Menu</h4>
                  <button onClick={() => setPage('constitution')}>Constitution</button>
                  <button onClick={() => setPage('membership')}>Membership</button>
                  <button onClick={() => setPage('management')}>Management Team</button>
                  <button onClick={() => setPage('membership')}>Membership Form</button>
                  <button onClick={() => setPage('home')}>Privacy Policy</button>
               </div>
            </div>
            <div className="footer-bottom"><p>Copyright 2026 MARCAIN Cooperative. All Rights Reserved</p></div>
         </div>
      </footer>
   );
}

// ==================== MAIN APP ====================
function App() {
   const [currentPage, setPage] = useState('home');

   useEffect(() => {
      window.scrollTo(0, 0);
   }, [currentPage]);

   const renderPage = () => {
      switch (currentPage) {
         case 'home': return <HomePage setPage={setPage} />;
         case 'about': return <AboutPage setPage={setPage} />;
         case 'who-we-are': return <WhoWeArePage />;
         case 'management': return <ManagementPage />;
         case 'constitution': return <ConstitutionPage />;
         case 'services': return <ServicesPage setPage={setPage} />;
         case 'savings': return <SavingsPage setPage={setPage} />;
         case 'loans': return <LoansPage setPage={setPage} />;
         case 'investment': return <InvestmentPage setPage={setPage} />;
         case 'welfare': return <WelfarePage setPage={setPage} />;
         case 'other-services': return <OtherServicesPage setPage={setPage} />;
         case 'membership': return <MembershipFormPage setPage={setPage} />;
         case 'gallery': return <GalleryPage />;
         case 'contact': return <ContactPage />;
         case 'portal': return <PortalPage />;
         case 'attendance': return <AttendancePortal />;
         default: return <HomePage setPage={setPage} />;
      }
   };

   // Don't show navbar/footer on attendance portal for full-screen experience
   const isAttendance = currentPage === 'attendance';

   return (
      <div className="app">
         {!isAttendance && <Navbar currentPage={currentPage} setPage={setPage} />}
         <main className={`main-content ${isAttendance ? 'attendance-mode' : ''}`}>
            {renderPage()}
         </main>
         {!isAttendance && <Footer setPage={setPage} />}
      </div>
   );
}

export default App;