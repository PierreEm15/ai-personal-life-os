import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  X,
  Menu,
  Check,
  MapPin,
  MoveUpRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);
const models = [
  {
    name: "S1",
    type: "GRAND TOURER",
    line: "L’instinct de se distinguer.",
    description:
      "Une silhouette sculptée par le vent. Une puissance qui se ressent avant même de se révéler. Le grand tourisme entre dans une nouvelle ère.",
    image: "/images/hero.jpg",
    range: "620",
    power: "450",
    time: "3,8",
    price: "À partir de 48 500 000 FCFA",
    color: "Vert Éburnie",
  },
  {
    name: "K2",
    type: "SUV SIGNATURE",
    line: "Votre horizon, sans limites.",
    description:
      "L’assurance d’un SUV, la sérénité de l’électrique. Un espace généreux pour toutes les routes et toutes les histoires qui vous attendent.",
    image: "/images/suv.jpg",
    range: "580",
    power: "380",
    time: "4,6",
    price: "À partir de 42 000 000 FCFA",
    color: "Gris Lagune",
  },
  {
    name: "E1",
    type: "URBAN ÉLECTRIQUE",
    line: "La ville a trouvé son rythme.",
    description:
      "Agile, intuitive, résolument singulière. Une nouvelle énergie pour redécouvrir la ville et transformer chaque trajet en moment privilégié.",
    image: "/images/urban.jpg",
    range: "450",
    power: "280",
    time: "5,2",
    price: "À partir de 29 500 000 FCFA",
    color: "Blanc Ivoire",
  },
];

function Logo({ light = false, onClick }) {
  return (
    <a
      href="#accueil"
      className={`logo ${light ? "logo-light" : ""}`}
      aria-label="Naya, accueil"
      onClick={onClick}
    >
      <svg viewBox="0 0 36 30" fill="none" aria-hidden="true">
        <path d="M2 28V2h5l17 22V2h5v26h-5L7 6v22H2Z" fill="currentColor" />
        <path d="M33 2v26" stroke="currentColor" strokeWidth="3" />
      </svg>
      <span>
        NAYA<span className="logo-sub">M O T O R S</span>
      </span>
    </a>
  );
}
function ArrowButton({
  children,
  onClick,
  href,
  className = "",
  light = false,
}) {
  const content = (
    <>
      {children}
      <span className="button-arrow">
        <ArrowUpRight size={17} />
      </span>
    </>
  );
  return href ? (
    <a
      href={href}
      className={`button ${light ? "button-light" : ""} ${className}`}
    >
      {content}
    </a>
  ) : (
    <button
      onClick={onClick}
      className={`button ${light ? "button-light" : ""} ${className}`}
    >
      {content}
    </button>
  );
}
function App() {
  const root = useRef();
  const dialogRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [modal, setModalState] = useState(null);
  const returnFocus = useRef(null);
  const setModal = (next) => {
    if (!modal && next) returnFocus.current = document.activeElement;
    setModalState(next);
  };
  const [selectedModel, setSelectedModel] = useState("S1");
  const [submitted, setSubmitted] = useState(false);
  const [faq, setFaq] = useState(null);
  const model = models[slide];
  const openBooking = (name = model.name) => {
    setSelectedModel(name);
    setSubmitted(false);
    setMenuOpen(false);
    setModal({ type: "booking" });
  };
  const closeModal = () => {
    dialogRef.current?.close();
    setModalState(null);
    requestAnimationFrame(() =>
      returnFocus.current?.focus({ preventScroll: true }),
    );
  };

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".hero-intro .eyebrow, .hero-title-line, .hero-intro-side", {
          y: 35,
          opacity: 0,
          duration: 1.05,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.12,
        });
        gsap.from(".hero-visual", {
          y: 55,
          opacity: 0,
          duration: 1.3,
          ease: "power3.out",
          delay: 0.3,
        });
        gsap.to(".hero-photo", {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-visual",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.utils.toArray("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 42,
            opacity: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 91%", once: true },
          }),
        );
        gsap.from(".story-image img", {
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: ".story-image",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  useEffect(() => {
    if (modal) {
      dialogRef.current?.showModal();
      const heading = dialogRef.current?.querySelector("h2");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
      const oldOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = oldOverflow;
      };
    }
  }, [modal]);
  useEffect(() => {
    const onEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);
  const changeSlide = (dir) => {
    const next = (slide + dir + models.length) % models.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSlide(next);
      return;
    }
    gsap.to(".hero-photo, .hero-model-copy", {
      opacity: 0.15,
      duration: 0.18,
      onComplete: () => {
        setSlide(next);
        gsap.to(".hero-photo, .hero-model-copy", {
          opacity: 1,
          duration: 0.6,
          delay: 0.04,
        });
      },
    });
  };

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <header className="site-header" id="accueil">
        <Logo onClick={() => setMenuOpen(false)} />
        <nav className="desktop-nav" aria-label="Navigation principale">
          <a href="#modeles">Nos modèles</a>
          <a href="#vision">L’esprit NAYA</a>
          <a href="#experience">L’expérience</a>
        </nav>
        <div className="header-actions">
          <span className="country-label">
            <span className="ivory-flag" /> Côte d’Ivoire
          </span>
          <button className="header-cta" onClick={() => openBooking()}>
            Réserver un essai <ArrowUpRight size={16} />
          </button>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Navigation mobile">
          <a href="#modeles" onClick={() => setMenuOpen(false)}>
            Nos modèles <ArrowUpRight />
          </a>
          <a href="#vision" onClick={() => setMenuOpen(false)}>
            L’esprit NAYA <ArrowUpRight />
          </a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>
            L’expérience <ArrowUpRight />
          </a>
          <button onClick={() => openBooking()}>
            Réserver un essai <ArrowUpRight />
          </button>
        </nav>
      )}
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-intro">
            <div className="hero-heading">
              <p className="eyebrow">
                <span className="small-dot" /> NÉE ICI. DESTINÉE À ALLER LOIN.
              </p>
              <h1 id="hero-title">
                <span className="hero-title-line">L’audace a</span>
                <span className="hero-title-line">
                  une <span className="serif-word">origine.</span>
                  <BrandStar className="title-star" />
                </span>
              </h1>
            </div>
            <div className="hero-intro-side">
              <span className="intro-coordinate">
                ABIDJAN, CÔTE D’IVOIRE &nbsp; 05°20′ N
              </span>
              <p>
                L’élégance en mouvement.
                <br />
                L’Afrique en signature.
              </p>
              <a href="#modeles" className="text-link">
                Découvrez une nouvelle vision{" "}
                <span>
                  <ArrowDownIcon />
                </span>
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-photo"
              src={model.image}
              alt={`NAYA ${model.name}, une vision contemporaine de l’automobile de prestige`}
              fetchPriority="high"
            />
            <div className="hero-shade" />
            <div className="hero-photo-top">
              <div className="hero-model-copy">
                <span className="eyebrow">LA NOUVELLE SIGNATURE</span>
                <h2>
                  NAYA <span>{model.name}</span>
                </h2>
                <span className="hero-edition">
                  {model.type} &nbsp; / &nbsp; COLLECTION 2026
                </span>
              </div>
              <span className="electric-badge">
                <span /> 100 % ÉLECTRIQUE
              </span>
            </div>
            <div className="hero-photo-bottom">
              <div className="hero-model-copy">
                <span className="micro-label">
                  L’EXCEPTION DEVIENT MOUVEMENT
                </span>
                <p>{model.line}</p>
                <button
                  className="hero-discover"
                  onClick={() => setModal({ type: "model", model })}
                >
                  Explorer la NAYA {model.name} <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="slide-controls">
                <span className="slide-number">
                  0{slide + 1}
                  <span> / 03</span>
                </span>
                <button
                  onClick={() => changeSlide(-1)}
                  aria-label="Modèle précédent"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={() => changeSlide(1)}
                  aria-label="Modèle suivant"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <span className="image-caption">
              UNE VISION. UNE ALLURE. UNE NOUVELLE ÈRE.
            </span>
          </div>
          <div className="hero-stats">
            <div>
              <span className="stat-icon">↗</span>
              <p>
                Une nouvelle énergie<span>100 % électrique</span>
              </p>
            </div>
            <div>
              <strong>
                {model.range}
                <span> km</span>
              </strong>
              <p>
                D’autonomie<small>Jusqu’à · cycle WLTP*</small>
              </p>
            </div>
            <div>
              <strong>
                {model.time}
                <span> s</span>
              </strong>
              <p>
                De 0 à 100 km/h<small>Une émotion instantanée</small>
              </p>
            </div>
            <div className="origin-stat">
              <BrandStar className="outline-star" />
              <p>
                Imaginée à Abidjan<span>Ouverte sur le monde</span>
              </p>
            </div>
          </div>
        </section>

        <section id="vision" className="vision section-padding">
          <div className="section-label" data-reveal>
            <span className="small-dot" /> 01 — L’ESPRIT NAYA
          </div>
          <div className="vision-content">
            <h2 data-reveal>
              L’Afrique ne suit pas.
              <br />
              Elle <span className="serif-word">ouvre la voie.</span>
            </h2>
            <div className="vision-body" data-reveal>
              <p>
                Il y a des routes que l’on emprunte.
                <br />
                Et celles que l’on imagine.
              </p>
              <p>
                NAYA est née d’une conviction : notre continent mérite une
                automobile à la hauteur de son énergie. Un design singulier, une
                technologie intuitive et cette liberté d’oser qui nous
                ressemble.
              </p>
              <a className="underlined-link" href="#savoir-faire">
                Une autre idée de l’excellence <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <div className="vision-signature" data-reveal>
            <span>RACINES IVOIRIENNES. AMBITION UNIVERSELLE.</span>
            <div className="signature-line" />
            <span className="signature-mark">N.</span>
          </div>
        </section>

        <section id="modeles" className="models section-padding">
          <div className="section-label" data-reveal>
            <span className="small-dot" /> 02 — LA COLLECTION
          </div>
          <div className="section-heading" data-reveal>
            <h2>
              À chacun
              <br />
              sa <span className="serif-word">signature.</span>
            </h2>
            <p>
              Trois caractères. Une même exigence.
              <br />
              Trouvez celle qui vous ressemble.
            </p>
          </div>
          <div className="model-grid">
            {models.map((item, i) => (
              <article className="model-card" data-reveal key={item.name}>
                <button
                  className="model-photo"
                  onClick={() => setModal({ type: "model", model: item })}
                  aria-label={`Découvrir la NAYA ${item.name}`}
                >
                  <img
                    src={item.image}
                    alt={`Modèle NAYA ${item.name}, ${item.type.toLowerCase()}`}
                    loading="lazy"
                  />
                  <span className="model-photo-label">
                    0{i + 1} / {item.type}
                  </span>
                  <span className="model-circle">
                    <Plus size={22} />
                  </span>
                </button>
                <div className="model-card-head">
                  <h3>
                    NAYA <span>{item.name}</span>
                  </h3>
                  <span>100 % ÉLECTRIQUE</span>
                </div>
                <p className="model-line">{item.line}</p>
                <div className="model-details">
                  <span>
                    Jusqu’à <strong>{item.range} km</strong>
                  </span>
                  <span>
                    De 0 à 100 en <strong>{item.time} s</strong>
                  </span>
                </div>
                <button
                  className="model-link"
                  onClick={() => setModal({ type: "model", model: item })}
                >
                  Découvrir le modèle <ArrowUpRight size={19} />
                </button>
              </article>
            ))}
          </div>
          <p className="range-note">
            * Valeurs indicatives des véhicules concept. L’autonomie réelle
            varie selon les conditions de conduite.
          </p>
        </section>

        <section id="savoir-faire" className="craft">
          <div className="craft-copy">
            <div className="section-label" data-reveal>
              <span className="small-dot" /> 03 — LE SENS DU DÉTAIL
            </div>
            <h2 data-reveal>
              Rien de trop.
              <br />
              Tout <span className="serif-word">à ressentir.</span>
            </h2>
            <p data-reveal>
              La douceur d’une matière. La précision d’une ligne. Le silence qui
              vous enveloppe. Chez NAYA, chaque détail a une raison d’être :
              rendre votre voyage exceptionnel.
            </p>
            <div className="craft-features" data-reveal>
              <span>
                <span>01</span> Design essentiel
              </span>
              <span>
                <span>02</span> Matières choisies
              </span>
              <span>
                <span>03</span> Technologie intuitive
              </span>
            </div>
            <button
              className="underlined-link light-link"
              data-reveal
              onClick={() => setModal({ type: "craft" })}
            >
              Entrez dans l’univers NAYA <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="story-image">
            <img
              src="/images/interior.jpg"
              alt="Habitacle raffiné : cuir, matières texturées et finitions de précision"
              loading="lazy"
            />
            <span>LE LUXE SE VIT. IL NE S’EXPLIQUE PAS.</span>
          </div>
        </section>

        <section id="experience" className="experience section-padding">
          <div className="experience-top">
            <div data-reveal>
              <div className="section-label">
                <span className="small-dot" /> 04 — L’EXPÉRIENCE NAYA
              </div>
              <h2>
                Le premier regard séduit.
                <br />
                Le premier trajet <span className="serif-word">convainc.</span>
              </h2>
            </div>
            <div className="experience-side" data-reveal>
              <p>
                Prenez le temps de la découvrir.
                <br />
                Nous nous occupons du reste.
              </p>
              <ArrowButton onClick={() => openBooking()}>
                Vivre l’expérience NAYA
              </ArrowButton>
            </div>
          </div>
          <div className="experience-bottom" data-reveal>
            <span>
              <MapPin size={15} /> ABIDJAN, CÔTE D’IVOIRE
            </span>
            <span>UN MOMENT À VOUS. UN ACCOMPAGNEMENT SUR MESURE.</span>
            <span className="experience-symbol">↗</span>
          </div>
        </section>

        <section className="faq section-padding">
          <div data-reveal>
            <div className="section-label">
              <span className="small-dot" /> POUR ALLER PLUS LOIN
            </div>
            <h2>
              Tout commence
              <br />
              par une <span className="serif-word">question.</span>
            </h2>
          </div>
          <div className="faq-list" data-reveal>
            {[
              [
                "Qu’est-ce que NAYA ?",
                "NAYA est un concept de marque automobile premium né d’une vision ivoirienne. Cette vitrine présente une collection de véhicules imaginaires, des ambitions de design et une expérience de marque. Les visuels sont des illustrations d’inspiration.",
              ],
              [
                "Comment se déroule un essai ?",
                "Choisissez le modèle qui vous inspire et indiquez vos préférences dans notre formulaire. Dans cette démonstration, votre demande est confirmée à l’écran ; aucune réservation réelle ni transmission de données n’est effectuée.",
              ],
              [
                "Où découvrir la collection ?",
                "La collection se découvre ici, à travers les fiches de nos trois véhicules concept. Notre vision d’un premier espace NAYA s’ancre à Abidjan, en Côte d’Ivoire.",
              ],
            ].map(([question, answer], i) => (
              <div
                className={`faq-item ${faq === i ? "is-open" : ""}`}
                key={question}
              >
                <button
                  onClick={() => setFaq(faq === i ? null : i)}
                  aria-expanded={faq === i}
                  aria-controls={`answer-${i}`}
                >
                  {question}
                  {faq === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                <div id={`answer-${i}`} hidden={faq !== i}>
                  <p>{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-top">
          <Logo light />
          <p>
            L’élégance en mouvement.
            <br />
            L’Afrique en signature.
          </p>
          <a href="#accueil" className="back-top" aria-label="Revenir en haut">
            <MoveUpRight size={23} />
          </a>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          NAYA<span>®</span>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} NAYA MOTORS · MARQUE CONCEPTUELLE
          </span>
          <div>
            <button onClick={() => setModal({ type: "legal" })}>
              Mentions légales
            </button>
            <button onClick={() => setModal({ type: "privacy" })}>
              Confidentialité
            </button>
            <a href="#accueil">
              Imaginée en Côte d’Ivoire <span className="ivory-flag" />
            </a>
          </div>
        </div>
      </footer>

      {modal && (
        <dialog
          ref={dialogRef}
          aria-label={
            modal.type === "booking"
              ? "Réserver un essai NAYA"
              : modal.type === "model"
                ? `Découvrir la NAYA ${modal.model.name}`
                : "L’univers NAYA"
          }
          className={`dialog ${modal.type === "model" ? "model-dialog" : ""}`}
          onCancel={closeModal}
          onClick={(e) => {
            if (e.target === dialogRef.current) closeModal();
          }}
        >
          <button
            className="dialog-close"
            onClick={closeModal}
            aria-label="Fermer la fenêtre"
          >
            <X size={23} />
          </button>
          {modal.type === "model" && (
            <>
              <div className="dialog-model-image">
                <img src={modal.model.image} alt={`NAYA ${modal.model.name}`} />
              </div>
              <div className="dialog-content">
                <p className="eyebrow">
                  LA COLLECTION NAYA / {modal.model.type}
                </p>
                <h2>
                  NAYA <span className="serif-word">{modal.model.name}</span>
                </h2>
                <p>{modal.model.description}</p>
                <div className="modal-specs">
                  <div>
                    <strong>
                      {modal.model.range}
                      <small> km</small>
                    </strong>
                    <span>Autonomie WLTP*</span>
                  </div>
                  <div>
                    <strong>
                      {modal.model.power}
                      <small> ch</small>
                    </strong>
                    <span>Puissance</span>
                  </div>
                  <div>
                    <strong>
                      {modal.model.time}
                      <small> s</small>
                    </strong>
                    <span>0 à 100 km/h</span>
                  </div>
                </div>
                <div className="modal-color">
                  <span className={`color-swatch color-${modal.model.name}`} />
                  {modal.model.color}
                  <span>{modal.model.price}</span>
                </div>
                <ArrowButton onClick={() => openBooking(modal.model.name)}>
                  Réserver mon essai
                </ArrowButton>
                <small className="concept-note">
                  Véhicule concept. Caractéristiques et prix indicatifs, sans
                  offre commerciale.
                </small>
              </div>
            </>
          )}
          {modal.type === "booking" && (
            <div className="dialog-content booking-content">
              {submitted ? (
                <div className="booking-success">
                  <span className="success-icon">
                    <Check size={32} />
                  </span>
                  <p className="eyebrow">LE DÉBUT D’UNE NOUVELLE HISTOIRE</p>
                  <h2>
                    Le rendez-vous
                    <br />
                    avec <span className="serif-word">l’exception.</span>
                  </h2>
                  <p>
                    Votre demande d’essai pour la NAYA {selectedModel} a été
                    préparée.
                  </p>
                  <p className="demo-note">
                    Vous explorez une expérience de démonstration. Aucune donnée
                    n’a été envoyée et aucun essai réel n’est réservé.
                  </p>
                  <ArrowButton onClick={closeModal}>
                    Poursuivre la découverte
                  </ArrowButton>
                </div>
              ) : (
                <>
                  <p className="eyebrow">
                    <span className="small-dot" /> L’EXPÉRIENCE NAYA
                  </p>
                  <h2>
                    Faisons
                    <br />
                    <span className="serif-word">connaissance.</span>
                  </h2>
                  <p>Votre prochain chapitre commence par un premier trajet.</p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                      dialogRef.current?.scrollTo(0, 0);
                    }}
                  >
                    <label>
                      Le modèle qui vous inspire
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                      >
                        {models.map((m) => (
                          <option key={m.name} value={m.name}>
                            NAYA {m.name} — {m.type}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="form-row">
                      <label>
                        Prénom
                        <input
                          name="firstName"
                          autoComplete="given-name"
                          placeholder="Votre prénom"
                          required
                          maxLength={60}
                        />
                      </label>
                      <label>
                        Nom
                        <input
                          name="lastName"
                          autoComplete="family-name"
                          placeholder="Votre nom"
                          required
                          maxLength={60}
                        />
                      </label>
                    </div>
                    <label>
                      Adresse e-mail
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="vous@exemple.com"
                        required
                      />
                    </label>
                    <div className="form-row">
                      <label>
                        Date souhaitée
                        <input
                          name="date"
                          type="date"
                          required
                          min={new Date().toLocaleDateString("en-CA")}
                        />
                      </label>
                      <label>
                        Créneau
                        <select name="time" required>
                          <option value="">Choisir un horaire</option>
                          <option>09:00 – 11:00</option>
                          <option>11:00 – 13:00</option>
                          <option>14:00 – 16:00</option>
                          <option>16:00 – 18:00</option>
                        </select>
                      </label>
                    </div>
                    <label className="checkbox-label">
                      <input type="checkbox" required />{" "}
                      <span>
                        J’accepte que ces informations soient utilisées pour
                        préparer ma demande d’essai.
                      </span>
                    </label>
                    <button className="button form-submit" type="submit">
                      Confirmer ma demande{" "}
                      <span className="button-arrow">
                        <ArrowUpRight size={17} />
                      </span>
                    </button>
                    <p className="form-note">
                      Démonstration : aucune donnée n’est transmise ni
                      conservée.
                    </p>
                  </form>
                </>
              )}
            </div>
          )}
          {modal.type === "craft" && (
            <div className="dialog-content editorial-dialog">
              <p className="eyebrow">L’UNIVERS NAYA</p>
              <h2>
                L’essentiel.
                <br />
                <span className="serif-word">Avec exigence.</span>
              </h2>
              <p>
                Notre vision du luxe commence par ce que l’on ressent. Des
                volumes apaisés, des matières chaleureuses et des interfaces
                pensées pour s’effacer.
              </p>
              <h3>Un design qui respire</h3>
              <p>
                Des lignes tendues et des proportions équilibrées, inspirées par
                la lumière et les paysages de la Côte d’Ivoire.
              </p>
              <h3>Une autre relation au voyage</h3>
              <p>
                Une motorisation électrique silencieuse, un habitacle
                enveloppant et une attention particulière à chaque geste du
                quotidien.
              </p>
              <ArrowButton onClick={() => openBooking()}>
                Découvrir l’expérience
              </ArrowButton>
            </div>
          )}
          {(modal.type === "legal" || modal.type === "privacy") && (
            <div className="dialog-content editorial-dialog">
              <p className="eyebrow">NAYA MOTORS</p>
              <h2>
                {modal.type === "legal"
                  ? "Mentions légales"
                  : "Confidentialité"}
              </h2>
              {modal.type === "legal" ? (
                <>
                  <p>
                    NAYA Motors est une marque automobile fictive créée pour
                    cette démonstration de site web. Les véhicules,
                    caractéristiques, prix et lieux évoqués sont des concepts et
                    ne constituent pas une offre commerciale.
                  </p>
                  <p>
                    Les photographies sont utilisées à titre d’illustration.
                    Elles ne représentent pas des véhicules fabriqués par NAYA
                    et n’impliquent aucune affiliation avec leurs constructeurs.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Ce site de démonstration ne transmet ni ne conserve les
                    informations saisies dans le formulaire. Elles restent
                    uniquement dans votre navigateur pendant votre visite.
                  </p>
                  <p>
                    Aucun cookie publicitaire ni outil de suivi analytique n’est
                    utilisé. Les polices et les images sont hébergées avec le
                    site ; aucun service tiers n’est nécessaire à leur
                    affichage.
                  </p>
                </>
              )}
              <button className="underlined-link" onClick={closeModal}>
                Retour à la découverte <ArrowRight size={18} />
              </button>
            </div>
          )}
        </dialog>
      )}
    </div>
  );
}
function BrandStar({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 2v44M2 24h44M8.45 8.45l31.1 31.1M8.45 39.55l31.1-31.1"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  );
}
function ArrowDownIcon() {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 1v14M2 9l6 6 6-6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

createRoot(document.getElementById("root")).render(<App />);
