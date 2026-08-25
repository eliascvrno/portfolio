import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

const dict = {
  es: {
    nav: { home: "Inicio", about: "Sobre mí", projects: "Proyectos", experience: "Experiencia", skills: "Habilidades", tech: "Tecnologías", education: "Educación", contact: "Contacto" },
    hero: { hello: "¡Hola! Soy", viewProjects: "Ver mis proyectos", aboutMe: "Sobre mí", downloadCV: "Descargar CV", available: "Disponible para trabajar", availableNew: "Disponible para nuevos proyectos freelance", contact: "Contactar" },
    stats: { years: "Años de experiencia", projects: "Proyectos completados", tech: "Tecnologías dominadas", commitment: "Compromiso" },
    sections: { featured: "Mis Proyectos", featuredTitle: "Proyectos Destacados", viewAll: "Ver todos los proyectos", all: "Todos", web: "Web Apps", mobile: "Mobile Apps", ecommerce: "E-commerce", dashboard: "Dashboard", api: "API's", visit: "Visitar", repo: "Ver repo", expand: "Maximizar", close: "Cerrar" },
    contact: { title: "Hablemos", subtitle: "¿Tienes un proyecto en mente? Escríbeme.", name: "Nombre", email: "Email", subject: "Asunto", message: "Mensaje", send: "Enviar mensaje", sent: "Mensaje enviado, gracias!", error: "Ocurrió un error" },
    chat: { title: "Pregúntale a la IA sobre Elias", placeholder: "Escribe tu pregunta...", send: "Enviar", subtitle: "Asistente entrenado con mi perfil" },
    admin: { title: "Panel de administración", login: "Iniciar sesión", logout: "Cerrar sesión", dashboard: "Dashboard", projects: "Proyectos", experience: "Experiencia", education: "Educación", skills: "Habilidades", tech: "Tecnologías", messages: "Mensajes", profile: "Perfil", analytics: "Analíticas", new: "Nuevo", save: "Guardar", delete: "Eliminar", edit: "Editar", cancel: "Cancelar" },
    auth: { signin: "Inicia sesión en el admin", email: "Email", password: "Contraseña", signinBtn: "Entrar", signup: "Crear cuenta", google: "Continuar con Google", noAccount: "¿Sin cuenta?", haveAccount: "¿Ya tienes cuenta?", firstAdmin: "El primer usuario registrado se convierte en administrador." },
  },
  en: {
    nav: { home: "Home", about: "About me", projects: "Projects", experience: "Experience", skills: "Skills", tech: "Technologies", education: "Education", contact: "Contact" },
    hero: { hello: "Hi! I'm", viewProjects: "View my projects", aboutMe: "About me", downloadCV: "Download CV", available: "Available to work", availableNew: "Available for new freelance projects", contact: "Contact" },
    stats: { years: "Years of experience", projects: "Completed projects", tech: "Technologies mastered", commitment: "Commitment" },
    sections: { featured: "My Projects", featuredTitle: "Featured Projects", viewAll: "View all projects", all: "All", web: "Web Apps", mobile: "Mobile Apps", ecommerce: "E-commerce", dashboard: "Dashboard", api: "API's", visit: "Visit", repo: "View repo", expand: "Maximize", close: "Close" },
    contact: { title: "Let's talk", subtitle: "Have a project in mind? Write me.", name: "Name", email: "Email", subject: "Subject", message: "Message", send: "Send message", sent: "Message sent, thanks!", error: "An error occurred" },
    chat: { title: "Ask AI about Elias", placeholder: "Type your question...", send: "Send", subtitle: "Assistant trained on my profile" },
    admin: { title: "Admin panel", login: "Sign in", logout: "Sign out", dashboard: "Dashboard", projects: "Projects", experience: "Experience", education: "Education", skills: "Skills", tech: "Technologies", messages: "Messages", profile: "Profile", analytics: "Analytics", new: "New", save: "Save", delete: "Delete", edit: "Edit", cancel: "Cancel" },
    auth: { signin: "Sign in to admin", email: "Email", password: "Password", signinBtn: "Sign in", signup: "Create account", google: "Continue with Google", noAccount: "No account?", haveAccount: "Have an account?", firstAdmin: "The first registered user becomes administrator." },
  },
} as const;

type Dict = (typeof dict)["es"];

const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({
  lang: "es", t: dict.es as Dict, setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  };
  return <Ctx.Provider value={{ lang, t: dict[lang] as Dict, setLang }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);