import React, { useState, useEffect, useRef } from 'react';
import './App.css';

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

const heroImages = ['/images/hero10.png', '/images/hero6.png', '/images/hero11.png'];
const aboutSliderImages = ['/images/about2.png', '/images/about4.png', '/images/about1.png'];
const whoWeAreSliderImages = ['/images/hero10.png', '/images/hero6.png', '/images/about1.png'];
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
   const aboutRef = useRef(null);
   const servicesRef = useRef(null);
   useEffect(() => {
      function handleClickOutside(e) {
         if (aboutRef.current && !aboutRef.current.contains(e.target)) setAboutOpen(false);
         if (servicesRef.current && !servicesRef.current.contains(e.target)) setServicesOpen(false);
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);
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
      { label: 'Portal', page: 'portal' }
   ];
   return (
      <nav className="navbar">
         <div className="nav-container">
            <div className="logo" onClick={() => setPage('home')}>
               <img src="/Marcainlogo.png" alt="MARCAIN Cooperative" className="logo-img" />
            </div>
            <div className="nav-links">
               {navLinks.map((link) => (
                  <div key={link.page}
                     ref={link.label === 'About' ? aboutRef : link.label === 'Services' ? servicesRef : null}
                     className="nav-item"
                     onMouseEnter={() => { if (link.label === 'About') setAboutOpen(true); if (link.label === 'Services') setServicesOpen(true); }}
                     onMouseLeave={() => { if (link.label === 'About') setAboutOpen(false); if (link.label === 'Services') setServicesOpen(false); }}>
                     <button onClick={() => { setPage(link.page); setAboutOpen(false); setServicesOpen(false); }}
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
                              <button key={item.page} onClick={() => { setPage(item.page); setAboutOpen(false); setServicesOpen(false); }}
                                 className="dropdown-item">{item.label}</button>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
            </div>
            <button className="join-btn" onClick={() => setPage('membership')}>Join Us</button>
         </div>
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
   }, []);
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
               <div className="why-join-image"><img src="/images/why.png" alt="MARCAIN Community" className="why-join-img" /></div>
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

// ==================== NEW MEMBERSHIP FORM (INTEGRATED FROM HTML) ====================
function MembershipFormPage({ setPage }) {
   const [currentStep, setCurrentStep] = useState(1);
   const [errors, setErrors] = useState({});
   const [submitted, setSubmitted] = useState(false);
   const [refCode, setRefCode] = useState('');
   const [dragOver, setDragOver] = useState({ passport: false, govtId: false });
   const [previewUrls, setPreviewUrls] = useState({ passport: null, govtId: null });

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

   const handleSubmit = () => {
      if (validateStep(4)) {
         const ref = 'MRCN-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
         setRefCode(ref);
         setSubmitted(true);
         window.scrollTo({ top: 0, behavior: 'smooth' });
      }
   };

   // ===== SIGNATURE PAD =====
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

   // ===== FILE HANDLING =====
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
         {/* Header */}
         <div className="membership-header">
            <div className="header-content">
               <div className="logo-container"><img src="/Marcainlogo.png" alt="MARCAIN Cooperative Logo" /></div>
               <div className="org-badge"><i className="fas fa-shield-alt"></i> MARCAIN Cooperative Society</div>
               <h1>Membership Application</h1>
               <p>Join the Matrimonial Rights Counsel and Advocacy Initiative. Complete all steps to register as a member.</p>
            </div>
         </div>

         {/* Progress Bar */}
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

         {/* Form */}
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
                           <a href="#" className="constitution-link" onClick={e => { e.preventDefault(); alert('Constitution document would open here'); }}>
                              <i className="fas fa-external-link-alt"></i> Click to read Constitution
                           </a>
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
                  <div className="form-actions">
                     <button className="btn btn-secondary" onClick={prevStep}><i className="fas fa-arrow-left"></i> Back</button>
                     <button className="btn btn-success" onClick={handleSubmit}><i className="fas fa-check-circle"></i> Submit Application</button>
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

// ==================== PORTAL / DASHBOARDS ====================
function PortalPage() {
   const [role, setRole] = useState('');
   const [loggedIn, setLoggedIn] = useState(false);
   const [activeTab, setActiveTab] = useState('applications');

   const [applications] = useState([
      { id: 1, name: 'John Adeyemi', phone: '08031234567', email: 'john@email.com', date: '2026-07-01', nominator: 'Dr. Emmanuel', status: 'Under Staff Verification' },
      { id: 2, name: 'Mary Okafor', phone: '08039876543', email: 'mary@email.com', date: '2026-07-02', nominator: 'Mrs. Grace', status: 'Verified by Staff' },
      { id: 3, name: 'Peter Nwosu', phone: '08035678901', email: 'peter@email.com', date: '2026-07-03', nominator: 'Mr. James', status: 'Reviewed by Secretary' },
      { id: 4, name: 'Amina Bello', phone: '08033456789', email: 'amina@email.com', date: '2026-07-04', nominator: 'Mrs. Amina', status: 'Awaiting Chairman Approval' },
      { id: 5, name: 'Chidinma Eze', phone: '08037890123', email: 'chidinma@email.com', date: '2026-07-05', nominator: 'Mr. Peter', status: 'Submitted' }
   ]);

   const [members] = useState([
      { id: 'MRC-2026-001', name: 'Dr. Emmanuel Adeyemi', phone: '08031234567', email: 'emmanuel@email.com', area: 'Lagos', nominator: 'N/A', submitted: '2026-01-15', approved: '2026-02-01', approvedBy: 'Chairman', status: 'Active' },
      { id: 'MRC-2026-002', name: 'Mrs. Grace Okafor', phone: '08039876543', email: 'grace@email.com', area: 'Abuja', nominator: 'N/A', submitted: '2026-01-20', approved: '2026-02-05', approvedBy: 'Chairman', status: 'Active' },
      { id: 'MRC-2026-003', name: 'Mr. James Nwosu', phone: '08035678901', email: 'james@email.com', area: 'Enugu', nominator: 'N/A', submitted: '2026-02-01', approved: '2026-02-15', approvedBy: 'Chairman', status: 'Active' }
   ]);

   const statusColors = {
      'Submitted': colors.warning, 'Under Staff Verification': colors.info, 'Verified by Staff': colors.info,
      'Reviewed by Secretary': colors.info, 'Awaiting Chairman Approval': colors.accent,
      'Approved': colors.success, 'Declined': colors.danger, 'Active': colors.success,
      'Suspended': colors.warning, 'Withdrawn': colors.textLight, 'Terminated': colors.danger
   };

   if (!loggedIn) {
      return (
         <div className="portal-login">
            <div className="login-card">
               <div className="login-logo">
                  <img src="/logo.png" alt="MARCAIN Portal" className="portal-login-logo-img" />
                  <h2>MARCAIN Portal</h2>
               </div>
               <p className="login-subtitle">Select your role to access the portal</p>
               <div className="role-selector">
                  {['Applicant', 'Cooperative Staff', 'Secretary', 'Chairman', 'Admin'].map(r => (
                     <button key={r} onClick={() => { setRole(r); setLoggedIn(true); }} className={`role-btn ${role === r ? 'active' : ''}`}>{r}</button>
                  ))}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="portal-dashboard">
         <div className="portal-sidebar">
            <div className="portal-brand">
               <img src="/logo.png" alt="MARCAIN Portal" className="portal-sidebar-logo-img" />
               <span>MARCAIN Portal</span>
            </div>
            <div className="portal-role">{role}</div>
            <nav className="portal-nav">
               <button onClick={() => setActiveTab('applications')} className={activeTab === 'applications' ? 'active' : ''}>📋 Applications</button>
               {role !== 'Applicant' && (<button onClick={() => setActiveTab('members')} className={activeTab === 'members' ? 'active' : ''}>👥 Members Register</button>)}
               <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>👤 Profile</button>
               <button onClick={() => { setLoggedIn(false); setRole(''); }} className="logout-btn">🚪 Logout</button>
            </nav>
         </div>
         <div className="portal-content">
            {activeTab === 'applications' && (
               <div>
                  <h2 className="portal-title">{role === 'Applicant' ? 'My Application' : role === 'Cooperative Staff' ? 'Staff Verification Dashboard' : role === 'Secretary' ? 'Secretary Membership Review Dashboard' : role === 'Chairman' ? 'Chairman Final Approval Dashboard' : 'All Applications'}</h2>
                  <div className="stats-bar">
                     <div className="stat-box"><div className="stat-value">{applications.length}</div><div className="stat-name">Total Applications</div></div>
                     <div className="stat-box"><div className="stat-value">{applications.filter(a => a.status === 'Submitted').length}</div><div className="stat-name">Pending</div></div>
                     <div className="stat-box"><div className="stat-value">{applications.filter(a => a.status === 'Awaiting Chairman Approval').length}</div><div className="stat-name">For Approval</div></div>
                     <div className="stat-box"><div className="stat-value">{members.length}</div><div className="stat-name">Approved Members</div></div>
                  </div>
                  <div className="table-card">
                     <table className="data-table">
                        <thead><tr><th>Applicant Name</th><th>Phone</th><th>Email</th><th>Date Submitted</th><th>Nominator</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                           {applications.map(app => (
                              <tr key={app.id}>
                                 <td><strong>{app.name}</strong></td><td>{app.phone}</td><td>{app.email}</td><td>{app.date}</td><td>{app.nominator}</td>
                                 <td><span className="status-badge" style={{ background: statusColors[app.status] + '20', color: statusColors[app.status] }}>{app.status}</span></td>
                                 <td><button className="action-btn">Review</button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
            {activeTab === 'members' && role !== 'Applicant' && (
               <div>
                  <h2 className="portal-title">MARCAIN Cooperative Members Register</h2>
                  <div className="search-bar"><input type="text" placeholder="Search by name, ID, or phone..." className="search-input" /><button className="search-btn">Search</button></div>
                  <div className="table-card">
                     <table className="data-table">
                        <thead><tr><th>Membership ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Residential Area</th><th>Nominator</th><th>Date Approved</th><th>Approved By</th><th>Status</th></tr></thead>
                        <tbody>
                           {members.map(m => (
                              <tr key={m.id}>
                                 <td><strong>{m.id}</strong></td><td>{m.name}</td><td>{m.phone}</td><td>{m.email}</td><td>{m.area}</td><td>{m.nominator}</td>
                                 <td>{m.approved}</td><td>{m.approvedBy}</td>
                                 <td><span className="status-badge" style={{ background: statusColors[m.status] + '20', color: statusColors[m.status] }}>{m.status}</span></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
            {activeTab === 'profile' && (
               <div className="profile-card">
                  <h2 className="portal-title">My Profile</h2>
                  <div className="profile-avatar">{role === 'Applicant' ? 'JA' : role[0]}</div>
                  <h3>{role === 'Applicant' ? 'John Adeyemi' : role}</h3>
                  <p className="profile-role">{role}</p>
                  <div className="profile-details">
                     <div className="profile-row"><span>Email:</span><span>{role === 'Applicant' ? 'john@email.com' : 'portal@marcaincoop.com'}</span></div>
                     <div className="profile-row"><span>Phone:</span><span>{role === 'Applicant' ? '08031234567' : '08030000000'}</span></div>
                     <div className="profile-row"><span>Member Since:</span><span>2026</span></div>
                     <div className="profile-row"><span>Last Login:</span><span>{new Date().toLocaleString()}</span></div>
                  </div>
               </div>
            )}
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
         default: return <HomePage setPage={setPage} />;
      }
   };

   return (
      <div className="app">
         <Navbar currentPage={currentPage} setPage={setPage} />
         <main className="main-content">
            {renderPage()}
         </main>
         <Footer setPage={setPage} />
      </div>
   );
}

export default App;