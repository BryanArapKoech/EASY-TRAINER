// components/shared/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Easy Trainer. A craft of{" "}
          <a
            href="https://github.com/Tangent-Code-Studios" 
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Tangent Code Studios
          </a>.
        </p>
      </div>
    </footer>
  );
}