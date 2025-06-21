type FooterColumnProps = {
    title: string;
    items: string[];
  };
  
  export default function FooterColumn({ title, items }: FooterColumnProps) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-white font-semibold text-sm pry-ff">{title}</h3>
        <ul className="text-sm text-white/70 space-y-1">
          {items.map((item, index) => (
            <li key={index} className="hover:text-[var(--acc-clr)] sec-ff cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
}  