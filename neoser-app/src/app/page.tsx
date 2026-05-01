"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  Users,
  GraduationCap,
  MessageCircle,
  Stethoscope,
  Baby,
  HandHeart,
  BookHeart,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Globe,
  Trophy,
  ArrowRight,
  Camera,
} from "lucide-react";
import { ContactLeadForm } from "@/components/contact-lead-form";
import { GoogleMapEmbed } from "@/components/google-map-embed";
import { BookingPreform } from "@/components/booking-preform";

export default function HomePage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveSlide((p) => (p + 1) % 4), 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("aos-visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll("[data-aos]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);
  const calBookingUrl = process.env.NEXT_PUBLIC_CAL_BOOKING_URL;
  const bookingUrl =
    calBookingUrl ||
    "https://wa.me/51932713071?text=Hola%2C%20quiero%20reservar%20una%20cita%20en%20NeoSer";

  const services = [
    { icon: Stethoscope, iconBg: "pink-bg", title: "Control Prenatal", desc: "Seguimiento personalizado de tu embarazo con ecografias, analisis y orientacion profesional para asegurar el bienestar de mama y bebe.", wa: "Control%20Prenatal" },
    { icon: Baby, iconBg: "blue-bg", title: "Parto Humanizado", desc: "Acompanamiento respetuoso durante el nacimiento de tu bebe, respetando tus decisiones y promoviendo el vinculo inmediato madre-hijo.", wa: "Parto%20Humanizado" },
    { icon: HandHeart, iconBg: "pink-bg", title: "Tecnica Rebozo", desc: "Tecnica ancestral mexicana para aliviar molestias del embarazo, facilitar el trabajo de parto y promover la relajacion profunda.", wa: "Tecnica%20Rebozo" },
    { icon: BookHeart, iconBg: "blue-bg", title: "Preparacion al Parto", desc: "Sesiones teorico-practicas para prepararte fisica y emocionalmente para el momento del nacimiento con confianza y seguridad.", wa: "Preparacion%20al%20Parto" },
    { icon: HeartHandshake, iconBg: "pink-bg", title: "Acompanamiento Postparto", desc: "Soporte integral despues del nacimiento: lactancia, recuperacion, cuidados del recien nacido y bienestar emocional de la mama.", wa: "Acompanamiento%20Postparto" },
    { icon: ShieldCheck, iconBg: "blue-bg", title: "Obstetricia General", desc: "Atencion obstetrica completa con enfoque humanizado, desde la consulta ginecologica hasta el seguimiento integral de la salud reproductiva.", wa: "Obstetricia" },
  ];

  const courses = [
    { badge: "Presencial", badgeBg: "bg-pink", title: "Curso de Preparacion al Parto", desc: "Tecnicas de respiracion, posiciones de parto, plan de nacimiento y vinculo temprano.", price: "S/. 350", wa: "Curso%20de%20Preparacion%20al%20Parto" },
    { badge: "Online", badgeBg: "bg-navy", title: "Diplomado en Parto Humanizado", desc: "Formacion integral para profesionales de salud en atencion humanizada del nacimiento.", price: "S/. 1,200", wa: "Diplomado%20en%20Parto%20Humanizado" },
    { badge: "Hibrido", badgeBg: "bg-pink", title: "Tecnica Rebozo Certificacion", desc: "Certificacion internacional en tecnica Rebozo con reconocimiento de Spinning Babies.", price: "S/. 800", wa: "Certificacion%20Rebozo" },
    { badge: "Presencial", badgeBg: "bg-pink", title: "Taller de Lactancia Materna", desc: "Taller practico sobre tecnicas de lactancia, posiciones y resolucion de problemas comunes.", price: "S/. 180", wa: "Taller%20de%20Lactancia" },
  ];

  const testimonials = [
    { initials: "MC", quote: "El diplomado cambio completamente mi manera de ver la atencion del parto. Ahora aplico la medicina humanizada en cada consulta.", name: "Maria Carmen R.", role: "Obstetra - Trujillo" },
    { initials: "LP", quote: "Gracias a NeoSer tuve el parto que sonaba. Me senti acompanada, respetada y empoderada en cada momento.", name: "Lucia Perez T.", role: "Mama NeoSer - Chiclayo" },
    { initials: "AV", quote: "La certificacion en Rebozo fue una experiencia transformadora. El equipo de NeoSer es increiblemente profesional y calido.", name: "Andrea Vargas M.", role: "Doula - Lima" },
    { initials: "RS", quote: "Excelente formacion. Los docentes tienen una pasion genuina por la maternidad humanizada. 100% recomendado.", name: "Rosa Sanchez L.", role: "Enfermera - Chiclayo" },
  ];

  return (
    <main>
      {/* ===== NAVBAR ===== */}
      <nav className={`navbar ${navScrolled ? "scrolled" : ""}`}>
        <div className="container-main flex items-center justify-between">
          <a href="#inicio" className="flex-shrink-0">
            <span className="logo-white text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>NeoSer</span>
            <span className="logo-color text-2xl font-bold text-navy" style={{ fontFamily: "var(--font-playfair), serif" }}>NeoSer</span>
          </a>
          <div className="hidden items-center gap-8 lg:flex">
            <a href="#inicio" className="nav-link">Inicio</a>
            <a href="#servicios" className="nav-link">Servicios</a>
            <a href="#cursos" className="nav-link">Cursos</a>
            <a href="#reserva" className="nav-link">Reserva</a>
            <a href="#nosotros" className="nav-link">Nosotros</a>
            <a href="#noticias" className="nav-link">Noticias</a>
            <a href="#contacto" className="nav-link">Contacto</a>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
              <MessageCircle className="h-4 w-4" /> Reserva tu Cita
            </a>
          </div>
          <div className={`hamburger lg:hidden ${mobileMenuOpen ? "active" : ""}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span /><span /><span />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-overlay ${mobileMenuOpen ? "active" : ""}`} onClick={closeMobile} />
      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        {["inicio","servicios","cursos","reserva","nosotros","noticias","contacto"].map((s) => (
          <a key={s} href={`#${s}`} className="nav-link" onClick={closeMobile}>{s.charAt(0).toUpperCase()+s.slice(1)}</a>
        ))}
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 justify-center">
          <MessageCircle className="h-5 w-5" /> Reserva tu Cita
        </a>
      </div>

      {/* ===== HERO SLIDER ===== */}
      <section id="inicio" className="hero-slider-section">
        <div className="relative w-full" style={{ height: "100vh" }}>
          {[
            { bg: "hero-bg-1", script: '"Cada nacimiento es unico"', title: <>Maternidad y <br /><span className="highlight">Medicina Humanizada</span></>, sub: "Acompanamos y atendemos nacimientos humanizados en Chiclayo. Tu bienestar y el de tu bebe son nuestra prioridad.", ctas: [{ href: "#servicios", cls: "btn-primary", icon: Heart, text: "Nuestros Servicios" }, { href: bookingUrl, cls: "btn-secondary", icon: Calendar, text: "Reserva tu Cita", ext: true }] },
            { bg: "hero-bg-2", script: "NeoSer", title: <>Porque nacer y vivir<br /><span className="highlight">con amor cambia el mundo</span></>, sub: "Mas de 1,000 alumnos formados y 500 partos humanizados acompanados con calidez y profesionalismo.", ctas: [{ href: "#nosotros", cls: "btn-primary", icon: Users, text: "Conocenos" }] },
            { bg: "hero-bg-3", script: "Escuela NeoSer", scriptWhite: true, title: <>Cursos y <br /><span className="text-white/90">Certificaciones</span></>, sub: "Diplomados, talleres y certificaciones internacionales en parto humanizado, tecnica Rebozo y lactancia materna.", ctas: [{ href: "#cursos", cls: "btn-secondary !border-white !text-white", icon: GraduationCap, text: "Ver Cursos" }, { href: "https://wa.me/51932713071?text=Hola%2C%20quiero%20info%20de%20los%20cursos%20de%20NeoSer", cls: "btn-primary !bg-white !text-pink-dark !border-white", icon: MessageCircle, text: "Inscribete", ext: true }] },
            { bg: "hero-bg-4", script: '"Tu parto, tu decision"', title: <>Acompanamiento<br /><span className="highlight">Integral y Respetuoso</span></>, sub: "Desde el embarazo hasta el postparto, te acompanamos en cada paso de tu viaje como mama.", ctas: [{ href: bookingUrl, cls: "btn-primary", icon: Calendar, text: "Agenda tu Cita", ext: true }] },
          ].map((slide, i) => (
            <div key={i} className={`absolute inset-0 flex items-center overflow-hidden transition-opacity duration-700 ${slide.bg} ${activeSlide === i ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <div className="hero-particles">
                <span className="particle particle-circle" style={{ width: 320, height: 320, top: -60, right: -80, background: "#e8879b", opacity: 0.07 }} />
                <span className="particle particle-circle" style={{ width: 200, height: 200, bottom: "10%", left: -50, background: "#4a7fb5", opacity: 0.1 }} />
                <span className="particle particle-dot" style={{ width: 8, height: 8, top: "20%", left: "15%" }} />
                <span className="particle particle-dot" style={{ width: 5, height: 5, top: "60%", right: "20%", animationDelay: "-2s" }} />
                <span className="particle particle-ring" style={{ width: 120, height: 120, bottom: "15%", right: "12%" }} />
                <span className="particle particle-diamond" style={{ top: "25%", right: "18%" }} />
              </div>
              <div className="relative z-10 container-main text-center">
                <p className={`hero-script mb-4 ${slide.scriptWhite ? "!text-white" : ""}`}>{slide.script}</p>
                <h1 className="hero-title mb-6">{slide.title}</h1>
                <p className="hero-subtitle mx-auto mb-8 max-w-xl">{slide.sub}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {slide.ctas.map((cta) => (
                    <a key={cta.text} href={cta.href} {...(cta.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cta.cls}>
                      <cta.icon className="h-5 w-5" /> {cta.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-28 left-0 right-0 z-20 flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button key={i} onClick={() => setActiveSlide(i)} className="h-3 rounded-full transition-all duration-300" style={{ width: activeSlide === i ? 36 : 12, background: activeSlide === i ? "#e8879b" : "rgba(255,255,255,0.5)" }} />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="hero-stats-bar">
          <div className="container-main">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { val: "+1,000", label: "Alumnos formados" },
                { val: "+500", label: "Partos acompanados" },
                { val: "+4 Ed.", label: "Ediciones de cursos" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-white md:text-3xl" style={{ fontFamily: "var(--font-playfair), serif" }}>{s.val}</div>
                  <div className="mt-1 text-xs text-white/60 md:text-sm">{s.label}</div>
                </div>
              ))}
              <div className="text-center">
                <div className="flex items-center justify-center text-2xl font-bold text-white md:text-3xl"><MapPin className="h-6 w-6" /></div>
                <div className="mt-1 text-xs text-white/60 md:text-sm">Chiclayo, Peru</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICIOS ===== */}
      <section id="servicios" className="bg-cream py-20 md:py-28">
        <div className="container-main">
          <div className="mb-16 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Lo que hacemos por ti</p>
            <h2 className="section-title mb-4">Nuestros Servicios</h2>
            <div className="section-divider mx-auto" />
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Brindamos atencion integral para cada etapa de tu maternidad, con profesionales comprometidos con el respeto y la calidez humana.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <div key={s.title} className="service-card" data-aos="fade-up" data-aos-delay={i % 3 * 100}>
                <div className={`service-icon ${s.iconBg}`}><s.icon /></div>
                <h3 className="mb-3 text-xl font-bold text-navy">{s.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-gray-500">{s.desc}</p>
                <a href={`https://wa.me/51932713071?text=Hola%2C%20quiero%20informacion%20sobre%20${s.wa}`} target="_blank" rel="noopener noreferrer" className="btn-pink-outline text-sm">
                  <MessageCircle className="h-4 w-4" /> Consultar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CURSOS ===== */}
      <section id="cursos" className="bg-white py-20 md:py-28">
        <div className="container-main">
          <div className="mb-16 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Escuela NeoSer</p>
            <h2 className="section-title mb-4">Nuestros Cursos</h2>
            <div className="section-divider mx-auto" />
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Formacion profesional y vivencial para quienes desean transformar la atencion materna con un enfoque humanizado y basado en evidencia.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-aos="fade-up" data-aos-delay="100">
            {courses.map((c) => (
              <div key={c.title} className="course-card">
                <div className="course-image">
                  <span className={`course-badge ${c.badgeBg} text-white`}>{c.badge}</span>
                </div>
                <div className="course-body">
                  <h3 className="mb-2 text-lg font-bold text-navy">{c.title}</h3>
                  <p className="mb-4 text-sm text-gray-500">{c.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="course-price">{c.price}</span>
                    <a href={`https://wa.me/51932713071?text=Hola%2C%20quiero%20info%20del%20${c.wa}`} target="_blank" rel="noopener noreferrer" className="btn-pink-outline text-xs">Ver mas</a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Proximos Eventos */}
          <div className="mt-20" data-aos="fade-up">
            <h3 className="mb-8 text-center text-2xl font-bold text-navy">Proximos Eventos</h3>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              {[
                { month: "Abril 2026", title: "V Edicion - Diplomado Parto Humanizado", desc: "Modalidad hibrida. Inscripciones abiertas." },
                { month: "Mayo 2026", title: "Seminario: Movimiento en el Parto", desc: "Taller intensivo de un dia. Cupos limitados." },
                { month: "Junio 2026", title: "Certificacion Rebozo - Nivel II", desc: "Para egresados del Nivel I. Con aval internacional." },
              ].map((ev) => (
                <div key={ev.title} className="timeline-item pb-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-pink">{ev.month}</span>
                  <h4 className="mt-1 font-bold text-navy">{ev.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{ev.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonios */}
          <div className="mt-20" data-aos="fade-up">
            <h3 className="mb-8 text-center text-2xl font-bold text-navy">Lo que dicen nuestros alumnos</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {testimonials.map((t) => (
                <div key={t.initials} className="testimonial-card">
                  <span className="quote-icon">&ldquo;</span>
                  <p className="testimonial-text mt-8 mb-6 text-sm">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold text-navy">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== NOSOTROS ===== */}
      <section id="nosotros" className="bg-cream py-20 md:py-28">
        <div className="container-main">
          <div className="mb-16 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Nuestra historia</p>
            <h2 className="section-title mb-4">Quienes Somos</h2>
            <div className="section-divider mx-auto" />
          </div>

          {/* Story */}
          <div className="mb-20 grid items-center gap-12 lg:grid-cols-2" data-aos="fade-up">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-navy">
                Nacimos con un proposito: <span className="text-pink">humanizar la maternidad</span>
              </h3>
              <p className="mb-4 leading-relaxed text-gray-500">
                NeoSer nace en Chiclayo con la vision de transformar la atencion materna en el Peru.
                Fundado por la Obst. Diana Silva y el Dr. Chacaliaza, nuestro centro combina la
                medicina basada en evidencia con el respeto profundo por la fisiologia del nacimiento.
              </p>
              <p className="mb-6 leading-relaxed text-gray-500">
                Creemos que cada mujer merece ser escuchada, acompanada y respetada en una de las
                experiencias mas trascendentes de su vida. Por eso, ofrecemos atencion integral
                que abarca desde el embarazo hasta el postparto, asi como formacion profesional
                para quienes comparten nuestra vision.
              </p>
              <p className="font-script text-xl text-pink">&quot;Porque nacer es un acto de amor&quot;</p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-4 border-white shadow-lg">
                <div className="flex h-80 w-full items-center justify-center bg-gradient-to-br from-pink-light to-blue-light">
                  <Camera className="h-16 w-16 text-navy opacity-20" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="inline-block rounded-full bg-navy/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    <Camera className="mr-1 inline-block h-3 w-3" /> Reemplazar con foto real del equipo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-20" data-aos="fade-up">
            <h3 className="mb-10 text-center text-2xl font-bold text-navy">Nuestro Equipo</h3>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { initials: "DS", name: "Obst. Diana Silva", role: "Fundadora & Directora", desc: "Obstetra especialista en parto humanizado. Certificada en Spinning Babies y Tecnica Rebozo." },
                { initials: "DC", name: "Dr. Chacaliaza", role: "Co-Fundador & Director Medico", desc: "Medico ginecologo-obstetra con enfoque en medicina humanizada y nacimiento respetado." },
                { initials: "ED", name: "Equipo Docente", role: "Docentes Especializados", desc: "Profesionales de la salud con formacion en maternidad humanizada y pedagogia." },
                { initials: "EA", name: "Equipo Asistencial", role: "Soporte & Atencion", desc: "Personal dedicado a brindarte la mejor experiencia en cada visita y consulta." },
              ].map((m) => (
                <div key={m.initials} className="team-member">
                  <div className="team-photo">{m.initials}</div>
                  <h4 className="text-lg font-bold text-navy">{m.name}</h4>
                  <p className="text-sm font-medium text-pink">{m.role}</p>
                  <p className="mx-auto mt-2 max-w-xs text-xs text-gray-400">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recognitions */}
          <div className="mb-16" data-aos="fade-up">
            <h3 className="mb-8 text-center text-2xl font-bold text-navy">Reconocimientos y Alianzas</h3>
            <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Award, iconColor: "text-pink", iconBg: "bg-pink-light", title: "Spinning Babies", desc: "Beca y certificacion internacional en tecnicas de posicionamiento fetal." },
                { icon: Globe, iconColor: "text-blue", iconBg: "bg-blue-light", title: "Convenios Internacionales", desc: "Alianzas con instituciones de salud materna en Latinoamerica y Europa." },
                { icon: Trophy, iconColor: "text-pink", iconBg: "bg-pink-light", title: "Reconocimiento Regional", desc: "Pioneros en atencion de parto humanizado en la region Lambayeque." },
              ].map((r) => (
                <div key={r.title} className="recognition-card flex items-start gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${r.iconBg}`}>
                    <r.icon className={`h-6 w-6 ${r.iconColor}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy">{r.title}</h4>
                    <p className="mt-1 text-xs text-gray-400">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-2 gap-6 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-4" data-aos="fade-up">
            {[
              { val: "5+", label: "Anos de experiencia" },
              { val: "+1,000", label: "Alumnos formados" },
              { val: "4 ediciones", label: "Diplomados realizados" },
              { val: "+500", label: "Partos humanizados" },
            ].map((c) => (
              <div key={c.label} className="counter-box">
                <div className="counter-number">{c.val}</div>
                <div className="counter-label">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NOTICIAS ===== */}
      <section id="noticias" className="bg-white py-20 md:py-28">
        <div className="container-main">
          <div className="mb-16 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Mantente informado</p>
            <h2 className="section-title mb-4">Noticias y Novedades</h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { day: "15", month: "Mar 2026", title: "Beca Spinning Babies para NeoSer", desc: "NeoSer recibio la prestigiosa beca de Spinning Babies para la formacion avanzada en tecnicas de posicionamiento fetal, consolidando su liderazgo en la region.", icon: Award },
              { day: "02", month: "Feb 2026", title: "Dr. Chacaliaza: Reconocimiento Nacional", desc: "El Dr. Chacaliaza fue reconocido por su contribucion a la medicina humanizada en el Peru, destacando su labor en la promocion del parto respetado.", icon: Stethoscope },
              { day: "20", month: "Ene 2026", title: "La Historia de NeoSer: 5 Anos Transformando Vidas", desc: "Desde un sueno compartido hasta convertirnos en referentes de la maternidad humanizada en Lambayeque. Conoce nuestra historia.", icon: Heart },
            ].map((n, i) => (
              <div key={n.title} className="news-card" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="news-image">
                  <div className="news-date">
                    <span className="block text-lg font-bold">{n.day}</span>
                    <span className="text-[10px] uppercase">{n.month}</span>
                  </div>
                  <n.icon className="h-16 w-16 text-navy opacity-20" />
                </div>
                <div className="news-body">
                  <h3 className="mb-2 text-lg font-bold text-navy">{n.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-500">{n.desc}</p>
                  <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-pink transition-colors hover:text-pink-dark">
                    Leer mas <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RESERVA ===== */}
      <section id="reserva" className="bg-cream py-20 md:py-28">
        <div className="container-main">
          <div className="mb-16 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Agenda tu atencion</p>
            <h2 className="section-title mb-4">Reserva de Citas</h2>
            <div className="section-divider mx-auto" />
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Elige el horario disponible que mejor te convenga. Si prefieres atencion directa, tambien puedes escribirnos por WhatsApp.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3" data-aos="fade-up">
            <div className="space-y-6">
              <BookingPreform />
              <div className="surface-card space-y-4 p-6">
              <h3 className="text-xl font-bold text-navy">Antes de reservar</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Comparte tu nombre y WhatsApp para confirmar la cita.</li>
                <li>Selecciona el tipo de atencion y horario disponible.</li>
                <li>Recibiras confirmacion automatica de la reserva.</li>
              </ul>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center"
              >
                <Calendar className="h-5 w-5" /> Abrir calendario de reservas
              </a>
            </div>
            </div>
            <div className="surface-card overflow-hidden lg:col-span-2">
              {calBookingUrl ? (
                <iframe
                  title="Calendario de reservas NeoSer"
                  src={calBookingUrl}
                  className="h-[720px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-[420px] flex-col items-center justify-center gap-3 p-10 text-center text-gray-500">
                  <Calendar className="h-12 w-12 text-navy/30" />
                  <p className="max-w-md text-sm">
                    El calendario de reservas aun no esta configurado. Usa el boton para reservar por WhatsApp mientras activamos Cal.com.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section id="contacto" className="bg-cream py-20 md:py-28">
        <div className="container-main">
          <div className="mb-16 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Estamos para ti</p>
            <h2 className="section-title mb-4">Contactanos</h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="grid gap-12 lg:grid-cols-2" data-aos="fade-up">
            <div>
              <div className="contact-info-card mb-8">
                <h3 className="mb-6 text-xl font-bold text-navy">Informacion de Contacto</h3>
                <div className="space-y-5">
                  {[
                    { icon: MapPin, iconColor: "text-pink", iconBg: "bg-pink-light", label: "Direccion", value: "Calle Los Sauces 542, Urb. Santa Victoria, Chiclayo, Lambayeque, Peru" },
                    { icon: Phone, iconColor: "text-blue", iconBg: "bg-blue-light", label: "Telefono", value: "+51 932 713 071" },
                    { icon: Mail, iconColor: "text-pink", iconBg: "bg-pink-light", label: "Email", value: "contacto@neoser.pe" },
                    { icon: Clock, iconColor: "text-blue", iconBg: "bg-blue-light", label: "Horario", value: "Lunes a Sabado: 8:00 AM - 7:00 PM" },
                  ].map((c) => (
                    <div key={c.label} className="flex items-start gap-4">
                      <div className={`contact-icon ${c.iconBg}`}><c.icon className={`h-5 w-5 ${c.iconColor}`} /></div>
                      <div>
                        <p className="text-sm font-semibold text-navy">{c.label}</p>
                        <p className="text-sm text-gray-500">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <p className="mb-3 text-sm font-semibold text-navy">Siguenos</p>
                  <div className="flex gap-3">
                    <a href="https://www.instagram.com/neoserper" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-light text-pink transition-all hover:bg-pink hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>
                    </a>
                    <a href="https://www.facebook.com/NeoSerPeru" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-light text-blue transition-all hover:bg-blue hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.604 0 8.05 0 12.067 2.928 15.396 6.75 16v-5.624H4.718V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.822-.604 6.75-3.934 6.75-7.951z"/></svg>
                    </a>
                    <a href="https://www.tiktok.com/@neoserperu" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-light text-pink transition-all hover:bg-pink hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center py-4 text-lg">
                <MessageCircle className="h-6 w-6" /> Escribenos por WhatsApp
              </a>
            </div>
            <div className="space-y-6">
              <ContactLeadForm />
              <div className="surface-card p-4">
                <GoogleMapEmbed query="Calle Los Sauces 542, Urbanizacion Santa Victoria, Chiclayo, Lambayeque, Peru" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer py-16">
        <div className="container-main">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-4 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>NeoSer</p>
              <p className="text-sm leading-relaxed opacity-70">
                Centro de maternidad y medicina humanizada en Chiclayo. Acompanamos cada etapa de tu maternidad con calidez y profesionalismo.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Enlaces Rapidos</h4>
              <ul className="space-y-2 text-sm">
                {["inicio","servicios","cursos","nosotros","noticias"].map((l) => (
                  <li key={l}><a href={`#${l}`}>{l.charAt(0).toUpperCase()+l.slice(1)}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Servicios</h4>
              <ul className="space-y-2 text-sm">
                {["Control Prenatal","Parto Humanizado","Tecnica Rebozo","Preparacion al Parto","Postparto"].map((s) => (
                  <li key={s}><a href="#servicios">{s}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 flex-shrink-0 text-pink" /> Calle Los Sauces 542, Chiclayo</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 flex-shrink-0 text-pink" /> +51 932 713 071</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 flex-shrink-0 text-pink" /> contacto@neoser.pe</li>
              </ul>
              <div className="mt-4 flex gap-3">
                {[
                  { href: "https://www.instagram.com/neoserper", svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg> },
                  { href: "https://www.facebook.com/NeoSerPeru", svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.604 0 8.05 0 12.067 2.928 15.396 6.75 16v-5.624H4.718V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.822-.604 6.75-3.934 6.75-7.951z"/></svg> },
                  { href: "https://www.tiktok.com/@neoserperu", svg: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0z"/></svg> },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-pink">{s.svg}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-divider mt-10 flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
            <p className="text-sm opacity-60">&copy; 2026 NeoSer - Maternidad y Medicina Humanizada. Todos los derechos reservados.</p>
            <p className="text-xs opacity-40">Desarrollado por <a href="https://cofoundy.dev" target="_blank" rel="noopener noreferrer" className="hover:text-pink">Cofoundy</a></p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a href="https://wa.me/51932713071?text=Hola%2C%20quiero%20informacion%20sobre%20NeoSer" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Contactar por WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </main>
  );
}
