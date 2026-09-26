type CatalogLabelProps = {
  index: string;
  children: string;
  tone?: "light" | "dark";
};

export function CatalogLabel({
  index,
  children,
  tone = "light",
}: CatalogLabelProps) {
  return (
    <p
      className={`catalog-label ${tone === "dark" ? "text-cream" : "text-ink/85"}`}
    >
      <span className={tone === "dark" ? "!text-amber-300 font-bold" : ""}>
        {index}
      </span>
      <span>{children}</span>
    </p>
  );
}
