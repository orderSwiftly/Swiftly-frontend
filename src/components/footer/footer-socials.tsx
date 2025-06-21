import { Twitter, Github, Linkedin, Mail } from "lucide-react";

export default function FooterSocials() {
  const socials = [
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/yourhandle", // Replace with your actual URL
    },
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/yourusername", // Replace with your actual URL
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/yourprofile", // Replace with your actual URL
    },
    {
      icon: Mail,
      label: "Mail",
      href: "mailto:tredia08@gmail.com",
    },
  ];

  return (
    <div className="flex gap-3 mt-4">
      {socials.map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="p-2 rounded-md bg-white/10 hover:bg-[var(--acc-clr)] text-[var(--txt-clr)] transition cursor-pointer"
        >
          <social.icon size={16} />
        </a>
      ))}
    </div>
  );
}