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
      className={`catalog-label ${tone === "dark" ? "text-cream/70" : "text-ink/60"}`}
    >
      <span>{index}</span>
      <span>{children}</span>
    </p>
  );
}
